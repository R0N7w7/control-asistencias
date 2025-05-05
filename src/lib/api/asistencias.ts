export async function postAsistencia(data: Asistencia) {
  const res = await fetch("/api/asistencias", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Error al registrar asistencia");
  }

  return res.json(); // { message: 'Asistencia registrada correctamente' }
}

export async function fetchInitData() {
  const res = await fetch("/api/bff/", {
    method: "GET"
  });

  if (!res.ok) throw new Error("Fallo al obtener data");
  return res.json();
}

export async function deleteAsistencia(id: string) {
  const res = await fetch(`/api/asistencias/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Error al eliminar asistencia");
  }

  return res.json(); // { message: 'Asistencia eliminada correctamente' }
}
