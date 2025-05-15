import { fetchHorasPendientes, updateAsistencia } from '@/lib/api/admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Spinner } from '../ui/spinner';
import { CheckIcon, XIcon } from 'lucide-react';
import { ConfirmDialog } from '../ui/confirmDialog';
import { toast } from 'sonner';
import Image from 'next/image';

const TablaPendientes = () => {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery<{ pendientes: Pendiente[] }>({
        queryKey: ['pendientes'],
        queryFn: fetchHorasPendientes,
    });

    const { mutate: actualizarAsistencia, isPending } = useMutation({
        mutationFn: updateAsistencia,
        onSuccess: () => {
            toast.success('Validación realizada', { position: 'top-left' });
            queryClient.invalidateQueries({ queryKey: ['pendientes'] });
            queryClient.invalidateQueries({ queryKey: ['resume-admin'] });
        },
        onError: (error) => {
            toast.error(error.message || '❌ Ocurrió un error al validar', {
                position: 'top-left',
            });
        },
    });

    if (isLoading) return (
        <div className='w-full h-full flex items-center justify-center'>
            <Spinner size={'large'} className='text-[#b91116]' />
        </div>
    );

    if (!data?.pendientes.length) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Image
                    src="/no-data.svg"
                    alt="Sin pendientes"
                    width={220}
                    height={220}
                    className="mb-4"
                />
                <p className="text-lg">No hay validaciones pendientes</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {data.pendientes.slice(0, 5).map((registro) => (
                <div
                    key={`${registro.user_id}-${registro.fecha}`}
                    className="grid grid-cols-[auto_1fr_auto] border-b py-4 px-4 items-center hover:bg-gray-50 transition-colors"
                >
                    {/* Columna: Nombre y fecha */}
                    <div className="flex flex-col gap-1">
                        <p className="font-medium text-gray-800">{registro.nombre}</p>
                        <p className="text-sm text-gray-500">
                            {registro.fecha} • {registro.duracion}h
                        </p>
                    </div>

                    {/* Columna: Actividades */}
                    <div className="px-6 text-sm text-gray-700 text-left w-full flex max-w-full overflow-hidden">
                        <p className="line-clamp-2 break-words w-full">
                            {registro.actividades || '---'}
                        </p>
                    </div>

                    {/* Columna: Botones */}
                    <div className="flex gap-3 justify-end">
                        <ConfirmDialog
                            title="¿Validas esta asistencia?"
                            description="Esta acción no se puede deshacer."
                            onConfirm={() =>
                                actualizarAsistencia({
                                    user_id: registro.user_id,
                                    fecha: registro.fecha,
                                    payload: { estado: 'validado' },
                                })
                            }
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
                            onConfirm={() =>
                                actualizarAsistencia({
                                    user_id: registro.user_id,
                                    fecha: registro.fecha,
                                    payload: {
                                        estado: 'falta',
                                        actividades: 'No comprobadas',
                                    },
                                })
                            }
                            confirmText="Rechazar"
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
            ))}
        </div>
    );
};

export default TablaPendientes;
