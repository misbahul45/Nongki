import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(100),
  businessName: z.string().trim().min(2).max(120),
  businessType: z
    .enum(["coffee_shop", "cafe", "restaurant", "bakery", "service", "other"])
    .default("other"),
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1),
});
