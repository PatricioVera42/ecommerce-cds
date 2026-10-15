import { useAuth } from "@/auth/AuthContext";
import { Outlet, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, ShoppingCart, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";


export function Layout() {

    const { resolvedTheme, setTheme } = useTheme();
    const { user, logout } = useAuth();
    
    return (
        <>
        <header className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b px-6 py-3 text-sm">
            <Link to="/">Librería</Link>
            <nav className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-2 whitespace-nowrap">
                {user ? (
                    <>
                        {user.role === "ADMIN" && <Link to="/admin/productos">Panel</Link>}
                        <Link to="/carrito">
                            <ShoppingCart className="size-4 sm:hidden" />
                            <span className="hidden sm:inline">Carrito</span>
                        </Link>
                        <Link to="/ordenes">Mis Órdenes</Link>
                        <span className="hidden sm:flex items-center gap-1 text-muted-foreground">
                            <User className="size-4" />
                            {user.name}
                        </span>
                        <Button variant="ghost" onClick={logout}>
                            <LogOut className="size-4 sm:hidden" />
                            <span className="hidden sm:inline">Cerrar sesión</span>
                        </Button>                    
                    </>
                ) : (
                    <>
                        <Link to="/login">Ingresar</Link>
                        <Link to="/registro">Registrarse</Link>
                    </>
                    )}
                    <Button variant="ghost" size="icon" 
                        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    >
                        { resolvedTheme === "dark" ? <Sun /> : <Moon /> }
                    </Button>
            </nav>
        </header>
        
        <main className="mx-auto max-w-5xl px-6 py-8">
            <Outlet />
        </main>
        </>
    );
}