"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchInitData } from "@/lib/api/asistencias";
import { exportToExcel } from "@/lib/generarReporte";
import { procesarDatos } from "@/lib/transformarHoras";
import { useQuery } from "@tanstack/react-query";
import { Calendar1Icon, ClockIcon, FileDownIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";


export default function PracticantePage() {

  const router = useRouter();

  const { data, isLoading } = useQuery<{ horas: Asistencia[], practicante: Practicante }>({
    queryKey: ["initPracticante"],
    queryFn: fetchInitData,
  });

  const practicante = data?.practicante || { horasTotales: 0, nombre: "" };
  const horas = data?.horas || [];
  const hoy = new Date();

  const {
    horasCompletadas,
    horasPendientes,
    horasSemana,
    diasSemana,
    horasMes,
    diasMes,
    porcentaje,
    datosSemana,
    datosMes
  } = procesarDatos(horas, hoy, practicante);

  if (isLoading) return <Spinner className="text-[#b91116]" />

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 w-full items-end justify-between">
        <div className="flex flex-col gap-1 w-full items-start">
          <h2 className="text-3xl font-bold text-orange-600">
            Hola, {practicante.nombre}
          </h2>
          <p className="text-lg text-neutral-600 font-medium">
            Gestiona tus horas de servicio social
          </p>
        </div>
        <div className="w-full flex gap-2 sm:max-w-96">
          <Button className="flex-1 bg-[#b91116]" onClick={() => router.push("/practicante/calendario")}>
            <Calendar1Icon size={24} />
            <p>Registrar horas</p>
          </Button>
          <Button className="flex-1 bg-white border" variant={"secondary"} onClick={() => exportToExcel(data?.horas || [], `Reporte-${practicante?.nombre}`)}>
            <FileDownIcon size={24} />
            <p>Exportar reporte</p>
          </Button>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
        <CardInfo
          titulo="Horas Totales"
          valor={`${horasCompletadas}/${practicante.horasTotales}`}
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

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <p className="text-lg font-medium text-neutral-600">Últimos registros de asistencia</p>

          <div className="flex flex-col items-center min-h-[200px]">
            {horas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Image
                  src="/no-data.svg"
                  alt="Sin pendientes"
                  width={220}
                  height={220}
                  className="mb-4"
                />
                <p className="text-lg">No hay registros recientes</p>
              </div>
            ) : (
              horas.slice(0, 5).map((registro) => (
                <div
                  key={registro.fecha}
                  className="flex items-center justify-between gap-2 py-2 border-b mt-2 w-full"
                >
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
              ))
            )}
          </div>
        </div>

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
    <div className="w-full border bg-white p-4 rounded-sm flex flex-col gap-2">
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
