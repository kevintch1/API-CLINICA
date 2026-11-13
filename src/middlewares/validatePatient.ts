import type { Request, Response, NextFunction } from "express";
import { validarPaciente } from "./patient.validation";

export function validatePatient(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const resultado = validarPaciente(req.body);

    if (!resultado.success) {
        return res.status(400).json({
            ok: false,
            errores: resultado.error.issues
        });
    }
    req.body = resultado.data;
    next();
}