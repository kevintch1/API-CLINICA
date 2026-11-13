import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { buscarUsuarioPorEmail } from "../models/user.model";

export async function iniciarSesion(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const usuario = await buscarUsuarioPorEmail(email);

        if (!usuario) {
            return res.status(401).json({
                ok: false,
                mensaje: "Credenciales incorrectas"
            });
        }

        const passwordValida = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordValida) {
            return res.status(401).json({
                ok: false,
                mensaje: "Credenciales incorrectas"
            });
        }
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET no está configurado");
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email,
                role: usuario.role
            },
            jwtSecret,
            {
                expiresIn: "1d"
            }
        );


        return res.status(200).json({
            ok: true,
            mensaje: "Inicio de sesión exitoso",
            token: token
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}