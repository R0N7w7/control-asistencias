import { fetchHorasPendientes, updateAsistencia } from '@/lib/api/admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { Spinner } from '../ui/spinner';
import { CheckIcon, XIcon } from 'lucide-react';
import { ConfirmDialog } from '../ui/confirmDialog';
import { toast } from 'sonner';

const TablaPendientes = () => {
    const { data, isLoading } = useQuery<{ pendientes: Pendiente[] }>({
        queryKey: ["pendientes"],
        queryFn: fetchHorasPendientes,
    });

    return (
        <div className='flex flex-col'>
            {
                isLoading
                    ? <Spinner />
                    :
                    data?.pendientes.slice(0, 5).map(registro => <TablaItem registro={registro} key={`${registro.user_id}-${registro.fecha}`} />)
            }
        </div>
    )
}

export default TablaPendientes

const TablaItem = ({ registro }: { registro: Pendiente }) => {
    const queryClient = useQueryClient();

    const { mutate: actualizarAsistencia, isPending } = useMutation({
        mutationFn: updateAsistencia,
        onSuccess: () => {
            toast.success("Validación realizada", {
                position: "top-left",
            });

            queryClient.invalidateQueries({
                queryKey: ["pendientes"]
            });

            queryClient.invalidateQueries({
                queryKey: ["resume-admin"]
            });
        },
        onError: (error) => {
            toast.error(error.message || "❌ Ocurrió un error al validar", {
                position: "top-left",
            });
        },
    });

    return (
        <div className="grid grid-cols-[auto_1fr_auto] border-b py-4 px-4 items-center hover:bg-gray-50 transition-colors">
            {/* Columna: Nombre y fecha */}
            <div className="flex flex-col gap-1">
                <p className="font-medium text-gray-800">{registro.nombre}</p>
                <p className="text-sm text-gray-500">{registro.fecha} • {registro.duracion}h</p>
            </div>

            {/* Columna: Actividades */}
            <div className="px-6 text-sm text-gray-700 text-left w-full flex max-w-full overflow-hidden">
                <p className='text-left w-full line-clamp-2 break-words overflow-hidden'>{registro.actividades || "---"}</p>
            </div>

            {/* Columna: Botones */}
            <div className="flex gap-3 justify-end">
                <ConfirmDialog
                    title="¿Validas esta asistencia?"
                    description="Esta acción no se puede deshacer."
                    onConfirm={() => actualizarAsistencia(
                        {
                            user_id: registro.user_id,
                            fecha: registro.fecha,
                            payload: { estado: 'validado' }
                        }
                    )}
                    confirmText="Validar"
                >
                    <button
                        className="p-2 border border-green-500 text-green-600 rounded-full hover:bg-green-100 transition"
                        title="Aceptar"
                        disabled={isPending}
                    >
                        <CheckIcon size={18} />
                    </button>
                </ConfirmDialog>

                <ConfirmDialog
                    title="¿Declinar esta asistencia?"
                    description="Esta acción no se puede deshacer."
                    onConfirm={() => actualizarAsistencia(
                        {
                            user_id: registro.user_id,
                            fecha: registro.fecha,
                            payload: { estado: 'falta', actividades: "No comprobadas" }
                        }
                    )}
                    confirmText="Validar"
                >
                    <button
                        className="p-2 border border-red-500 text-red-600 rounded-full hover:bg-red-100 transition"
                        title="Rechazar"
                        disabled={isPending}
                    >
                        <XIcon size={18} />
                    </button>
                </ConfirmDialog>
            </div>
        </div>
    )
}