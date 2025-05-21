interface Practicante {
    nombre: string;
    horasTotales: number,
    id: string,
    horasTotales: number,
    fechaInicio: string,
    fechaTermino: string,
    telefono: string,
    carrera: string,
    email: string,
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