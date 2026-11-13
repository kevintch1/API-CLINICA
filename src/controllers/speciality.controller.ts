import type { Request, Response } from "express";
import { crearEspecialidad, listarEspecialidades } from "../models/speciality.model";


export async function registrarEspecialidad(req: Request, res: Response) {
    try {
        const especialidad = await crearEspecialidad(req.body);

        return res.status(201).json({
            ok: true,
            mensaje: "Especialidad Registrada Correctamente",
            data: especialidad
        });
    } catch (error) {
        console.error("Error al registrar Especialidad: ", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });

    }
}
export async function obtenerEspecialidades(req: Request, res: Response) {
    try {
        const especialidad = await listarEspecialidades();

        return res.status(200).json({
            ok: true,
            data: especialidad
        })
    } catch (error) {
        console.error("Error al obtener Especilidades", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}