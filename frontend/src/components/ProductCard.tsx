import type { Product } from "@/types/product";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import { Link, useNavigate } from "react-router";
import { ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Cart } from "@/types/cart";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const addToCartMutation = useMutation({
        mutationFn: () => {
            return api<Cart>("/cart/items", {
                method: "POST",
                body: JSON.stringify({ productId: product.id, quantity: 1}),
            })
        },
        onSuccess: (cart) => {
            queryClient.setQueryData(["cart"],cart);
            toast.success("Agregado al carrito");
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    function handleAddToCart(){
        if (!user) {
            navigate("/login");
            return;
        }
        addToCartMutation.mutate();
    }

    return (
        <Card>
                <Link to={`/productos/${product.id}`}>
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
                </Link>
                <CardFooter className="flex justify-between">
                    <p>{ formatPrice(product.price) }</p>
                    <Button variant="secondary" onClick={ handleAddToCart } disabled={addToCartMutation.isPending}>
                        Agregar al carrito
                    </Button>
                </CardFooter>            
            </Card>
    );
}