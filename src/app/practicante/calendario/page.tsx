"use client"
import Calendario from '@/components/practicante/calendario/Calendario';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { postAsistencia } from '@/lib/api/asistencias';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { differenceInHours, format, parse } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import 'react-calendar/dist/Calendar.css'; // Estilos base
import { toast } from 'sonner';

export default function Page() {

    const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);

    const [hora_inicio, setHoraInicio] = useState<string>("");
    const [hora_fin, setHorafin] = useState<string>("");
    const [actividades, setActividades] = useState<string>("");

    const queryClient = useQueryClient();

    const data: { practicante: Practicante, horas: Asistencia[] } | undefined = queryClient.getQueryData(["initPracticante"]);

    const horas: Asistencia[] = useMemo(() => {
        return data?.horas || [];
      }, [data]);

    const { mutate: registrarAsistencia, isPending } = useMutation({
        mutationFn: postAsistencia,
        onSuccess: () => {
            toast.success("✅ Asistencia registrada correctamente", {
                position: "top-left",
            });

            queryClient.invalidateQueries({
                queryKey: ["initPracticante"]
            })

        },
        onError: (error) => {
            toast.error(error.message || "❌ Ocurrió un error al registrar asistencia", {
                position: "top-left",
            });
        },
    });

    useEffect(() => {
        if (fechaSeleccionada) {
            const registro = horas.find((r) => format(fechaSeleccionada, "yyyy-MM-dd") === r.fecha);
            if (registro) {
                setHoraInicio(registro.hora_inicio || "");
                setHorafin(registro.hora_fin || "");
                setActividades(registro.actividades || "");
            } else {
                setHoraInicio("");
                setHorafin("");
                setActividades("");
            }
        }
    }, [fechaSeleccionada, horas]);

    const handleSubmitAsistencia = () => {
        const hora_inicio_date = parse(hora_inicio, 'HH:mm', new Date());
        const hora_fin_date = parse(hora_fin, 'HH:mm', new Date());

        const duracion = differenceInHours(hora_fin_date, hora_inicio_date);

        const data = {
            fecha: format(fechaSeleccionada || new Date(), "yyyy-MM-dd"),
            hora_fin,
            hora_inicio,
            actividades,
            estado: "pendiente",
            duracion,
        };
        console.log(data);
        registrarAsistencia(data);
    };
    return (
        <>
            <div className="flex flex-col gap-1 w-full">
                <h2 className="text-3xl font-bold text-orange-600">Registro de Horas</h2>
                <p className="text-lg text-neutral-600 font-medium">Selecciona un día para registrar tus horas o ausencias</p>
            </div>

            <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className="w-full border bg-white p-4 rounded-sm flex flex-col gap-0">
                    <h3 className="text-xl font-bold text-orange-600">Calendario</h3>
                    <p className="text-lg font-medium text-neutral-600">Selecciona una fecha para registrar</p>
                    <Calendario registros={horas} setFechaSeleccionada={setFechaSeleccionada} />
                </div>

                <div className="w-full border bg-white p-4 rounded-sm flex flex-col gap-0">
                    <h3 className="text-xl font-bold text-orange-600">Registro</h3>
                    <p className="text-lg font-medium text-neutral-600">Ingresa los detalles de tu asistencia</p>
                    <p className="text-lg font-medium text-neutral-400">{format(fechaSeleccionada || new Date(), "yyyy-MM-dd")}</p>
                    <Tabs defaultValue='horas' className='w-full mt-2'>
                        <TabsList className='w-full'>
                            <TabsTrigger value='horas'>Registrar Horas</TabsTrigger>
                            <TabsTrigger value='falta'>Registrar Falta</TabsTrigger>
                        </TabsList>
                        <TabsContent value='horas' className='mt-2 flex flex-col gap-2'>
                            <div className='flex gap-2 w-full'>
                                <div className='flex-1'>
                                    <p className='text-base font-semibold text-neutral-600'>Hora de Entrada:</p>
                                    <Input type='time' placeholder='Hora de entrada' step={1800} min={"08:00"} max={"16:00"} value={hora_inicio} onChange={e => setHoraInicio(e.target.value)} />
                                </div>
                                <div className='flex-1'>
                                    <p className='text-base font-semibold text-neutral-600'>Hora de Salida:</p>
                                    <Input type='time' placeholder='Hora de entrada' step={1800} min={"08:00"} max={"16:00"} value={hora_fin} onChange={e => setHorafin(e.target.value)} />
                                </div>
                            </div>

                            <div className='flex gap-2 w-full flex-col'>
                                <p className='text-base font-semibold text-neutral-600'>Actividades realizadas:</p>
                                <Textarea placeholder='Describe las actividades realizadas en el horario seleccionado' className='h-32' value={actividades} onChange={(e) => setActividades(e.target.value)} />
                            </div>

                            <Button className='bg-[#b91116] text-lg font-semibold mt-2' onClick={handleSubmitAsistencia} disabled={isPending}>Registrar Horas</Button>
                        </TabsContent>

                        <TabsContent value='falta' className='mt-2 flex flex-col gap-2'>
                            <div className='flex gap-2 w-full flex-col'>
                                <p className='text-base font-semibold text-neutral-600'>Motivo de ausencia:</p>
                                <Select>
                                    <SelectTrigger className="w-full py-5">
                                        <SelectValue placeholder="Selecciona un motivo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Motivo</SelectLabel>
                                            <SelectItem value="enfermedad">Enfermedad</SelectItem>
                                            <SelectItem value="clases">Clases presenciales</SelectItem>
                                            <SelectItem value="personal">Asunto personal</SelectItem>
                                            <SelectItem value="otro">Otro</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className='flex gap-2 w-full flex-col'>
                                <p className='text-base font-semibold text-neutral-600'>Descripción (Opcional):</p>
                                <Textarea placeholder='Detalla el motivo de tu ausencia a continuación' className='h-32' />
                            </div>

                            <div className='flex gap-2 w-full flex-col'>
                                <p className='text-base font-semibold text-neutral-600'>Evidencia (Opcional):</p>
                                <Input type='file' />
                            </div>

                            <Button className='bg-[#b91116] text-lg font-semibold mt-2'>Registrar Ausencia</Button>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}