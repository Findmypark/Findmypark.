import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";

// Mock user database (same as in login.ts)
const users = [
  {
    id: "user_1",
    email: "demo@parkeasy.com",
    password: "password123",
    name: "Demo User",
    phone: "+1234567890",
  },
  {
    id: "user_2",
    email: "john@example.com",
    password: "password123",
    name: "John Doe",
    phone: "+1987654321",
  },
];

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export default publicProcedure
  .input(registerSchema)
  .mutation(async ({ input }) => {
    // Simulate a slight delay for API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const { email, password, name, phone } = input;

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "User with this email already exists",
      });
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password, // In a real app, this would be hashed
      name,
      phone: phone || "",
    };

    // In a real app, we would save this to a database
    users.push(newUser);

    // Generate a mock token (in a real app, use JWT)
    const token = `token_${Math.random().toString(36).substring(2, 15)}`;

    // Return user data and token (excluding password)
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
      },
      token,
    };
  });