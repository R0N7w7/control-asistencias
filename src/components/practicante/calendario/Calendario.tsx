import React, { Dispatch, SetStateAction } from 'react'
import Calendar from 'react-calendar';

type Props = {
    registros: Asistencia[],
    setFechaSeleccionada: Dispatch<SetStateAction<Date | null>>
}

const Calendario = ({ registros, setFechaSeleccionada }: Props) => {

    const obtenerEstadoPorFecha = (fecha: Date) => {
        const fechaStr = fecha.toISOString().split('T')[0]; // yyyy-mm-dd
        const registro = registros.find((r) => r.fecha === fechaStr);
        return registro?.estado;
    };

    return (
        <Calendar
            onChange={(date) => setFechaSeleccionada(date as Date)}
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
            className="rounded-sm border-0! w-full! h-full! "
        />
    )
}

export default Calendario