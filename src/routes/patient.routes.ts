
import { Router } from "express";

import {
    registrarPaciente,
    obtenerPacientes,
    obtenerPacientesPorId,
    obtenerHistorial, obtenerMisCitas
} from "../controllers/patient.controller";

import { validatePatient } from "../middlewares/validatePatient";
import {
    verificarToken,
    verificarRol
} from "../middlewares/auth.middleware";

const router: Router = Router();

/**
 * @swagger
 * tags:
 *   name: Pacientes
 *   description: Gestión de pacientes de la clínica
 */

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Registrar un nuevo paciente
 *     description: Permite a recepción o gerencia registrar un paciente.
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastName
 *               - email
 *               - phone
 *               - birthDate
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan
 *               lastName:
 *                 type: string
 *                 example: Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@gmail.com
 *               phone:
 *                 type: string
 *                 example: "70012345"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1995-05-20"
 *               address:
 *                 type: string
 *                 example: La Paz
 *     responses:
 *       201:
 *         description: Paciente registrado correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Permisos insuficientes
 *       409:
 *         description: El correo ya está registrado
 */
router.post(
    "/",
    verificarToken,
    verificarRol("RECEPCIONISTA", "GERENCIA"),
    validatePatient,
    registrarPaciente
);

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Listar todos los pacientes
 *     description: Obtiene la lista de pacientes registrados. Disponible para recepción y gerencia.
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pacientes obtenida correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Permisos insuficientes
 */
router.get(
    "/",
    verificarToken,
    verificarRol("RECEPCIONISTA", "GERENCIA"),
    obtenerPacientes
);


/**
 * @swagger
 * /api/patients/me/appointments:
 *   get:
 *     summary: Obtener las citas del paciente autenticado
 *     description: Permite al paciente consultar exclusivamente sus propias citas.
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Citas obtenidas correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: No existe un paciente vinculado a esta cuenta
 */
router.get(
    "/me/appointments",
    verificarToken,
    verificarRol("PACIENTE"),
    obtenerMisCitas
);


/**
 * @swagger
 * /api/patients/{id}/history:
 *   get:
 *     summary: Obtener historial completo de un paciente
 *     description: Permite consultar el historial médico de un paciente.
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador del paciente
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Historial médico obtenido correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Paciente no encontrado
 */
router.get(
    "/:id/history",
    verificarToken,
    verificarRol("RECEPCIONISTA", "MEDICO", "GERENCIA"),
    obtenerHistorial
);

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Buscar un paciente por ID
 *     description: Obtiene los datos de un paciente específico.
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identificador del paciente
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Paciente encontrado correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Paciente no encontrado
 */
router.get(
    "/:id",
    verificarToken,
    verificarRol("RECEPCIONISTA", "GERENCIA"),
    obtenerPacientesPorId
);

export default router;
