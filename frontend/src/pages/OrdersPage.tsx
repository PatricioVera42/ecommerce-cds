import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api"
import { formatDate } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import { ORDER_STATUS_LABEL, type Order } from "@/types/order"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router";


export function OrdersPage() {

    const ordersQuery = useQuery({
        queryKey: ["orders"],
        queryFn: () => api<Order[]>("/orders"),
    });

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-semibold">Tus Órdenes</h1>
            {ordersQuery.isPending ? (
                <p className="text-muted-foreground">Cargando órdenes...</p>
            ) : ordersQuery.isError ? (
                <p className="text-destructive">{ordersQuery.error.message}</p>
            ) : ordersQuery.data.length === 0 ? (
                <p className="text-muted-foreground">
                    Todavia no tenes órdenes. <Link to="/carrito" className="underline">Ir al carrito</Link>
                </p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead >Estado</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Cantidad de productos</TableHead>
                            <TableHead >Total</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { ordersQuery.data.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell >
                                    <Badge variant={
                                        order.status === "CANCELLED" ? "destructive"
                                        : order.status === "PAID" ? "default"
                                        : "secondary" 
                                    }>
                                        {ORDER_STATUS_LABEL[order.status]}
                                    </Badge>
                                </TableCell>
                                <TableCell> 
                                    <p>
                                    {formatDate(order.createdAt)} 
                                    </p>
                                </TableCell>
                                <TableCell >
                                    <p>{order.orderItems.length}</p>
                                </TableCell>
                                <TableCell>
                                    <p>{formatPrice(order.totalPrice)}</p>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-row-reverse">
                                        <Link to={`/ordenes/${order.id}`} className={buttonVariants({variant: "outline"})}>Ver detalle</Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                        }
                    </TableBody>
                </Table>
            )
            }
        </div>
    )
}