import { z } from "zod";

export const registerSchema = z.object({
 name: z.string().trim().min(2, "Name must be at least 2 characters").max(100), 
 
 email: z.string().trim().email("Please provide a valid email address"), 
 
 password: z.string().min(8, "Password must be at least 8 characters").max(128), 
 
 organizationName: z.string().trim().min(2, "Organization name must be at least 2 characters").max(100)
});

export type RegisterInput = z.infer<typeof registerSchema>;