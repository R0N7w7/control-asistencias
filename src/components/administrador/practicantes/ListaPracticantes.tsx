"use client"

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirmDialog'
import { DataTable } from '@/components/ui/dataTable'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { eliminarUsuario, fetchListaPracticantes } from '@/lib/api/admin'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ColumnDef } from "@tanstack/react-table"
import { EyeIcon, SearchIcon, TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function ListaPracticantes() {
    const { data, isLoading } = useQuery<{ perfiles: Practicante[] }>({
        queryKey: ['lista-practicantes'],
        queryFn: fetchListaPracticantes,
    });

    const queryClient = useQueryClient();

    const { mutate: eliminarPracticante, isPending: isDeleting } = useMutation({
        mutationFn: eliminarUsuario,
        onSuccess: () => {
            toast.success("🗑️ Usuario eliminado correctamente", {
                position: "top-left",
            });
            queryClient.invalidateQueries({
                queryKey: ["lista-practicantes"],
            });
        },
        onError: (error: Error) => {
            toast.error(error.message || "❌ Ocurrió un error al eliminar el usuario", {
                position: "top-left",
            });
        },
    });

    const router = useRouter();

    const [busqueda, setBusqueda] = useState<string>("");

    const filteredData = data?.perfiles.filter((item) => {
        const matchesSearch =
            item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) || item.carrera?.toLowerCase().includes(busqueda.toLowerCase())
        return matchesSearch
    })

    const columns: ColumnDef<Practicante>[] = [
        {
            accessorKey: "nombre",
            header: () => <p className='font-bold px-2'>Nombre</p>,
            cell: ({ row }) => <p className='font-bold text-neutral-600 py-3'>{row.getValue("nombre")}</p>,
        },
        {
            accessorKey: "horasTotales",
            header: () => <p className='font-bold px-2'>Horas Totales</p>,
            cell: ({ row }) => <p className='font-semibold text-left py-3'>{row.getValue("horasTotales")}</p>,
        },
        {
            accessorKey: "fechaInicio",
            header: () => <p className='font-bold px-2'>Fecha de Inicio</p>,
            cell: ({ row }) => <p className='font-semibold text-left py-3'>{row.getValue("fechaInicio")}</p>,
        },
        {
            accessorKey: "fechaTermino",
            header: () => <p className='font-bold px-2'>Fecha de Término</p>,
            cell: ({ row }) => <p className='font-semibold text-left py-3'>{row.getValue("fechaTermino")}</p>,
        },
        {
            accessorKey: "telefono",
            header: () => <p className='font-bold px-2'>Teléfono</p>,
            cell: ({ row }) => <p className='font-semibold text-left py-3'>{row.getValue("telefono")}</p>,
        },
        {
            accessorKey: "carrera",
            header: () => <p className='font-bold px-2'>Carrera</p>,
            cell: ({ row }) => <p className='font-semibold text-left py-3'>{row.getValue("carrera")}</p>,
        },
        {
            accessorKey: "email",
            header: () => <p className='font-bold px-2'>Correo</p>,
            cell: ({ row }) => <p className='font-semibold w-full text-left py-3'>{row.getValue("email")}</p>,
        },
        {
            accessorKey: "id",
            header: "Acciones",
            cell: ({ row }) => (
                <div className='flex gap-2'>
                    <Button
                        onClick={() => router.push(`/administrador/practicantes/${row.getValue('id')}`)}
                        disabled={isDeleting}
                    >
                        <EyeIcon />
                    </Button>
                    <ConfirmDialog
                        title='¿Estás seguro de eliminar al practicante?'
                        description='Toda la información relacionada será eliminada, asegurate de descargar un reporte primero.'
                        onConfirm={() => eliminarPracticante(row.getValue('id'))}
                    >
                        <Button
                            className='bg-[#b91116]'
                            disabled={isDeleting}
                        >
                            <TrashIcon />
                        </Button>
                    </ConfirmDialog>
                </div>
            )
        }
    ]

    return (
        <div className='flex flex-col gap-4 mt-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div className="relative w-full h-full py-1">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre o licenciatura..."
                        className="pl-8 h-full"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            <div className='border rounded-sm'>
                {isLoading ? <Spinner className='text-[#b91116] my-8' /> : <DataTable columns={columns} data={filteredData || []} />}
            </div>
        </div>
    )
}