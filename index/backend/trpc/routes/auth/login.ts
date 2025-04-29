import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";

// Mock user database
const users = [
  {
    id: "user_1",
    email: "demo@parkeasy.com",
    password: "password123", // In a real app, this would be hashed
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

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default publicProcedure
  .input(loginSchema)
  .mutation(async ({ input }) => {
    // Simulate a slight delay for API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { email, password } = input;

    console.log("Login attempt with:", email, password);

    // Find user by email
    const user = users.find((u) => u.email === email);

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    // Generate a mock token (in a real app, use JWT)
    const token = `token_${Math.random().toString(36).substring(2, 15)}`;

    // Return user data and token (excluding password)
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
      token,
    };
  });