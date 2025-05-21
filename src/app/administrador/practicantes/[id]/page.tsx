"use client";

import TablaHistorial from "@/components/practicante/historial/TablaHistorial";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { fetchPracticante } from "@/lib/api/admin";
import { exportToExcel } from "@/lib/generarReporte";
import { procesarDatos } from "@/lib/transformarHoras";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, Calendar1Icon, ClockIcon, FileDownIcon, MailIcon, PhoneIcon, UniversityIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export default function PracticantePage() {

    const router = useRouter();

    const params = useParams();
    const id = params.id;

    const { data, isLoading } = useQuery<{ horas: Asistencia[], practicante: Practicante }>({
        queryKey: [params.id],
        queryFn: () => fetchPracticante(id as string),
    });

    const practicante = data?.practicante;
    const horas = data?.horas || [];
    const hoy = new Date();

    const {
        horasCompletadas,
        horasPendientes,
        ausencias,
        porcentaje,
    } = procesarDatos(horas, hoy, practicante || { horasTotales: 0, nombre: "" });

    const obtenerEstadoPorFecha = (fecha: Date) => {
        const fechaStr = fecha.toISOString().split('T')[0]; // yyyy-mm-dd
        const registro = horas.find((r) => r.fecha === fechaStr);
        return registro?.estado;
    };

    if (isLoading) return <Spinner className="text-[#b91116]" />

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-2 w-full items-end justify-between">
                <div className="w-full h-full max-w-max flex items-center justify-center">
                    <Button className="flex-1 border" variant={'outline'} onClick={() => router.back()}>
                        <ArrowLeftIcon size={24} />
                    </Button>
                </div>
                <div className="flex flex-col gap-1 w-full items-start">
                    <h2 className="text-3xl font-bold text-orange-600">
                        Detalle del Practicante
                    </h2>
                    <p className="text-lg text-neutral-600 font-medium">
                        Gestiona y supervisa las horas de servicio social
                    </p>
                </div>
                <div className="w-full flex gap-2 sm:max-w-72">
                    <Button className="flex-1 bg-[#b91116] border" onClick={() => exportToExcel(data?.horas || [], `Reporte-${practicante?.nombre}`)}>
                        <FileDownIcon size={24} />
                        <p>Exportar reporte</p>
                    </Button>
                </div>
            </div>

            <div className="w-full grid md:grid-cols-2 gap-4">
                <div className="w-full bg-white p-4 rounded-md border grid gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-orange-600">Información personal</h3>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-600">{practicante?.nombre}</h3>
                    <p className="flex gap-2 text-neutral-600 font-medium items-center text-xl"><MailIcon className="text-[#b91116]" size={16} />{practicante?.email}</p>
                    <p className="flex gap-2 text-neutral-600 font-medium items-center text-xl"><PhoneIcon className="text-[#b91116]" size={16} />{practicante?.telefono}</p>
                    <p className="flex gap-2 text-neutral-600 font-medium items-center text-xl"><UniversityIcon className="text-[#b91116]" size={16} />{practicante?.carrera}</p>
                    <p className="flex gap-2 text-neutral-700 font-medium items-center text-lg">Periodo de servicio:</p>
                    <p className="flex gap-2 text-neutral-600 font-medium items-center text-xl"><Calendar1Icon className="text-[#b91116]" size={16} />De {practicante?.fechaInicio} hasta {practicante?.fechaTermino}</p>
                </div>
                <div className="w-full bg-white rounded-md border">
                    <Calendar
                        tileClassName={({ date, view }) => {
                            if (view === 'month') {
                                const estado = obtenerEstadoPorFecha(date);
                                if (estado === 'validado') return 'text-green-600 bg-green-200! rounded-sm!';
                                if (estado === 'pendiente') return 'text-yellow-600 bg-yellow-200! rounded-sm!';
                                if (estado === 'falta') return 'text-red-600 bg-red-200! rounded-sm!';
                            }
                            return null;
                        }}
                        calendarType='gregory'
                        className="rounded-sm border-0! w-full! h-full! bg-white p-4"
                    />
                </div>
            </div>


            <div className="w-full bg-white p-4 rounded-md border grid gap-4">
                <div>
                    <h3 className="text-xl font-bold text-orange-600">Resumen de Horas</h3>
                </div>
                <div className="grid gap-2">
                    <p className="text-lg text-neutral-600 font-medium">Progreso total</p>
                    <Progress value={porcentaje} max={practicante?.horasTotales} />
                    <div className="text-lg text-neutral-600 font-medium">{horasCompletadas}/{practicante?.horasTotales}</div>
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                    <CardInfo
                        titulo="Horas completadas"
                        valor={`${horasCompletadas}`}
                    />
                    <CardInfo
                        titulo="Horas pendientes"
                        valor={`${horasPendientes}`}
                    />
                    <CardInfo
                        titulo="Ausencias"
                        valor={`${ausencias}`}
                    />
                    <CardInfo
                        titulo="Días registrados"
                        valor={`${horas.length}`}
                    />
                </div>
            </div>


            <div className="w-full border bg-white p-4 rounded-sm flex flex-col gap-0 col-span-2">
                <h3 className="text-xl font-bold text-orange-600">Historial</h3>
                <p className="text-lg font-medium text-neutral-600">Registros de asistencia</p>
                <TablaHistorial data={horas} isLoading={isLoading} />
            </div>
        </>
    );
}

function CardInfo({ titulo, valor, extra, progreso }: {
    titulo: string;
    valor: string;
    extra?: string;
    progreso?: number;
}) {
    return (
        <div className="w-full   bg-neutral-50 p-4 rounded-sm flex flex-col gap-2">
            <div className="w-full flex items-center justify-between">
                <h3 className="text-xl font-bold text-orange-600">{titulo}</h3>
                <ClockIcon size={24} color="#b91116" />
            </div>
            <div className="flex flex-col">
                <p className="text-3xl font-bold text-neutral-800">{valor}</p>
                {extra && (
                    <p className="text-lg font-semibold text-neutral-600">{extra}</p>
                )}
            </div>
            {typeof progreso === "number" && (
                <Progress value={progreso} />
            )}
        </div>
    );
}