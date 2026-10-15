import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageOff, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/formatPrice";
import type { Cart } from "@/types/cart";

export function CartPage() {
    const queryClient = useQueryClient();

    const cartQuery = useQuery({
        queryKey: ["cart"],
        queryFn: () => api<Cart>("/cart"),
    });

    const updateMutation = useMutation({
        mutationFn: (data: { productId: string, quantity: number }) => {
            return api<Cart>(`/cart/items/${data.productId}`, {
                method: "PATCH",
                body: JSON.stringify({ quantity: data.quantity }),
            })
        },
        onSuccess: (cart) => {
            queryClient.setQueryData(["cart"], cart);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const removeMutation = useMutation({
        mutationFn: (productId: string) => {
            return api<Cart>(`/cart/items/${productId}`, {
                method: "DELETE",
            })
        },
        onSuccess: (cart) => {
            queryClient.setQueryData(["cart"], cart);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    const checkoutMutation = useMutation({
        mutationFn: () => {
            return api<{ url: string }>("/checkout", {
                method: "POST",
            })
        },
        onSuccess: (data: { url: string}) => {
            window.location.href = data.url;
        },
        onError: (error) => {
            toast.error(error.message);
            if (error instanceof ApiError && error.status === 409){
                queryClient.invalidateQueries({ queryKey: ["cart"] });
            };
        }
    });

    const isMutating = updateMutation.isPending || removeMutation.isPending || checkoutMutation.isPending;

    const hasUnavailable = cartQuery.data?.items.some((i) => !i.product.active);

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-semibold">Carrito</h1>

            {cartQuery.isPending ? (
                <p className="text-muted-foreground">Cargando carrito...</p>
            ) : cartQuery.isError ? (
                <p className="text-destructive">{cartQuery.error.message}</p>
            ) : cartQuery.data.items.length === 0 ? (
                <p className="text-muted-foreground">
                    Tu carrito está vacío. <Link to="/" className="underline">Ver el catálogo</Link>
                </p>
            ) : (
                <>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">Imagen</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cartQuery.data.items.map((item) => (
                            <TableRow key={item.productId} className={item.product.active ? "" : "opacity-60"}>
                                <TableCell>
                                    {item.product.imageKey ? (
                                        <img
                                            src={ `${import.meta.env.VITE_API_URL}/uploads/${item.product.imageKey}` }
                                            alt={ item.product.name }
                                            className="aspect-[3/4] w-full object-cover"
                                        />
                                    ) : (
                                        <div className="aspect-[3/4] w-full bg-muted flex items-center justify-center">
                                            <ImageOff className="size-6 text-muted-foreground" />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Link to={`/productos/${item.productId}`}>{ item.product.name }</Link>
                                    {!item.product.active && (
                                        <p className="text-destructive text-xs">No disponible</p>
                                    )}
                                </TableCell>
                                <TableCell>{ formatPrice(item.product.price) }</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            disabled={isMutating || item.quantity <= 1}
                                            onClick={() => {
                                                updateMutation.mutate({ productId: item.productId, 
                                                            quantity: item.quantity - 1 });
                                            }}
                                        >
                                            <Minus />
                                        </Button>
                                        <span className="w-6 text-center">{ item.quantity }</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            disabled={isMutating || item.quantity >= 99}
                                            onClick={() => {                                                
                                                updateMutation.mutate({ productId: item.productId, 
                                                            quantity: item.quantity + 1 });
                                            }}
                                        >
                                            <Plus />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className={`text-right ${item.product.active ? "" : "line-through"}`}>
                                    { formatPrice(item.subtotal) }
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Quitar del carrito"
                                        disabled={isMutating}
                                        onClick={() => {
                                            removeMutation.mutate(item.productId);
                                        }}
                                    >
                                        <Trash2 />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-4">
                        <span className="text-lg">Total: <strong>{ formatPrice(cartQuery.data.total) }</strong></span>
                        <Button
                            disabled={isMutating || checkoutMutation.isSuccess || cartQuery.data.total === 0}

                            onClick={() => checkoutMutation.mutate()}
                        >
                            {checkoutMutation.isPending || checkoutMutation.isSuccess ? "Redirigiendo..." : "Pagar"}
                        </Button>
                    </div>
                    {hasUnavailable && (
                        <p className="text-muted-foreground text-sm">
                            Los productos no disponibles quedan en el carrito.
                        </p>
                    )}
                </div>
                </>
            )}
        </div>
    );
}
