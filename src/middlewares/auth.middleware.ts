import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DatosToken {
    id: number;
    email: string;
    role: string;
}
export function verificarToken(req: Request, res: Response, next: NextFunction) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                ok: false,
                mensaje: "Token no proporcionado"
            });
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                ok: false,
                mensaje: "Token no proporcionado"
            });
        }

        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET no está configurado");
        }

        const datos = jwt.verify(token, jwtSecret) as DatosToken;

        res.locals.usuario = datos;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            mensaje: "Token inválido o expirado"
        });
    }
}

export function verificarRol(...rolesPermitidos: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const usuario = res.locals.usuario as DatosToken;

        if (!rolesPermitidos.includes(usuario.role)) {
            return res.status(403).json({
                ok: false,
                mensaje: "No tienes permisos para acceder a este recurso"
            });
        }

        next();
    };
}