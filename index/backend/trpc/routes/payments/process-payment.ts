import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";

export const paymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("USD"),
  paymentMethodId: z.string(),
  description: z.string().optional(),
});

export default protectedProcedure
  .input(paymentSchema)
  .mutation(async ({ input, ctx }) => {
    // Simulate a slight delay for API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { amount, currency, paymentMethodId, description } = input;

    // Validate payment method (in a real app, we would check if it belongs to the user)
    if (!paymentMethodId.startsWith("pm_")) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid payment method",
      });
    }

    // Simulate payment processing
    // In a real app, we would call a payment gateway API
    const success = Math.random() > 0.1; // 90% success rate

    if (!success) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Payment processing failed. Please try again.",
      });
    }

    // Return payment confirmation
    return {
      id: `payment_${Date.now()}`,
      amount,
      currency,
      status: "succeeded",
      created: new Date().toISOString(),
      description: description || "Parking payment",
    };
  });