export const fetchResumeData = async () => {
    const res = await fetch("/api/bff/admin", {
        method: "GET"
    });

    if (!res.ok) throw new Error("Fallo al obtener data");
    return res.json();
}

export const fetchHorasPendientes = async () => {
    const res = await fetch("/api/bff/pendientes", {
        method: "GET"
    });

    if (!res.ok) throw new Error("Fallo al obtener data");
    return res.json();
}
export const updateAsistencia = async ({
    user_id,
    fecha,
    payload,
}: {
    user_id: string;
    fecha: string;
    payload: Partial<Asistencia>; // o puedes tiparlo más fuerte si ya sabes la estructura
}) => {
    const res = await fetch("/api/bff/pendientes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id,
            fecha,
            payload,
        }),
    });

    if (!res.ok) throw new Error("Fallo al actualizar asistencia");
    return res.json();
};