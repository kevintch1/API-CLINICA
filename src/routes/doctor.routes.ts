import { Router } from "express";
import { registrarDoctor, obtenerDoctores, obtenerDoctoresPublicos, registrarHorarioDoctor, cambiarEstadoDoctor, obtenerHorariosDoctor } from "../controllers/doctor.controller";
import { verificarToken, verificarRol } from "../middlewares/auth.middleware";
import { obtenerAgendaDoctor } from "../controllers/appointment.controller";

const router: Router = Router();
/**
 * @swagger
 * /api/doctors/public:
 *   get:
 *     summary: Consultar médicos disponibles públicamente
 *     description: Devuelve los médicos activos con sus especialidades, sin requerir autenticación.
 *     tags:
 *       - Doctores
 *     responses:
 *       200:
 *         description: Lista de médicos activos
 */
router.get(
    "/public",
    obtenerDoctoresPublicos
);

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Listar doctores
 *     tags:
 *       - Doctores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: specialityId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filtrar doctores por especialidad
 *     responses:
 *       200:
 *         description: Lista de doctores
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 */
router.get(
    "/",
    verificarToken,
    verificarRol("RECEPCIONISTA", "MEDICO", "GERENCIA"),
    obtenerDoctores
);

/**
 * @swagger
 * /api/doctors/my-agenda:
 *   get:
 *     summary: Consultar agenda de un doctor
 *     description: Consulta temporalmente reservada a GERENCIA. Se habilitará el acceso individual del médico cuando la agenda se filtre mediante su identidad autenticada.
 *     tags:
 *       - Doctores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-11-12"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-11-15"
 *     responses:
 *       200:
 *         description: Agenda del doctor
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Permisos insuficientes
 *       400:
 *         description: Parámetros inválidos
 */
router.get(
    "/my-agenda",
    verificarToken,
    verificarRol("GERENCIA", "MEDICO"),
    obtenerAgendaDoctor
);

/**
 * @swagger
 * /api/doctors/{id}/schedules:
 *   get:
 *     summary: Consultar horarios de atención de un médico
 *     description: Permite consultar públicamente los horarios activos de un médico.
 *     tags:
 *       - Doctores
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Horarios encontrados
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Médico no encontrado o inactivo
 */
router.get(
    "/:id/schedules",
    obtenerHorariosDoctor
);

/**
 * @swagger
 * /api/doctors:
 *   post:
 *     summary: Registrar un doctor
 *     tags:
 *       - Doctores
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
 *                 example: Carlos
 *               lastName:
 *                 type: string
 *                 example: Perez
 *               specialityId:
 *                 type: integer
 *                 example: 1
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Doctor registrado correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Solo GERENCIA puede registrar doctores
 */
router.post(
    "/",
    verificarToken,
    verificarRol("GERENCIA"),
    registrarDoctor
);


/**
 * @swagger
 * /api/doctors/schedules:
 *   post:
 *     summary: Asignar horario a un médico
 *     description: Permite a Gerencia registrar el horario individual de un médico.
 *     tags:
 *       - Doctores
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - dayOfWeek
 *               - startTime
 *               - endTime
 *             properties:
 *               doctorId:
 *                 type: integer
 *                 example: 1
 *               dayOfWeek:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 example: 1
 *               startTime:
 *                 type: string
 *                 example: "08:00"
 *               endTime:
 *                 type: string
 *                 example: "12:00"
 *               slotDuration:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: Horario registrado correctamente
 *       400:
 *         description: Datos inválidos o médico inactivo
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Médico no encontrado
 */
router.post(
    "/schedules",
    verificarToken,
    verificarRol("GERENCIA"),
    registrarHorarioDoctor
);

/**
 * @swagger
 * /api/doctors/{id}/status:
 *   patch:
 *     summary: Activar o desactivar un médico
 *     description: Permite a Gerencia cambiar el estado de un médico sin eliminarlo.
 *     tags:
 *       - Doctores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activo
 *             properties:
 *               activo:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Estado del médico actualizado
 *       400:
 *         description: ID o estado inválido
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Médico no encontrado
 */
router.patch(
    "/:id/status",
    verificarToken,
    verificarRol("GERENCIA"),
    cambiarEstadoDoctor
);

export default router;