import type { Request, Response } from "express";
import { obtenerRentabilidadPorArea, obtenerResumenDiario } from "../models/report.model";

export async function obtenerReporteRentabilidad(req: Request, res: Response) {
    try {
        const citas = await obtenerRentabilidadPorArea();

        const reporte = citas.reduce((resultado: any[], cita) => {
            const especialidad = cita.doctor.speciality.name;

            const existente = resultado.find((item) => item.especialidad === especialidad);
            if (existente) {
                existente.totalCitas++;
            } else {
                resultado.push({
                    especialidad: especialidad,
                    totalCitas: 1
                });

            }
            return resultado;
        }, []);
        return res.status(200).json({
            ok: true,
            data: reporte
        });
    } catch (error) {
        console.error("Error al generar reporte:", error);
        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}

export async function obtenerReporteDiario(req: Request, res: Response) {
    try {
        const fecha = req.query.date as string;

        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(fecha) ||
            isNaN(Date.parse(`${fecha}T00:00:00-04:00`)) ||
            new Date(`${fecha}T00:00:00-04:00`).toISOString().slice(0, 10) !== fecha
        ) {
            return res.status(400).json({
                ok: false,
                mensaje: "Debes proporcionar una fecha válida en formato YYYY-MM-DD"
            });
        }

        const reporte = await obtenerResumenDiario(fecha);

        return res.status(200).json({
            ok: true,
            data: reporte
        });
    } catch (error) {
        console.error("Error al generar resumen diario:", error);
        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}