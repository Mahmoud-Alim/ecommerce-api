import mongoose from "mongoose";
import Order from "../models/order.js";
import OrderItem from "../models/order-item.js";
import Product from "../models/product.js";
import AppError from "../utils/AppError.js";

export const getAllOrders = async ({ page = 1, limit = 20 } = {}) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, parseInt(limit) || 20);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find()
      .select("status totalPrice dateOrdered user phone")
      .populate("user", "name email")
      .sort({ dateOrdered: -1 })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(),
  ]);

  return {
    orders,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  };
};

export const getOrderById = async (id) => {
  const order = await Order.findById(id)
    .populate("user", "name email")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });
  if (!order) throw new AppError("Order not found", 404);
  return order;
};

export const getTotalSales = async () => {
  const result = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);
  if (!result.length) throw new AppError("No sales data found", 404);
  return result[0].totalSales;
};

export const getOrderCount = async () => {
  return Order.countDocuments();
};

export const getUserOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate("user", "name email")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });

  if (!orders.length) throw new AppError("No orders found for this user", 404);
  return orders;
};

export const createOrder = async (orderData, userId) => {
  const { orderItems, shippingAddress1, shippingAddress2, city, zip, country, phone, status } = orderData;

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new AppError("orderItems must be a non-empty array", 400);
  }
  if (!shippingAddress1 || !city || !zip || !country || !phone) {
    throw new AppError("Missing required shipping fields: shippingAddress1, city, zip, country, phone", 400);
  }

  // Consolidate quantities per product
  const requiredQuantities = orderItems.reduce((acc, item) => {
    const pid = String(item.product);
    const qty = Number(item.quantity) || 0;
    acc[pid] = (acc[pid] || 0) + qty;
    return acc;
  }, {});

  const productIds = Object.keys(requiredQuantities);
  const products = await Product.find({ _id: { $in: productIds } }).select("price countInStock").lean();

  if (products.length !== productIds.length) {
    throw new AppError("One or more products not found", 400);
  }

  const priceMap = Object.fromEntries(products.map((p) => [String(p._id), p.price]));

  // Attempt to use transactions; if not supported (e.g., standalone mongod), fallback to safe compensation approach
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // Atomically decrement stock for each product within transaction
    for (const pid of productIds) {
      const reqQty = requiredQuantities[pid];
      const updated = await Product.findOneAndUpdate(
        { _id: pid, countInStock: { $gte: reqQty } },
        { $inc: { countInStock: -reqQty } },
        { new: true, session }
      );
      if (!updated) {
        throw new AppError(`Insufficient stock for product ${pid}`, 400);
      }
    }

    const createdItems = await OrderItem.insertMany(
      orderItems.map((item) => ({ quantity: item.quantity, product: item.product })),
      { session }
    );
    const orderItemsIds = createdItems.map((i) => i._id);

    const totalPrice = orderItems.reduce((sum, item) => {
      const price = priceMap[String(item.product)] ?? 0;
      return sum + price * item.quantity;
    }, 0);

    const [order] = await Order.create(
      [{
        orderItems: orderItemsIds,
        shippingAddress1,
        shippingAddress2,
        city,
        zip,
        country,
        phone,
        status: status || "Pending",
        totalPrice,
        user: userId,
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return order;
  } catch (err) {
    // If transactions are not supported by the server, fallback to compensation logic
    const msg = err && err.message ? String(err.message) : "";
    if (msg.includes("Transaction numbers are only allowed")) {
      if (session) {
        try { await session.abortTransaction(); } catch (_) {}
        session.endSession();
      }

      // Fallback: perform per-product atomic decrements and compensate on failure
      const compensated = [];
      try {
        for (const pid of productIds) {
          const reqQty = requiredQuantities[pid];
          const updated = await Product.findOneAndUpdate(
            { _id: pid, countInStock: { $gte: reqQty } },
            { $inc: { countInStock: -reqQty } },
            { new: true }
          );
          if (!updated) {
            // rollback previous updates
            for (const u of compensated) {
              await Product.findByIdAndUpdate(u.pid, { $inc: { countInStock: u.qty } });
            }
            throw new AppError(`Insufficient stock for product ${pid}`, 400);
          }
          compensated.push({ pid, qty: reqQty });
        }

        // create order items and order (no session)
        const createdItems = await OrderItem.insertMany(
          orderItems.map((item) => ({ quantity: item.quantity, product: item.product }))
        );
        const orderItemsIds = createdItems.map((i) => i._id);

        const totalPrice = orderItems.reduce((sum, item) => {
          const price = priceMap[String(item.product)] ?? 0;
          return sum + price * item.quantity;
        }, 0);

        const order = await Order.create({
          orderItems: orderItemsIds,
          shippingAddress1,
          shippingAddress2,
          city,
          zip,
          country,
          phone,
          status: status || "Pending",
          totalPrice,
          user: userId,
        });

        return order;
      } catch (err2) {
        throw err2;
      }
    }

    if (session) {
      try { await session.abortTransaction(); } catch (_) {}
      session.endSession();
    }
    throw err;
  }
};

export const updateOrder = async (id, status) => {
  if (!status) throw new AppError("Order status is required", 400);
  const order = await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  if (!order) throw new AppError("Order not found", 404);
  return order;
};

export const deleteOrder = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  if (!order) throw new AppError("Order not found", 404);
  return order;
};
