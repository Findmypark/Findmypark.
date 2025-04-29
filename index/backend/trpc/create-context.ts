import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "hono";
import { z } from "zod";

// Define the context type
export interface TRPCContext {
  user?: {
    id: string;
    email: string;
  };
  token?: string;
}

// Create context from Hono request
export async function createContext(c: Context): Promise<TRPCContext> {
  try {
    // Get authorization header
    const authHeader = c.req.header("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No token provided, return empty context
      return {};
    }
    
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    
    // In a real app, we would verify the JWT token
    // For this mock, we'll just check if it starts with "token_"
    if (!token.startsWith("token_")) {
      return {};
    }
    
    // Mock user data (in a real app, we would decode the JWT)
    const user = {
      id: "user_" + Math.random().toString(36).substring(2, 9),
      email: "user@example.com",
    };
    
    return { user, token };
  } catch (error) {
    // If token verification fails, return empty context
    return {};
  }
}

// Initialize tRPC
const t = initTRPC.context<TRPCContext>().create();

// Create router
export const createTRPCRouter = t.router;

// Create middleware
export const middleware = t.middleware;

// Create procedures
export const publicProcedure = t.procedure;

// Auth middleware
const isAuthed = middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Protected procedure (requires authentication)
export const protectedProcedure = t.procedure.use(isAuthed);