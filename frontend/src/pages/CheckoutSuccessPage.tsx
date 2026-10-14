import { Link, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/formatPrice";
import type { Order } from "@/types/order";

export function CheckoutSuccessPage() {
    const [params] = useSearchParams();

    const sessionId = params.get("session_id");

    const confirmQuery = useQuery({
        queryKey: ["checkout-confirm", sessionId],  
        queryFn: () => {                            // confirma el pago y devuelve la orden
            return api<Order>("/checkout/confirm", {
                method: "POST",
                body: JSON.stringify({ sessionId }),
            })
        },
        retry: false,
        enabled: sessionId !== null,
    });

    if (!sessionId) {
        return <p className="text-destructive">Falta el identificador del pago.</p>;
    }

    return (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
            {confirmQuery.isPending ? (
                <p className="text-muted-foreground">Confirmando el pago...</p>
            ) : confirmQuery.isError ? (
                <>
                    <p className="text-destructive">{confirmQuery.error.message}</p>
                    <Link to="/carrito" className={buttonVariants({ variant: "outline" })}>Volver al carrito</Link>
                </>
            ) : (
                <>
                    <CircleCheck className="size-12 text-primary" />
                    <h1 className="text-2xl font-semibold">¡Pago confirmado!</h1>
                    <p className="text-muted-foreground">
                        Tu orden quedó registrada. Total: <strong>{formatPrice(confirmQuery.data.totalPrice)}</strong>
                    </p>
                    <div className="flex gap-2">
                        <Link to="/ordenes" className={buttonVariants()}>Ver mis órdenes</Link>
                        <Link to="/" className={buttonVariants({ variant: "outline" })}>Seguir comprando</Link>
                    </div>
                </>
            )}
        </div>
    );
}
