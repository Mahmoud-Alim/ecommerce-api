const signupSchema = z.object({
    body: z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Email is not valid"),
        password: z.string().min(6, "Password must be at least 6 characters")
    })
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Email is not valid"),
        password: z.string().min(1, "Password is required")
    })
});

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);