"use client"
import { useState } from "react";
import ListaPracticantes from '@/components/administrador/practicantes/ListaPracticantes';
import { Button } from '@/components/ui/button';
import { UserPlusIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import FormPracticante from "@/components/administrador/practicantes/FormPracticante"; // importamos el nuevo componente

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className='w-full flex flex-col sm:flex-row items-end'>
        <div className="flex flex-col gap-1 w-full">
          <h2 className="text-3xl font-bold text-orange-600">Practicantes</h2>
          <p className="text-lg text-neutral-600 font-medium">Gestiona y supervisa a los practicantes de servicio social</p>
        </div>
        <Button
          className='bg-[#b91116] text-lg font-semibold mt-2 w-full flex items-center gap-4 sm:max-w-64'
          onClick={() => setOpen(true)}
        >
          <UserPlusIcon size={32} />Añadir Practicante
        </Button>
      </div>

      <div className="w-full border bg-white p-4 rounded-sm flex flex-col gap-0 mt-6">
        <h3 className="text-xl font-bold text-orange-600">Lista de Practicantes</h3>
        <p className="text-lg font-medium text-neutral-600">Todos los practicantes registrados en el sistema</p>
        <ListaPracticantes />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-orange-600">Añadir Nuevo Practicante</DialogTitle>
            <DialogDescription>
              Llena los datos para registrar un nuevo practicante.
            </DialogDescription>
          </DialogHeader>

          {/* Aquí invocamos al formulario */}
          <FormPracticante closeModal={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}