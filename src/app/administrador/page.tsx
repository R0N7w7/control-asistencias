"use client";

import TablaPendientes from "@/components/administrador/TablaPendientes";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { fetchResumeData } from "@/lib/api/admin";
import { useQuery } from "@tanstack/react-query";
import { ClockIcon, FilesIcon, Users2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";


export default function PracticantePage() {

  const router = useRouter();

  const { data, isLoading } = useQuery<{ resumen: Resumen }>({
    queryKey: ["resume-admin"],
    queryFn: fetchResumeData,
  });

  if (isLoading) return <Spinner className="text-[#b91116]" />

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 w-full items-end justify-between">
        <div className="flex flex-col gap-1 w-full items-start">
          <h2 className="text-3xl font-bold text-orange-600">
            Panel de Administración
          </h2>
          <p className="text-lg text-neutral-600 font-medium">
            Gestiona y supervisa las horas de servicio social
          </p>
        </div>
        <div className="w-full flex gap-2 sm:max-w-96">
          <Button className="flex-1 bg-[#b91116]" onClick={() => router.push("/administrador/practicantes")}>
            <Users2Icon size={24} />
            <p>Ver practicantes</p>
          </Button>
          <Button className="flex-1 bg-white border" variant={"secondary"} onClick={() => router.push("/administrador/reportes")}>
            <FilesIcon size={24} />
            <p>Exportar reportes</p>
          </Button>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
        <CardInfo
          titulo="Total Practicantes"
          valor={`${data?.resumen.totalPracticantes}`}
          extra={"Durante este periodo"}
        />
        <CardInfo
          titulo="Horas Validadas"
          valor={`${data?.resumen.totalHorasValidadas}`}
          extra={"Horas revisadas y aprobadas"}
        />
        <CardInfo
          titulo="Horas Pendientes"
          valor={`${data?.resumen.totalHorasPendientes}`}
          extra={"Horas que requieren revisión"}
        />
        <CardInfo
          titulo="Ausencias"
          valor={`${data?.resumen.totalFaltas}`}
          extra={"Días de inasistencia"}
        />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full border bg-white p-4 rounded-sm flex flex-col gap-0">
          <h3 className="text-xl font-bold text-orange-600">Resumen de Horas</h3>
          <p className="text-lg font-medium text-neutral-600">Visualiza la distrución de asistencias</p>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { estado: "Horas validadas", horas: data?.resumen.totalHorasValidadas },
                  { estado: "Horas pendientes", horas: data?.resumen.totalHorasPendientes },
                ]}
                margin={{ top: 0, right: 0, bottom: 0, left: -30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="estado" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="horas">
                  <Cell fill="#10b981" /> {/* color para validado (verde tailwind) */}
                  <Cell fill="#f59e0b" /> {/* color para pendiente (amarillo tailwind) */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-full border bg-white p-4 rounded-sm flex flex-col gap-0">
          <h3 className="text-xl font-bold text-orange-600">Validaciones Pendientes</h3>
          <p className="text-lg font-medium text-neutral-600">Horas que requieren tu aprobación</p>
          <TablaPendientes />
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
