
import { Router } from "express";

import {
    registrarCita,
    obtenerCitas,
    cambiarEstadoCita,
    obtenerTurnosDisponibles
} from "../controllers/appointment.controller";

import {
    verificarToken,
    verificarRol
} from "../middlewares/auth.middleware";

const router: Router = Router();

/**
 * @swagger
 * /api/appointments/mine:
 *   post:
 *     summary: Reservar una cita como paciente
 *     tags:
 *       - Citas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - doctorId
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-11-20T18:00:00.000Z"
 *               doctorId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Cita registrada correctamente
 *       400:
 *         description: Fecha u horario inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo los pacientes pueden usar esta ruta
 *       404:
 *         description: Paciente o médico no encontrado
 *       409:
 *         description: Turno ocupado
 */
router.post(
    "/mine",
    verificarToken,
    verificarRol("PACIENTE"),
    registrarCita
);


/**
 * @swagger
 * /api/appointments/availability:
 *   get:
 *     summary: Consultar turnos disponibles de un médico
 *     tags:
 *       - Citas
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-11-16"
 *     responses:
 *       200:
 *         description: Turnos disponibles del médico
 *       400:
 *         description: Parámetros inválidos
 *       404:
 *         description: Médico no encontrado o inactivo
 */
router.get("/availability", obtenerTurnosDisponibles);

/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Registrar una nueva cita médica
 *     tags:
 *       - Citas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-11-20T15:00:00.000Z"
 *               patientID:
 *                 type: integer
 *                 example: 1
 *               doctorId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Cita registrada correctamente
 *       400:
 *         description: Fecha inválida o datos incorrectos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.post(
    "/",
    verificarToken,
    verificarRol("RECEPCIONISTA", "GERENCIA"),
    registrarCita
);

/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Listar todas las citas médicas
 *     tags:
 *       - Citas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de citas médicas
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.get(
    "/",
    verificarToken,
    verificarRol("RECEPCIONISTA", "GERENCIA"),
    obtenerCitas
);

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   patch:
 *     summary: Actualizar el estado de una cita
 *     tags:
 *       - Citas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identificador de la cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - COMPLETADA
 *                   - CANCELADA
 *                 example: COMPLETADA
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Estado o identificador inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Cita no encontrada
 */
router.patch(
    "/:id/status",
    verificarToken,
    verificarRol("RECEPCIONISTA", "GERENCIA", "MEDICO"),
    cambiarEstadoCita
);
export default router;
