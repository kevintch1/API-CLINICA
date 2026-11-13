import type { Request, Response } from "express";
import { crearUsuario, listarUsuarios } from "../models/user.model";
import { crearCuentaPaciente } from "../models/user.model";
export async function registrarUsuario(req: Request, res: Response) {
    try {
        const usuario = await crearUsuario(req.body);

        return res.status(201).json({
            ok: true,
            mensaje: "Usuario registrado correctamente",
            data: usuario
        });

    } catch (error) {
        console.error("Error al registrar usuario:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}

export async function obtenerUsuarios(req: Request, res: Response) {
    try {
        const usuarios = await listarUsuarios();

        return res.status(200).json({
            ok: true,
            data: usuarios
        });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}


export async function registrarCuentaPaciente(req: Request, res: Response) {
    try {
        const { patientId, email, password } = req.body;

        if (
            !Number.isInteger(patientId) ||
            patientId <= 0 ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            password.length < 8
        ) {
            return res.status(400).json({
                ok: false,
                mensaje: "Datos inválidos. La contraseña debe tener al menos 8 caracteres"
            });
        }

        const usuario = await crearCuentaPaciente({
            patientId,
            email,
            password
        });

        return res.status(201).json({
            ok: true,
            mensaje: "Cuenta del paciente creada correctamente",
            data: usuario
        });

    } catch (error) {
        if (error instanceof Error) {
            const mensajes: Record<string, string> = {
                PACIENTE_NO_ENCONTRADO: "El paciente no existe",
                PACIENTE_YA_TIENE_CUENTA: "El paciente ya tiene una cuenta",
                CORREO_NO_COINCIDE: "El correo no coincide con el del paciente",
                CORREO_YA_REGISTRADO: "El correo ya está registrado"
            };

            if (mensajes[error.message]) {
                return res.status(409).json({
                    ok: false,
                    mensaje: mensajes[error.message]
                });
            }
        }

        console.error("Error al crear cuenta del paciente:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}
