import { addDays, format, isSameMonth, isSameWeek, parseISO, startOfWeek } from "date-fns";

export function procesarDatos(horas: Asistencia[], hoy: Date, practicante: Practicante) {
    // Horas completadas y pendientes
    const horasCompletadas = horas
        .filter(r => r.estado === "validado")
        .reduce((acc, r) => acc + r.duracion, 0);

    const horasPendientes = horas
        .filter(r => r.estado === "pendiente")
        .reduce((acc, r) => acc + r.duracion, 0);

    // Registros de esta semana
    const registrosSemana = horas.filter(r =>
        isSameWeek(parseISO(r.fecha), hoy, { weekStartsOn: 0 })
    );

    const horasSemana = registrosSemana
        .filter(r => r.estado === "validado")
        .reduce((acc, r) => acc + r.duracion, 0);

    const diasSemana = new Set(
        registrosSemana
            .filter(r => r.estado === "validado")
            .map(r => format(parseISO(r.fecha), "yyyy-MM-dd"))
    ).size;

    // Registros de este mes
    const registrosMes = horas.filter(r =>
        isSameMonth(parseISO(r.fecha), hoy)
    );

    const horasMes = registrosMes
        .filter(r => r.estado === "validado")
        .reduce((acc, r) => acc + r.duracion, 0);

    const diasMes = new Set(
        registrosMes
            .filter(r => r.estado === "validado")
            .map(r => format(parseISO(r.fecha), "yyyy-MM-dd"))
    ).size;

    // Porcentaje de horas completadas
    const porcentaje = horasCompletadas <=practicante.horasTotales ? (practicante.horasTotales
        ? (horasCompletadas / practicante.horasTotales) * 100
        : 0)
        : 100;

    // Datos de la semana (lunes a viernes)
    const dias = ["Lun", "Mar", "Mié", "Jue", "Vie"];
    const inicioSemana = startOfWeek(hoy, { weekStartsOn: 1 });

    const datosSemana = dias.map((dia, index) => {
        const fecha = addDays(inicioSemana, index);
        const fechaStr = format(fecha, "yyyy-MM-dd");

        const registro = registrosSemana.find(
            r => r.fecha === fechaStr && r.estado === "validado"
        );

        return {
            dia,
            horas: fecha <= hoy ? (registro?.duracion ?? 0) : 0,
        };
    });

    // Datos del mes
    const registrosPorMes: { [mes: string]: number } = {};

    horas.forEach((r) => {
        if (r.estado === "validado") {
            const mes = format(parseISO(r.fecha), "MMM yyyy"); // Ej. "Abr 2025"
            registrosPorMes[mes] = (registrosPorMes[mes] || 0) + r.duracion;
        }
    });

    const datosMes = Object.entries(registrosPorMes).map(([mes, horas]) => ({
        mes,
        horas,
    }));

    return {
        horasCompletadas,
        horasPendientes,
        horasSemana,
        diasSemana,
        horasMes,
        diasMes,
        porcentaje,
        datosSemana,
        datosMes
    };
}  