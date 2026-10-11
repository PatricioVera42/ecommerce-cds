import { useAuth } from "@/auth/AuthContext";
import { Outlet, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";


export function Layout() {

    const { user, logout } = useAuth();
    
    return (
        <>
        <header className="flex items-center gap-6 border-b px-6 py-3 text-sm">
            <Link to="/">Librería</Link>
            <nav className="ml-auto flex gap-4 items-center">
                {user ? (
                    <>
                        {user.role === "ADMIN" && <Link to="/admin/productos">Panel</Link>}
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <User className="size-4" />
                            {user.name}
                        </span>
                        <Button variant="ghost" onClick={logout}>Cerrar sesión</Button>                    
                    </>
                ) : (
                    <>
                        <Link to="/login">Ingresar</Link>
                        <Link to="/registro">Registrarse</Link>
                    </>
                    )}
            </nav>
        </header>
        
        <main className="mx-auto max-w-5xl px-6 py-8">
            <Outlet />
        </main>
        </>
    );
}