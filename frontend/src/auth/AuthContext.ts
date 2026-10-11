import { createContext, useContext } from "react";

export type User = { id: string, name: string, email: string, role: "CUSTOMER" | "ADMIN" };

interface AuthContextValue {
     user: User | null, 
     isLoading: boolean, 
     login: (token: string, user: User) => void,
     logout: () => void };


export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (context === null) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return context;
}