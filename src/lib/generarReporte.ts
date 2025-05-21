import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data: Asistencia[], nombre: string) => {
    const allowedKeys: (keyof Asistencia)[] = [
        "fecha",
        "duracion",
        "estado",
        "hora_inicio",
        "hora_fin",
        "actividades"
    ];

    const cleanedData = data.map(item => {
        const cleanedItem: Partial<Asistencia> = {};
        for (const key of allowedKeys) {
            if (key in item) {
                cleanedItem[key] = item[key] as unknown as undefined;
            }
        }
        return cleanedItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(cleanedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte de asistencias");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${nombre}.xlsx`);
};

type DataPorPersona = {
    [id: string]: {
        nombre: string;
        asistencias: Asistencia[];
    };
};

export const exportMultiSheetExcel = (data: DataPorPersona, fileName: string) => {
    const allowedKeys: (keyof Asistencia)[] = [
        "fecha",
        "duracion",
        "estado",
        "hora_inicio",
        "hora_fin",
        "actividades"
    ];

    const workbook = XLSX.utils.book_new();

    Object.values(data).forEach(({ nombre, asistencias }) => {
        const cleanedData = asistencias.map(item => {
            const cleanedItem: Partial<Asistencia> = {};
            for (const key of allowedKeys) {
                cleanedItem[key] = item[key]  as unknown as undefined;
            }
            return cleanedItem;
        });

        const worksheet = XLSX.utils.json_to_sheet(cleanedData);
        const sheetName = nombre.slice(0, 31); // Excel limita los nombres de hoja a 31 caracteres
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
};