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

export const fetchListaPracticantes = async () => {
    const res = await fetch("/api/bff/practicantes", {
        method: "GET"
    });

    if (!res.ok) throw new Error("Fallo al obtener la lista de practicantes");
    return res.json();
};

export const eliminarUsuario = async (userId: string) => {
    const res = await fetch("/api/bff/practicantes", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    });

    if (!res.ok) throw new Error("Fallo al eliminar usuario");
    return res.json();
};

export const createPracticante = async (data: PracticanteDTO) => {
    const res = await fetch("/api/bff/practicantes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Fallo al eliminar usuario");
    return res.json();
};

export async function fetchPracticante(userId: string) {
    const res = await fetch("/api/bff/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId })
    });

    if (!res.ok) throw new Error("Fallo al obtener data");
    return res.json();
}

type PracticanteDTO = {
    nombre: string;
    horasTotales: string;
    fechaInicio: string;
    fechaTermino: string;
    telefono: string;
    carrera: string;
    email: string;
    password: string;
}