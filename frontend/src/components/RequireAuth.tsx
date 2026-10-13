import { useAuth } from "@/auth/AuthContext";
import { Navigate, Outlet } from "react-router";


export function RequireAuth() {
    
    const { user, isLoading } = useAuth();
    
    if(isLoading) return null;
    
    if(!user) return <Navigate to="/login" replace/>;

    return <Outlet />
}