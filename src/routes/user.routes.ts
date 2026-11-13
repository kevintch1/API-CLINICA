import { Router } from "express";
import { registrarUsuario, obtenerUsuarios, registrarCuentaPaciente } from "../controllers/user.controller";
import { verificarToken, verificarRol } from "../middlewares/auth.middleware";

const router: Router = Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: nuevo@clinica.com
 *               password:
 *                 type: string
 *                 example: contraseña123
 *               role:
 *                 type: string
 *                 enum:
 *                   - RECEPCIONISTA
 *                   - MEDICO
 *                   - GERENCIA
 *                 example: MEDICO
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Permisos insuficientes
 */
router.post(
    "/",
    verificarToken,
    verificarRol("GERENCIA"),
    registrarUsuario
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar usuarios registrados
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Permisos insuficientes
 */
router.get(
    "/",
    verificarToken,
    verificarRol("GERENCIA"),
    obtenerUsuarios
);


/**
 * @swagger
 * /api/users/patient-account:
 *   post:
 *     summary: Crear una cuenta para un paciente existente
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - email
 *               - password
 *             properties:
 *               patientId:
 *                 type: integer
 *                 example: 1
 *               email:
 *                 type: string
 *                 example: carlos.prueba@example.com
 *               password:
 *                 type: string
 *                 example: claveTemporal123
 *     responses:
 *       201:
 *         description: Cuenta creada correctamente
 *       409:
 *         description: El paciente o correo no está disponible
 */
router.post(
    "/patient-account",
    verificarToken,
    verificarRol("GERENCIA"),
    registrarCuentaPaciente
);

export default router;