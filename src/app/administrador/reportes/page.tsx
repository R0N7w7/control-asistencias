"use client"
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { fetchListaPracticantes } from '@/lib/api/admin'
import { exportMultiSheetExcel, exportToExcel } from '@/lib/generarReporte'
import { useQuery } from '@tanstack/react-query'
import { FileArchiveIcon, FileDownIcon, SheetIcon } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'


const Page = () => {

    const [tipoReporte, setTipoReporte] = useState<"todos" | "individual">("todos");
    const [formato, setFormato] = useState<"pdf" | "xlsx">("xlsx");
    const [selectedPracticante, setSelectedPracticante] = useState<string>("");

    const { data, isLoading } = useQuery<{ perfiles: Practicante[] }>({
        queryKey: ['lista-practicantes'],
        queryFn: fetchListaPracticantes,
    });

    if (isLoading) return (
        <div className='w-full h-full flex items-center justify-center'>
            <Spinner size={'large'} className='text-[#b91116]' />
        </div>
    );

    return (
        <>
            <div className="flex flex-col gap-1 w-full items-start">
                <h2 className="text-3xl font-bold text-orange-600">
                    Reportes Administrativos
                </h2>
                <p className="text-lg text-neutral-600 font-medium">
                    Genera reportes detallados de los practicantes
                </p>
            </div>

            <div className="w-full border bg-white p-4 rounded-sm flex flex-col gap-4 mt-6">
                <div>
                    <h3 className="text-xl font-bold text-orange-600">Generar Reporte</h3>
                    <p className="text-lg font-medium text-neutral-600">Selecciona los parámetros para generar un reporte</p>
                </div>

                <div className='grid gap-2'>
                    <p className='text-lg font-medium text-neutral-700'>Tipo de reporte:</p>
                    <Select value={tipoReporte} defaultValue='todos' onValueChange={value => setTipoReporte(value as "todos" | "individual")}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona el tipo de reporte" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Tipo de reporte</SelectLabel>
                                <SelectItem value="todos">Todos los practicantes</SelectItem>
                                <SelectItem value="individual">Reporte Individual</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {
                    tipoReporte == "individual" &&
                    <div className='grid gap-2'>
                        <p className='text-lg font-medium text-neutral-700'>Practicante:</p>
                        <Select value={selectedPracticante} defaultValue='todos' onValueChange={value => setSelectedPracticante(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona el tipo de reporte" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Selección de practicante</SelectLabel>
                                    {
                                        data?.perfiles.map((perfil) => <SelectItem value={perfil.id} key={perfil.id}>{perfil.nombre
                                        }</SelectItem>)
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                }

                <div className='grid gap-2'>
                    <p className='text-lg font-medium text-neutral-700'>Formato del archivo:</p>
                    <Select defaultValue={'xlsx'} value={formato} onValueChange={value => setFormato(value as "xlsx" | "pdf")}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona el tipo de reporte" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Formato de reporte</SelectLabel>
                                <SelectItem value="xlsx"><SheetIcon className='text-green-600' /> Excel (.xlsx)</SelectItem>
                                <SelectItem value="pdf"><FileArchiveIcon className='text-red-600' /> PDF (.pdf)</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    className='w-full bg-[#b91116]'
                    onClick={async () => {
                        try {
                            let response;

                            if (tipoReporte === 'todos') {
                                response = await fetch('/api/reportes/'); // GET
                            } else if (tipoReporte === 'individual' && selectedPracticante) {
                                console.log(selectedPracticante);
                                response = await fetch('/api/bff/', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ userId: selectedPracticante }),
                                });
                            } else {
                                toast.error("Selecciona un practicante válido");
                                return;
                            }

                            const data = await response.json();
                            console.log("🧾 Reporte generado:", data);
                            if (tipoReporte == "individual") {
                                exportToExcel(data.horas, `reporte-${data.practicante.nombre}`)
                            } else{
                                exportMultiSheetExcel(data, 'ReporteGlobal')
                            }
                            // Aquí puedes cambiarlo después por lógica para descargar/generar archivo

                        } catch (error) {
                            toast.error("❌ Error al generar reporte:");
                            console.error(error);
                        }
                    }}
                >
                    <FileDownIcon className="mr-2" />
                    Generar Reporte
                </Button>

            </div>
        </>
    )
}

export default Page