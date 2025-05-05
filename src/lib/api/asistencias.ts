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

export async function deleteAsistencia(fecha: string) { // Ahora recibe la fecha como argumento
  const res = await fetch(`/api/asistencias`, { // La URL ahora es la base
    method: "DELETE",
    headers: {
      "Content-Type": "application/json", // Indica que estamos enviando JSON en el body
    },
    body: JSON.stringify({ fecha }), // Envía la fecha en el cuerpo como JSON
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Error al eliminar asistencia");
  }

  return res.json(); // { message: 'Asistencia eliminada correctamente' }
}
