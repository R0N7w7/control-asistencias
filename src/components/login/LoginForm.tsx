"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginForm() {
    const [tipoUsuario, setTipoUsuario] = useState<"practicante" | "administrador">("practicante");

    const form = useForm({
        defaultValues: {
            correo: "",
            contraseña: "",
        },
    });

    const renderMensaje = () =>
        tipoUsuario === "practicante"
            ? "Ingresa como practicante para gestionar tus horas de servicio."
            : "Ingresa para validar, gestionar y administrar tus practicantes.";

    const handleSubmit = (data: object) => {
        toast("Enviando data al backend", {
            position: 'top-left',
            description: data.correo,
        });
    };

    return (
        <div className="border w-full max-w-xl px-3  py-6 flex flex-col gap-6 rounded-md shadow-md bg-white">
            <div>
                <h2 className="text-2xl font-extrabold text-[#FE5000]">Registro de Horas de Servicio Social</h2>
                <p className="text-gray-500 text-lg font-medium">{renderMensaje()}</p>
            </div>

            <Tabs
                defaultValue="practicante"
                className="w-full"
                onValueChange={(value) => setTipoUsuario(value as "practicante" | "administrador")}
            >
                <TabsList className="w-full grid grid-cols-2 h-max">
                    <TabsTrigger value="practicante" className="py-1 text-base font-medium">Practicante</TabsTrigger>
                    <TabsTrigger value="administrador" className="py-1 text-base font-medium">Administrador</TabsTrigger>
                </TabsList>
            </Tabs>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                        name="correo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel><p className="text-lg">Correo</p></FormLabel>
                                <FormControl>
                                    <Input placeholder="correo@dominio.com" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="contraseña"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel><p className="text-lg">Contraseña</p></FormLabel>
                                <FormControl>
                                    <Input placeholder="••••••••" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full py-5 text-xl bg-red-700">
                        Iniciar sesión
                    </Button>
                </form>
            </Form>
        </div>
    );
}
