"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addDays, format, isSameMonth, isSameWeek, startOfWeek } from "date-fns";
import { Calendar1Icon, ClockIcon, FileDownIcon } from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";


const practicanteData = {
  nombre: "Roberto",
  horasTotales: 500,
};

const registrosHoras = [
  { fecha: "2025-04-25", duracion: 5, estado: "validado" },
  { fecha: "2025-04-24", duracion: 5, estado: "pendiente" },
  { fecha: "2025-04-23", duracion: 10, estado: "falta" },
  { fecha: "2025-04-22", duracion: 10, estado: "falta" },
  { fecha: "2025-04-21", duracion: 5, estado: "validado" },

  { fecha: "2025-05-25", duracion: 3, estado: "validado" },
  { fecha: "2025-05-24", duracion: 4, estado: "validado" },
  { fecha: "2025-05-23", duracion: 4, estado: "validado" },
  { fecha: "2025-05-22", duracion: 4, estado: "validado" },
  { fecha: "2025-05-21", duracion: 2, estado: "validado" },
  { fecha: "2025-05-19", duracion: 4, estado: "validado" },
  { fecha: "2025-05-19", duracion: 4, estado: "validado" },

  { fecha: "2025-04-28", duracion: 4, estado: "validado" },
  { fecha: "2025-04-29", duracion: 4, estado: "validado" },
  { fecha: "2025-04-30", duracion: 4, estado: "validado" },
  { fecha: "2025-04-31", duracion: 4, estado: "validado" },

  { fecha: "2025-06-25", duracion: 3, estado: "validado" },
  { fecha: "2025-06-24", duracion: 4, estado: "pendiente" },
  { fecha: "2025-06-23", duracion: 4, estado: "validado" },
  { fecha: "2025-06-22", duracion: 4, estado: "pendiente" },
  { fecha: "2025-06-21", duracion: 2, estado: "validado" },
  { fecha: "2025-06-19", duracion: 4, estado: "pendiente" },
  { fecha: "2025-06-19", duracion: 4, estado: "falta" },
];

