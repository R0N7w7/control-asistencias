import { create } from "zustand";

interface PracticanteState {
  practicante: Practicante;
  horas: Asistencia[];
  setPracticante: (data: Practicante) => void;
  setHoras: (data: Asistencia[]) => void;
}

export const usePracticanteStore = create<PracticanteState>((set) => ({
  practicante: {horasTotales:0, nombre: ""},
  horas: [],
  setPracticante: (data) => set({ practicante: data }),
  setHoras: (data) => set({ horas: data }),
}));
