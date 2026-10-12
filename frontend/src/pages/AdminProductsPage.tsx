import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/formatPrice";
import type { Product } from "@/types/product";

export function AdminProductsPage() {
    const queryClient = useQueryClient();

    const productsQuery = useQuery({
        queryKey: ["admin", "products"],
        queryFn: () => api<Product[]>("/admin/products"),
    });

    const toggleActiveMutation = useMutation({
        mutationFn: (data: {id: string, active: boolean}) => {
            return api<Product>(`/admin/products/${data.id}`, {
                method: "PATCH",
                body: JSON.stringify({ active: data.active }),
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] })
        }
    });

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-2xl font-semibold">Productos</h1>

            {productsQuery.isPending ? (
                <p className="text-muted-foreground">Cargando productos...</p>
            ) : productsQuery.isError ? (
                <p className="text-destructive">{productsQuery.error.message}</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">Imagen</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Activo</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productsQuery.data.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                        {product.imageKey ? (
                                        <img
                                            src= { `${import.meta.env.VITE_API_URL}/uploads/${product.imageKey}` }
                                            alt={ product.name }
                                            className="aspect-[3/4] w-full object-cover"
                                        />
                                        ): (
                                            <div className="aspect-[3/4] w-full bg-muted flex items-center justify-center">
                                                <ImageOff className="size-8 text-muted-foreground" /> 
                                            </div>    
                                        )}
                                </TableCell>
                                <TableCell>{ product.name }</TableCell>
                                <TableCell>{ formatPrice(product.price) }</TableCell>
                                <TableCell>
                                    <Switch 
                                        checked={product.active}
                                        onCheckedChange={(checked) => 
                                            toggleActiveMutation.mutate({ id: product.id, active: checked})}    
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link to={`/admin/productos/${product.id}`}> Editar </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
