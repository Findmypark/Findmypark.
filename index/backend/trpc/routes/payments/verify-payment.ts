import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";

export default protectedProcedure
  .input(z.object({ paymentId: z.string() }))
  .query(async ({ input, ctx }) => {
    // Simulate a slight delay for API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { paymentId } = input;

    // Validate payment ID format
    if (!paymentId.startsWith("payment_")) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid payment ID",
      });
    }

    // In a real app, we would query the payment gateway for the status
    // For this mock, we'll just return a success response
    
    return {
      id: paymentId,
      status: "succeeded",
      verified: true,
      verifiedAt: new Date().toISOString(),
    };
  });