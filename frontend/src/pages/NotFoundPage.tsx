import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router";


export function NotFoundPage(){

    return (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
            <h1 className="text-2xl font-semibold">La página que buscás no existe.</h1>
            <Link to="/" className={buttonVariants({ variant: "outline" })}>Volver al inicio</Link>
        </div>
    );
}