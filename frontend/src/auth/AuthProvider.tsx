import { api } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type React from "react";
import { useState } from "react";
import { AuthContext, type User } from "./AuthContext";

export function AuthProvider( { children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const meQuery = useQuery({ 
        queryKey: ["me"],
        queryFn: () => api<{ user: User }>("/auth/me"),
        enabled: token !== null,
        retry: false,    
    });

    function login(newToken: string, user: User) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        queryClient.setQueryData(["me"], { user });
    }

    function logout() { 
        localStorage.removeItem("token");
        setToken(null);
        queryClient.removeQueries({ queryKey: ["me"] });
    }

    const value = {
        user: meQuery.data?.user ?? null,
        isLoading: meQuery.isEnabled && meQuery.isPending, 
        login,
        logout,
    };

    return <AuthContext value={value}>{children}</AuthContext>;
}