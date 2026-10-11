import { useAuth, type User } from "@/auth/AuthContext";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const registerSchema = z.object({
    name: z.string().min(1, {error: "El nombre es obligatorio"}),
    email: z.email({ error: "Ingresá un email válido" }),
    password: z.string().min(8, { error: "La contraseña debe tener al menos 8 caracteres" }),
});

type RegisterValues = z.infer<typeof registerSchema>;


export function RegisterPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", email: "", password: ""},
    });

    const registerMutation = useMutation({
        mutationFn: (values: RegisterValues) =>
            api<{ token: string, user: User}>("/auth/register", {
                method: "POST",
                body: JSON.stringify(values),
            }),
        onSuccess: (data) => {
            login(data.token, data.user);
            navigate("/");
        }
    });

    function onSubmit(values: RegisterValues) {
        registerMutation.mutate(values);
    }

    return (
        <form onSubmit={ form.handleSubmit(onSubmit) } className="mx-auto flex max-w-sm flex-col gap-4">
            <h1 className="text-2xl font-bold">Crear cuenta</h1>

            <Controller 
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Nombre</FieldLabel>
                        <Input {... field} id={field.name} aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller 
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input {... field} id={field.name} type="email" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller 
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Contraseña</FieldLabel>
                        <Input {... field} id={field.name} type="password" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            {registerMutation.isError && <p className="text-destructive">{registerMutation.error.message}</p>}

            <Button type="submit" disabled={registerMutation.isPending}>Crear cuenta</Button>

        </form>
    );
};