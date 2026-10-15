import { useAuth, type User } from "@/auth/AuthContext";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const loginSchema = z.object({
  email: z.email({ error: "Ingresá un email válido" }),
  password: z.string().min(1, { error: "Ingresá la contraseña" }),
});

type LoginValues = z.infer<typeof loginSchema>;


export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: ""},
    });

    const loginMutation = useMutation({
        mutationFn: (values: LoginValues) =>
            api<{ token: string, user: User}>("/auth/login", {
                method: "POST",
                body: JSON.stringify(values),
            }),
        onSuccess: (data) => {
            login(data.token, data.user);
            const from = location.state?.from ?? "/";
            navigate(from, {replace: true});
        }
    });

    function onSubmit(values: LoginValues) {
        loginMutation.mutate(values);
    }

    return (
        <form onSubmit={ form.handleSubmit(onSubmit) } className="mx-auto flex max-w-sm flex-col gap-4">
            <h1 className="text-2xl font-bold">Ingresar</h1>

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

            {loginMutation.isError && <p className="text-destructive">{loginMutation.error.message}</p>}

            <Button type="submit" disabled={loginMutation.isPending}>Ingresar</Button>

        </form>
    );
};