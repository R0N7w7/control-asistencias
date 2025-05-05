"use client"

import { useState } from 'react'

import { DataTable } from '@/components/ui/dataTable'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ColumnDef } from "@tanstack/react-table"
import { SearchIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAsistencia } from '@/lib/api/asistencias'
import { toast } from 'sonner'

type Props = {
    data: Asistencia[];
}

export default function TablaHistorial({ data }: Props) {
    const queryClient = useQueryClient();
    const [busqueda, setBusqueda] = useState<string>("");
    const [tipoBusqueda, SetTipoBusqueda] = useState<string>("todo");

    const filteredData = data.filter((item) => {
        const matchesSearch =
            item.fecha.includes(busqueda) || item.actividades?.toLowerCase().includes(busqueda.toLowerCase())

        const matchesStatus = tipoBusqueda === "todo" || item.estado === tipoBusqueda

        return matchesSearch && matchesStatus
    })


    const { mutate: eliminarAsistencia, isPending: eliminando } = useMutation({
        mutationFn: deleteAsistencia,
        onSuccess: () => {
            toast.success("🗑️ Asistencia eliminada correctamente", {
                position: "top-left",
            });
            queryClient.invalidateQueries({
                queryKey: ["initPracticante"],
            });
            queryClient.refetchQueries({ queryKey: ["initPracticante"] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "❌ Ocurrió un error al eliminar asistencia", {
                position: "top-left",
            });
        },
    });

    const columns: ColumnDef<Asistencia>[] = [
        {
            accessorKey: "fecha",
            header: () => <p className='font-bold px-2'>Fecha</p>,
            cell: ({ row }) => <p className='font-bold text-neutral-600 py-3'>{row.getValue("fecha")}</p>,
        },
        {
            accessorKey: "duracion",
            header: () => <p className='font-bold px-2'>Duración</p>,
            cell: ({ row }) => <p className='font-semibold w-full text-center py-3'>{row.getValue("duracion")}</p>
        },
        {
            accessorKey: "hora_inicio",
            header: () => <p className='font-bold px-2'>Hora de entrada</p>,
            cell: ({ row }) => <p className='font-semibold w-full text-center py-3'>{row.getValue("hora_inicio") || "---"}</p>,
        },
        {
            accessorKey: "hora_fin",
            header: () => <p className='font-bold px-2'>Hora de salida</p>,
            cell: ({ row }) => <p className='font-semibold w-full text-center py-3'>{row.getValue("hora_fin") || "---"}</p>,
        },
        {
            accessorKey: "estado",
            header: () => <p className='font-bold px-2'>Estado</p>,
            cell: ({ row }) => {
                const estado = row.getValue<string>("estado")

                const estilos =
                    estado === "validado"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : estado === "pendiente"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                            : estado === "falta"
                                ? "bg-red-100 text-red-700 border-red-300"
                                : "bg-gray-100 text-gray-700 border-gray-300"

                return (
                    <div className={`w-full text-center mx-auto px-3 py-1 rounded-full border text-sm font-semibold ${estilos}`}>
                        {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </div>
                )
            },
        },
        {
            accessorKey: "actividades",
            header: () => <p className='font-bold px-2'>Actividades</p>,
            cell: ({ row }) => <p className='font-semibold text-left w-64 text-wrap line-clamp-2'>{row.getValue("actividades") || "---"}</p>,
        },
        {
            header: "Acción",
            cell: ({ row }) => <Button className='bg-[#b91116]' onClick={() => eliminarAsistencia(row.getValue('fecha'))} disabled={eliminando}><TrashIcon /></Button>
        }
    ]

    return (
        <div className='flex flex-col gap-4 mt-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                <div className="relative w-full h-full">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por fecha o actividades..."
                        className="pl-8 h-full"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <div className='w-full'>
                    <Select onValueChange={(e) => SetTipoBusqueda(e)} defaultValue='todo'>
                        <SelectTrigger className="w-full py-5">
                            <SelectValue placeholder="Selecciona un motivo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Motivo</SelectLabel>
                                <SelectItem value="todo">Todos</SelectItem>
                                <SelectItem value="validado">Validado</SelectItem>
                                <SelectItem value="falta">Falta</SelectItem>
                                <SelectItem value="pendiente">Pendiente</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className='border rounded-sm'>
                <DataTable columns={columns} data={filteredData} />
            </div>
        </div>
    )
}