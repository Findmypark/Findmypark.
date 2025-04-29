import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";

export default publicProcedure
  .input(z.object({ token: z.string() }))
  .query(async ({ input }) => {
    // Simulate a slight delay for API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    const { token } = input;

    // In a real app, we would verify the JWT token
    // For this mock, we'll just check if it starts with "token_"
    if (!token || !token.startsWith("token_")) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid token",
      });
    }

    // Return success
    return {
      valid: true,
    };
  });