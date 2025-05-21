"use client"
import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { SaveIcon } from "lucide-react";
import { createPracticante } from "@/lib/api/admin";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FormPracticanteProps {
    closeModal: () => void;
}

export default function FormPracticante({ closeModal }: FormPracticanteProps) {

    const queryClient = useQueryClient();

    const { mutate: registrarPracticante, isPending: isCreating } = useMutation({
        mutationFn: createPracticante,
        onSuccess: () => {
            toast.success("✅ Usuario registrado correctamente", {
                position: "top-left",
            });
            queryClient.invalidateQueries({
                queryKey: ["lista-practicantes"],
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "❌ Ocurrió un error al registrar el usuario", {
                position: "top-left",
            });
        },
    });
    const [form, setForm] = useState({
        nombre: '',
        horasTotales: '',
        fechaInicio: '',
        fechaTermino: '',
        telefono: '',
        carrera: '',
        email: '',
        password: '',
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        registrarPracticante(form);

        closeModal();
        setForm({
            nombre: '',
            horasTotales: '',
            fechaInicio: '',
            fechaTermino: '',
            telefono: '',
            carrera: '',
            email: '',
            password: '',
        });
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-h-[75vh] overflow-y-auto px-1">
            <div className="flex flex-col gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="email">Correo Eléctronico</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="horasTotales">Horas Totales</Label>
                    <Input id="horasTotales" name="horasTotales" type="number" value={form.horasTotales} onChange={handleChange} required />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input id="telefono" name="telefono" type="tel" value={form.telefono} onChange={handleChange} required />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                    <Input id="fechaInicio" name="fechaInicio" type="date" value={form.fechaInicio} onChange={handleChange} required />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="fechaTermino">Fecha de Término</Label>
                    <Input id="fechaTermino" name="fechaTermino" type="date" value={form.fechaTermino} onChange={handleChange} required />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="carrera">Carrera</Label>
                <Input id="carrera" name="carrera" value={form.carrera} onChange={handleChange} required />
            </div>

            <DialogFooter className="flex gap-3 justify-end">
                <Button variant="outline" onClick={closeModal}>Cancelar</Button>
                <Button type="submit" className="bg-[#b91116] hover:bg-[#a10f13] transition-colors" disabled={isCreating}>
                    <SaveIcon />
                    Guardar Practicante
                </Button>
            </DialogFooter>
        </form>
    );
}
