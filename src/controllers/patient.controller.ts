import type { Request, Response } from "express";
import { crearPaciente, listarPacientes, buscarPacientePorId, obtenerHistorialPaciente, obtenerCitasPorUsuario } from "../models/patient.model";

export async function registrarPaciente(req: Request, res: Response) {
    try {
        const paciente = await crearPaciente(req.body);

        return res.status(201).json({
            ok: true,
            mensaje: "Paciente Registrado Correctamente",
            data: paciente
        });
    } catch (error) {
        console.error("Error al registrar paciente: ", error);

        return res.status(500).json({
            ok: false,
            message: "Erro interno del servidor"
        });

    }
}

export async function obtenerPacientes(req: Request, res: Response) {
    try {
        const pacientes = await listarPacientes();

        return res.status(200).json({
            ok: true,
            data: pacientes
        })
    } catch (error) {
        console.error("Error al obtener pacientes", error);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor"
        });
    }
}

export async function obtenerPacientesPorId(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                ok: false,
                mensaje: "El ID debe ser un número positivo"
            });
        }

        const paciente = await buscarPacientePorId(id);

        if (!paciente) {
            return res.status(404).json({
                ok: false,
                mensaje: "Paciente no encontrado"
            });
        }

        return res.status(200).json({
            ok: true,
            data: paciente
        });

    } catch (error) {
        console.error("Error al buscar el paciente:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}
export async function obtenerHistorial(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                ok: false,
                mensaje: "El Id del paciente debe ser un numero positivo"
            });
        }
        const historial = await obtenerHistorialPaciente(id);
        if (!historial) {
            return res.status(404).json({
                ok: false,
                mensaje: "Paciente no encontrado"
            });
        }
        return res.status(200).json({
            ok: true,
            mensaje: "Historial medico obtenido del paciente",
            data: historial
        })
    } catch (error) {
        console.error("Error al obtener el historial medico del paciente", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        })
    }
}



export async function obtenerMisCitas(req: Request, res: Response) {
    try {
        // saber que hace
        const userId = res.locals.usuario.id;

        const paciente = await obtenerCitasPorUsuario(userId);

        if (!paciente) {
            return res.status(404).json({
                ok: false,
                mensaje: "No se encontró un paciente vinculado a esta cuenta"
            });
        }

        return res.status(200).json({
            ok: true,
            mensaje: "Citas del paciente obtenidas correctamente",
            data: paciente
        });

    } catch (error) {
        console.error("Error al obtener las citas del paciente:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}
