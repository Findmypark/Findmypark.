import { z } from "zod";
import { protectedProcedure } from "../../create-context";
import { TRPCError } from "@trpc/server";

const cardPaymentMethodSchema = z.object({
  type: z.literal("card"),
  cardNumber: z.string().length(16, "Card number must be 16 digits"),
  cardHolderName: z.string().min(2, "Cardholder name is required"),
  expiryMonth: z.number().min(1).max(12),
  expiryYear: z.number().min(new Date().getFullYear() % 100),
  cvv: z.string().min(3).max(4),
  isDefault: z.boolean().default(false),
});

const upiPaymentMethodSchema = z.object({
  type: z.literal("upi"),
  upiId: z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/, "Invalid UPI ID format"),
  isDefault: z.boolean().default(false),
});

export const paymentMethodSchema = z.discriminatedUnion("type", [
  cardPaymentMethodSchema,
  upiPaymentMethodSchema,
]);

export default protectedProcedure
  .input(paymentMethodSchema)
  .mutation(async ({ input, ctx }) => {
    // Simulate a slight delay for API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Process based on payment method type
    if (input.type === "card") {
      // In a real app, we would validate the card with a payment processor
      // For this mock, we'll just check if the card number is valid (Luhn algorithm)
      const isValidCard = validateCardNumber(input.cardNumber);
      
      if (!isValidCard) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid card number",
        });
      }

      // Return the payment method with a generated ID
      return {
        id: `pm_${Date.now()}`,
        type: "card",
        cardBrand: getCardBrand(input.cardNumber),
        last4: input.cardNumber.slice(-4),
        expiryMonth: input.expiryMonth,
        expiryYear: input.expiryYear,
        cardholderName: input.cardHolderName,
        isDefault: input.isDefault,
      };
    } else {
      // UPI payment method
      // In a real app, we might validate the UPI ID with a payment processor
      
      // Return the payment method with a generated ID
      return {
        id: `pm_${Date.now()}`,
        type: "upi",
        upiId: input.upiId,
        isDefault: input.isDefault,
      };
    }
  });

// Helper function to validate card number using Luhn algorithm
function validateCardNumber(cardNumber: string): boolean {
  // Remove any non-digit characters
  const digits = cardNumber.replace(/\D/g, "");
  
  // Check if the card number is all digits and has a valid length
  if (!/^\d+$/.test(digits) || digits.length !== 16) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through the digits in reverse
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}

// Helper function to determine card brand
function getCardBrand(cardNumber: string): string {
  const firstDigit = cardNumber.charAt(0);
  const firstTwoDigits = parseInt(cardNumber.substring(0, 2));
  
  if (firstDigit === "4") return "visa";
  if (firstTwoDigits >= 51 && firstTwoDigits <= 55) return "mastercard";
  if (firstTwoDigits === 34 || firstTwoDigits === 37) return "amex";
  if (firstTwoDigits === 62) return "unionpay";
  
  return "unknown";
}