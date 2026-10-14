import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import { ORDER_STATUS_LABEL, type OrderDetail } from "@/types/order";

export function OrderDetailPage() {
    const { id } = useParams();

    const orderQuery = useQuery({
        queryKey: ["orders", id],
        queryFn: () => {
            return api<OrderDetail>(`/orders/${id}`);
        },
        retry: false,
    });

    return (
        <div className="flex flex-col gap-6">
            <Link to="/ordenes" className="flex items-center gap-1 text-sm text-muted-foreground hover:underline">
                <ArrowLeft className="size-4" /> Volver a mis órdenes
            </Link>

            {orderQuery.isPending ? (
                <p className="text-muted-foreground">Cargando orden...</p>
            ) : orderQuery.isError ? (
                <p className="text-destructive">{orderQuery.error.message}</p>
            ) : (
                <>
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold">Detalle de la orden</h1>
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Badge variant={
                            orderQuery.data.status === "CANCELLED" ? "destructive"
                            : orderQuery.data.status === "PAID" ? "default"
                            : "secondary"
                        }>
                            {ORDER_STATUS_LABEL[orderQuery.data.status]}
                        </Badge>
                        <span>{formatDate(orderQuery.data.createdAt)}</span>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">Imagen</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderQuery.data.orderItems.map((item) => (
                            <TableRow key={item.productId}>
                                <TableCell>
                                    {item.product.imageKey ? (
                                        <img
                                            src={ `${import.meta.env.VITE_API_URL}/uploads/${item.product.imageKey}` }
                                            alt={ item.productName }
                                            className="aspect-[3/4] w-full object-cover"
                                        />
                                    ) : (
                                        <div className="aspect-[3/4] w-full bg-muted flex items-center justify-center">
                                            <ImageOff className="size-6 text-muted-foreground" />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item.product.active ? (
                                        <Link to={`/productos/${item.productId}`} className="hover:underline">{ item.productName }</Link>
                                    ) : (
                                        <span>{ item.productName }</span>
                                    )}
                                </TableCell>
                                <TableCell>{ formatPrice(item.unitPrice) }</TableCell>
                                <TableCell>{ item.quantity }</TableCell>
                                <TableCell className="text-right">
                                    { formatPrice(item.quantity * item.unitPrice) }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex justify-end">
                    <span className="text-lg">Total: <strong>{ formatPrice(orderQuery.data.totalPrice) }</strong></span>
                </div>
                </>
            )}
        </div>
    );
}
