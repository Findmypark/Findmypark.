import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import loginRoute from "./routes/auth/login";
import registerRoute from "./routes/auth/register";
import verifyTokenRoute from "./routes/auth/verify-token";
import processPaymentRoute from "./routes/payments/process-payment";
import addPaymentMethodRoute from "./routes/payments/add-payment-method";
import verifyPaymentRoute from "./routes/payments/verify-payment";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: createTRPCRouter({
    login: loginRoute,
    register: registerRoute,
    verifyToken: verifyTokenRoute,
  }),
  payments: createTRPCRouter({
    processPayment: processPaymentRoute,
    addPaymentMethod: addPaymentMethodRoute,
    verifyPayment: verifyPaymentRoute,
  }),
});

export type AppRouter = typeof appRouter;