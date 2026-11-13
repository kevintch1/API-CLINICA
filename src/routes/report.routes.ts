
import { Router } from "express";
import {
    obtenerReporteRentabilidad,
    obtenerReporteDiario
} from "../controllers/report.controller";
import {
    verificarToken,
    verificarRol
} from "../middlewares/auth.middleware";

const router: Router = Router();

/**
 * @swagger
 * /api/reports/profitability-by-area:
 *   get:
 *     summary: Obtener reporte de citas por especialidad
 *     description: Agrupa las citas médicas según el área o especialidad.
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permisos para consultar este reporte
 *       500:
 *         description: Error interno del servidor
 */
router.get(
    "/profitability-by-area",
    verificarToken,
    verificarRol("GERENCIA"),
    obtenerReporteRentabilidad
);

/**
 * @swagger
 * /api/reports/daily-summary:
 *   get:
 *     summary: Obtener resumen diario de citas
 *     description: Cuenta las citas completadas y canceladas de una fecha determinada.
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2026-11-12"
 *         description: Fecha del reporte en formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Resumen diario generado correctamente
 *       400:
 *         description: Fecha inválida o no proporcionada
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permisos para consultar este reporte
 *       500:
 *         description: Error interno del servidor
 */
router.get(
    "/daily-summary",
    verificarToken,
    verificarRol("GERENCIA"),
    obtenerReporteDiario
);

export default router;
