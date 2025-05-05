type Practicante = {
    nombre: string;
    horasTotales: number,
}

type Asistencia = {
    fecha: string;
    duracion: number;
    estado: string;
    hora_inicio?: string;
    hora_fin?: string;
    actividades?: string;
};