export default function PracticantePage() {
  const hoy = new Date();

  const horasCompletadas = registrosHoras
    .filter(r => r.estado === "validado")
    .reduce((acc, r) => acc + r.duracion, 0);

  const horasPendientes = registrosHoras
    .filter(r => r.estado === "pendiente")
    .reduce((acc, r) => acc + r.duracion, 0);

  const registrosSemana = registrosHoras.filter(r =>
    isSameWeek(new Date(r.fecha), hoy, { weekStartsOn: 0 })
  );

  const horasSemana = registrosSemana
    .filter(r => r.estado === "validado")
    .reduce((acc, r) => acc + r.duracion, 0);

  const diasSemana = new Set(
    registrosSemana
      .filter(r => r.estado === "validado")
      .map(r => format(new Date(r.fecha), "yyyy-MM-dd"))
  ).size;

  const registrosMes = registrosHoras.filter(r =>
    isSameMonth(new Date(r.fecha), hoy)
  );

  const horasMes = registrosMes
    .filter(r => r.estado === "validado")
    .reduce((acc, r) => acc + r.duracion, 0);

  const diasMes = new Set(
    registrosMes
      .filter(r => r.estado === "validado")
      .map(r => format(new Date(r.fecha), "yyyy-MM-dd"))
  ).size;

  const porcentaje = practicanteData.horasTotales
    ? (horasCompletadas / practicanteData.horasTotales) * 100
    : 0;

  const dias = ["Lun", "Mar", "Mié", "Jue", "Vie"];

  // Datos para gráfico semanal (lunes a viernes)
  const inicioSemana = startOfWeek(hoy, { weekStartsOn: 1 });

  const datosSemana = dias.map((dia, index) => {
    const fecha = addDays(inicioSemana, index);
    const fechaStr = format(fecha, "yyyy-MM-dd");

    const registro = registrosSemana.find(r => r.fecha === fechaStr && r.estado === "validado");

    return {
      dia,
      horas: fecha <= hoy ? (registro?.duracion ?? 0) : 0,
    };
  });

  // Datos para gráfico mensual (por mes distinto con registros)
  const registrosPorMes: { [mes: string]: number } = {};

  registrosHoras.forEach((r) => {
    if (r.estado === "validado") {
      const mes = format(new Date(r.fecha), "MMM yyyy"); // Ej. "Abr 2025"
      registrosPorMes[mes] = (registrosPorMes[mes] || 0) + r.duracion;
    }
  });

  const datosMes = Object.entries(registrosPorMes).map(([mes, horas]) => ({
    mes,
    horas,
  }));


  return (
    <main className="w-full min-h-screen flex items-center px-3 py-6 bg-gray-100 flex-col gap-6">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold text-orange-600">
            Bienvenido, {practicanteData.nombre}
          </h2>
          <p className="text-lg text-neutral-600 font-medium">
            Gestiona tus horas de servicio social
          </p>
        </div>
        <div className="w-full flex gap-2">
          <Button className="flex-1 bg-[#b91116]">
            <Calendar1Icon size={24} />
            <p>Registrar horas</p>
          </Button>
          <Button className="flex-1 bg-white border" variant={"secondary"}>
            <FileDownIcon size={24} />
            <p>Exportar reporte</p>
          </Button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <CardInfo
          titulo="Horas Totales"
          valor={`${horasCompletadas}/${practicanteData.horasTotales}`}
          extra={`${porcentaje.toFixed(0)}% completado`}
          progreso={porcentaje}
        />
        <CardInfo
          titulo="Horas Esta Semana"
          valor={`${horasSemana}`}
          extra={`${diasSemana} días registrados`}
        />
        <CardInfo
          titulo="Horas Este Mes"
          valor={`${horasMes}`}
          extra={`${diasMes} días registrados`}
        />
        <CardInfo
          titulo="Horas Pendientes"
          valor={`${horasPendientes}`}
          extra="Esperando validación"
        />
      </div>

      <div className="w-full border bg-white p-4 rounded-sm flex flex-col gap-0">
        <h3 className="text-xl font-bold text-orange-600">Resumen de Horas</h3>
        <p className="text-lg font-medium text-neutral-600">Visualiza tus horas trabajadas por periodo</p>
        <Tabs
          defaultValue="mes"
          className="w-full mt-2"
        >
          <TabsList className="w-full grid grid-cols-2 h-max">
            <TabsTrigger value="semana" className="py-1 text-base font-medium" >Semana</TabsTrigger>
            <TabsTrigger value="mes" className="py-1 text-base font-medium">Mes</TabsTrigger>
          </TabsList>
          <TabsContent value="semana" className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300} >
              <BarChart data={datosSemana} margin={{
                top: 0, right: 0, bottom: 0, left: -30,
              }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="horas" fill="#ea580c" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="mes">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosMes} margin={{
                top: 0, right: 0, bottom: 0, left: -30,
              }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="horas" fill="#b91116" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </div>

      <div className="w-full border bg-white p-4 rounded-sm flex flex-col gap-0">
        <h3 className="text-xl font-bold text-orange-600">Actividad Reciente</h3>
        <p className="text-lg font-medium text-neutral-600">Últimos registros de asistencia </p>
        {registrosHoras.slice(0, 5).map((registro) => (
          <div key={registro.fecha} className="flex items-center justify-between gap-2 py-2 border-b mt-2">
            <p className="text-base font-medium w-full">{registro.fecha}</p>
            <div
              className={`flex items-center px-3 py-1 rounded-full border text-sm font-semibold ${registro.estado === 'validado'
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : registro.estado === 'pendiente'
                    ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                    : registro.estado === 'falta'
                      ? 'bg-red-100 text-red-700 border-red-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
            >
              {registro.estado === 'validado'
                ? 'Validado'
                : registro.estado === 'pendiente'
                  ? 'Pendiente'
                  : registro.estado === 'falta'
                    ? 'Falta'
                    : 'Desconocido'}
            </div>
            <p className="text-base font-bold">{registro.duracion}h</p>
          </div>
        ))}
      </div>
    </main>
  );
}

function CardInfo({ titulo, valor, extra, progreso }: {
  titulo: string;
  valor: string;
  extra?: string;
  progreso?: number;
}) {
  return (
    <div className="w-full border bg-white p-4 rounded-sm flex flex-col gap-2">
      <div className="w-full flex items-center justify-between">
        <h3 className="text-xl font-bold text-orange-600">{titulo}</h3>
        <ClockIcon size={24} color="#b91116"/>
      </div>
      <div className="flex flex-col">
        <p className="text-3xl font-bold text-neutral-800">{valor}</p>
        {extra && (
          <p className="text-lg font-semibold text-neutral-600">{extra}</p>
        )}
      </div>
      {typeof progreso === "number" && (
        <Progress value={progreso}/>
      )}
    </div>
  );
}
