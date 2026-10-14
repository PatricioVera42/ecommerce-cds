import { Link, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Order } from "@/types/order";

export function CheckoutCancelPage() {
    const [params] = useSearchParams();

    const orderId = params.get("order_id");

    const cancelQuery = useQuery({
        queryKey: ["canceled-order", orderId],
        queryFn: () => {
            return api<Order>(`/orders/${orderId}/cancel`, {
                method: "POST",
            })
        },
        retry: false,
        enabled: orderId !== null,
    });

    if (!orderId) {
        return <p className="text-destructive">Falta el identificador de la orden.</p>;
    }

    return (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
            {cancelQuery.isPending ? (
                <p className="text-muted-foreground">Cancelando el pago...</p>
            ) : cancelQuery.isError ? (
                <>
                    <p className="text-destructive">{cancelQuery.error.message}</p>
                    <Link to="/carrito" className={buttonVariants({ variant: "outline" })}>Volver al carrito</Link>
                </>
            ) : (
                <>
                    <CircleX className="size-12 text-muted-foreground" />
                    <h1 className="text-2xl font-semibold">Pago cancelado</h1>
                    <p className="text-muted-foreground">No se te cobró nada. Tu carrito sigue igual.</p>
                    <div className="flex gap-2">
                        <Link to="/carrito" className={buttonVariants()}>Volver al carrito</Link>
                        <Link to="/" className={buttonVariants({ variant: "outline" })}>Seguir comprando</Link>
                    </div>
                </>
            )}
        </div>
    );
}
