interface Practicante {
    nombre: string;
    horasTotales: number,
}

interface Asistencia {
    fecha: string;
    duracion: number;
    estado: string;
    hora_inicio?: string;
    hora_fin?: string;
    actividades?: string;
};

interface Resumen {
    totalHorasValidadas: number,
    totalHorasPendientes: number,
    totalFaltas: number,
    totalPracticantes: number
}

interface Pendiente extends Asistencia {
    nombre: string;
    user_id: string;
}