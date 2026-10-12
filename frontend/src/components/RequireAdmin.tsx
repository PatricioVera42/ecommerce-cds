import { useAuth } from "@/auth/AuthContext";
import { Navigate, Outlet } from "react-router";


export function RequireAdmin() {
    
    const { user, isLoading } = useAuth();
    
    if(isLoading) return null;
    
    if(!user) return <Navigate to="/login" replace/>;

    if(user.role !== "ADMIN") return <Navigate to="/" replace />

    return <Outlet />
}