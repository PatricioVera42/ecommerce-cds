import { Outlet, Link } from "react-router";

export function Layout() {
    return (
        <>
        <header className="flex items-center gap-6 border-b px-6 py-3">
            <Link to="/">Librería</Link>
            <nav className="ml-auto flex gap-4">
                <Link to="/login">Ingresar</Link>
                <Link to="/registro">Registrarse</Link>
            </nav>
        </header>
        
        <main className="mx-auto max-w-5xl px-6 py-8">
            <Outlet />
        </main>
        </>
    );
}