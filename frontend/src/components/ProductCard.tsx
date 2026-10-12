import type { Product } from "@/types/product";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import { Link } from "react-router";
import { ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
    
    
    return (
        <Link to={`/productos/${product.id}`}>
            <Card>
                <CardHeader>
                    <CardTitle>{ product.name }</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
                <CardFooter className="flex flex-row gap-5">
                    <p>{ formatPrice(product.price) }</p>
                    <Button>Agregar al carrito</Button>
                </CardFooter>            
            </Card>
        </Link>
    );
}