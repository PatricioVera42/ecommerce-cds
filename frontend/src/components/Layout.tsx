import { Outlet, Link } from "react-router";

export function Layout() {
    return (
        <>
        <header>
            <Link to="/">Ir al Inicio</Link>
            <Link to="/login">Ir al Login</Link>
        </header>
        
        <main>
            <Outlet />
        </main>
        </>
    );
}