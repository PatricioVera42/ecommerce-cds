import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function HomePage() {
    const [text, setText] = useState("");  
    const [search, setSearch] = useState(""); 
    
    const productsQuery = useQuery({
        queryKey: ["products", search],
        queryFn: () => api<Product[]>(`/products?search=${encodeURIComponent(search)}`),
    });
    
    return (
        <div className="flex flex-col gap-6">
            <form
                onSubmit={(e) => {e.preventDefault(); setSearch(text); }}
                className="flex gap-2"
            >
                <Input 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Buscar por título"
                />
                <Button type="submit">Buscar</Button>
            </form>

            {productsQuery.isPending ? (
                <p className="text-muted-foreground">Cargando productos...</p>
            ) : productsQuery.isError ? (
                <p className="text-destructive">{productsQuery.error.message}</p>
            ) : productsQuery.data.length === 0 ? (
                <p className="text-muted-foreground">No se encontraron productos para tu búsqueda.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {productsQuery.data.map((product) => (
                        <ProductCard key={ product.id } product={ product }/>
                    ))}
                </div>
            )}

        </div>
    );
};