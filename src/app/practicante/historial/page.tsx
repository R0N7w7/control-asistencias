"use client"
import TablaHistorial from '@/components/practicante/historial/TablaHistorial';
import { Button } from '@/components/ui/button';
import { exportToExcel } from '@/lib/generarReporte';
import { useQueryClient } from '@tanstack/react-query';
import { FileDownIcon } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

export default function Page() {

    const queryClient = useQueryClient();

    const data: { practicante: Practicante, horas: Asistencia[] } | undefined = queryClient.getQueryData(["initPracticante"]);

    return (
        <>
            <div className='w-full flex flex-col sm:flex-row items-end'>
                <div className="flex flex-col gap-1 w-full">
                    <h2 className="text-3xl font-bold text-orange-600">Historial de Horas</h2>
                    <p className="text-lg text-neutral-600 font-medium">Revisa el historial de tus horas registradas</p>
                </div>
                <Button className='bg-[#b91116] text-lg font-semibold mt-2 w-full flex items-center gap-4 sm:max-w-64' onClick={() => exportToExcel(data?.horas || [])}><FileDownIcon />Exportar Historial</Button>
            </div>

            <div className="w-full border bg-white p-4 rounded-sm flex flex-col gap-0">
                <h3 className="text-xl font-bold text-orange-600">Registro de Horas</h3>
                <p className="text-lg font-medium text-neutral-600">Historial completo de horas y ausencias </p>
                <TablaHistorial data={data?.horas || []} />
            </div>
        </>
    );
}