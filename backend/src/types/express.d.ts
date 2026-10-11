export type AuthUser = { id: string; role: "CUSTOMER" | "ADMIN" };

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}