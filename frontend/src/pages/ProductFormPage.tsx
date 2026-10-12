import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Product } from "@/types/product";

const productFormSchema = z.object({
    name: z.string().trim().min(1, { error: "El nombre es obligatorio" }),
    description: z.string().trim().min(1, { error: "La descripción es obligatoria" }),
    price: z.string()
            .refine((value) => {
                const number = Number(value.replace(",", "."));
                return number > 0 && number <= 10_000;
            }, { error: "Ingresá un precio mayor a 0 y hasta 10.000 USD" }), 
    active: z.boolean(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export function ProductFormPage() {
    const { id } = useParams();
    const isEdit = id !== undefined;

    const productQuery = useQuery({
        queryKey: ["admin", "products", id],
        queryFn: () => api<Product>(`/admin/products/${id}`),
        enabled: isEdit,
    });

    if (!isEdit) return <ProductForm />;

    if(productQuery.isPending) return <p className="text-muted-foreground">Cargando producto...</p>
    if(productQuery.isError) return <p className="text-destructive">{ productQuery.error.message }</p>

    return <ProductForm product={productQuery.data} />;
}

function ProductForm({ product }: { product?: Product }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: product ?
                    { name: product.name, description: product.description, price: (product.price / 100).toFixed(2).replace(".", ","), active: product.active} 
                : { name: "", description: "", price: "", active: true },
    });

    const saveMutation = useMutation({
        mutationFn: (data: { name: string; description: string; price: number; active: boolean }) => {
            if (product){
                return api<Product>(`/admin/products/${product.id}`, {
                    method: "PATCH",
                    body: JSON.stringify(data)
                })
            } else {
                return api<Product>("/admin/products", {
                    method: "POST",
                    body: JSON.stringify(data),
                })
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] })
            navigate("/admin/productos");
        }
    });

    function onSubmit(values: ProductFormValues) {
        const priceInCents = Math.round(Number(values.price.replace(",", ".")) * 100)
        saveMutation.mutate({name: values.name, 
                            description: values.description, 
                            price: priceInCents,
                            active: values.active })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto flex max-w-lg flex-col gap-4">
            <h1 className="text-2xl font-semibold">{product ? "Editar producto" : "Nuevo producto"}</h1>

            <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
                        <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Descripción</FieldLabel>
                        <Textarea {...field} id={field.name} rows={4} aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Precio (USD)</FieldLabel>
                        <Input {...field} id={field.name} inputMode="decimal" placeholder="27,90" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="active"
                control={form.control}
                render={({ field }) => (
                    <Field orientation="horizontal">
                        <Switch id={field.name} checked={field.value} onCheckedChange={field.onChange} />
                        <FieldLabel htmlFor={field.name}>Activo (visible en el catálogo)</FieldLabel>
                    </Field>
                )}
            />

            {saveMutation.isError && <p className="text-destructive">{saveMutation.error.message}</p>}

            <Button type="submit" disabled={saveMutation.isPending}>Guardar</Button>
        </form>
    );
}
