import { api } from "@/lib/api";
import { formatPrice } from "@/lib/formatPrice";
import type { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { ImageOff } from "lucide-react";
import { useParams } from "react-router";


export function ProductPage(){
    const { id } = useParams();

    const productQuery = useQuery({
        queryKey: ["product", id],
        queryFn: () => api<Product>(`/products/${id}`),
        retry: false,
    });
    
    return productQuery.isPending ? (
        <p className="text-muted-foreground">Cargando producto...</p>
    ) : productQuery.isError ? (
        <p className="text-destructive">{productQuery.error.message}</p>
    ) : (
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
            {productQuery.data.imageKey ? (
                <img
                    src= { `${import.meta.env.VITE_API_URL}/uploads/${productQuery.data.imageKey}` }
                    alt={ productQuery.data.name }
                    className="aspect-[3/4] w-full object-cover"
                />
            ): (
                <div className="aspect-[3/4] w-full bg-muted flex items-center justify-center">
                    <ImageOff className="size-8 text-muted-foreground" /> 
                </div>    
            )}
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-semibold">{productQuery.data.name}</h1>
                <p className="text-xl">{formatPrice(productQuery.data.price)}</p>
                <p className="text-muted-foreground">{productQuery.data.description}</p>
            </div>
        </div>
    )
    
}