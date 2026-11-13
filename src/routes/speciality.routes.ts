import { Router } from "express";
import { registrarEspecialidad, obtenerEspecialidades } from "../controllers/speciality.controller";
import { verificarToken, verificarRol } from "../middlewares/auth.middleware";

const router: Router = Router();

/**
 * @swagger
 * /api/specialities:
 *   get:
 *     summary: Listar especialidades médicas
 *     tags:
 *       - Especialidades
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de especialidades
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Permisos insuficientes
 */
router.get(
    "/",
    verificarToken,
    verificarRol("RECEPCIONISTA", "MEDICO", "GERENCIA"),
    obtenerEspecialidades
);

/**
 * @swagger
 * /api/specialities:
 *   post:
 *     summary: Registrar una especialidad médica
 *     tags:
 *       - Especialidades
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cardiología
 *     responses:
 *       201:
 *         description: Especialidad registrada correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Solo GERENCIA puede registrar especialidades
 */
router.post(
    "/",
    verificarToken,
    verificarRol("GERENCIA"),
    registrarEspecialidad
);

export default router;