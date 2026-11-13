import type { Request, Response } from "express";
import { crearDoctor, listarDoctores, listarDoctoresPublicos, listarDoctoresPorEspecialidad, crearHorarioDoctor, buscarDoctorPorId, actualizarEstadoDoctor, listarHorariosPorDoctor } from "../models/doctor.model";

export async function registrarDoctor(req: Request, res: Response) {
    try {
        const doctor = await crearDoctor(req.body);
        return res.status(201).json({
            ok: true,
            mensaje: "Doctor Registrado correctamente",
            data: doctor
        })
    } catch (error) {
        console.error("Error al registar datos Del Doctor:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}
export async function obtenerDoctores(req: Request, res: Response) {
    try {
        const specialityIdQuery = req.query.specialityId;
        //si no envia con especialida, mostramos a todos
        if (specialityIdQuery === undefined) {
            const doctores = await listarDoctores();

            return res.status(200).json({
                ok: true,
                data: doctores
            });
        }
        //convertir el parametroanumber
        const specialityId = Number(specialityIdQuery);
        if (!Number.isInteger(specialityId) || specialityId <= 0) {
            return res.status(400).json({
                ok: false,
                mensaje: "Debe ser un numero positivo"
            })
        }
        //buscar su especialidad
        const doctores = await listarDoctoresPorEspecialidad(specialityId);
        return res.status(200).json({
            ok: true,
            data: doctores
        })
    } catch (error) {
        console.error("Error al obtener lista de Doctores:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}

export async function obtenerDoctoresPublicos(req: Request, res: Response) {
    try {
        const doctores = await listarDoctoresPublicos();

        return res.status(200).json({
            ok: true,
            data: doctores
        });

    } catch (error) {
        console.error("Error al obtener doctores públicos:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}


export async function registrarHorarioDoctor(req: Request, res: Response) {
    try {
        const { doctorId, dayOfWeek, startTime, endTime, slotDuration } = req.body;

        if (
            !Number.isInteger(doctorId) || doctorId <= 0 ||
            !Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6 ||
            typeof startTime !== "string" ||
            typeof endTime !== "string"
        ) {
            return res.status(400).json({
                ok: false,
                mensaje: "Los datos del horario son inválidos"
            });
        }

        // Validar formato de hora HH:mm
        const formatoHora = /^([01]\d|2[0-3]):[0-5]\d$/;

        if (!formatoHora.test(startTime) || !formatoHora.test(endTime)) {
            return res.status(400).json({
                ok: false,
                mensaje: "Las horas deben tener formato HH:mm"
            });
        }

        // Convertir horas a minutos para compararlas
        const partesInicio = startTime.split(":").map(Number);
        const partesFin = endTime.split(":").map(Number);

        const horaInicio = partesInicio[0]!;
        const minutoInicio = partesInicio[1]!;
        const horaFin = partesFin[0]!;
        const minutoFin = partesFin[1]!;

        const inicio = horaInicio * 60 + minutoInicio;
        const fin = horaFin * 60 + minutoFin;
        if (inicio >= fin) {
            return res.status(400).json({
                ok: false,
                mensaje: "La hora de inicio debe ser anterior a la hora de finalización"
            });
        }

        // Validar duración de la cita
        if (
            slotDuration !== undefined &&
            (!Number.isInteger(slotDuration) || slotDuration <= 0)
        ) {
            return res.status(400).json({
                ok: false,
                mensaje: "La duración debe ser un número entero positivo"
            });
        }
        // Comprobar que el médico exista
        const doctor = await buscarDoctorPorId(doctorId);

        if (!doctor) {
            return res.status(404).json({
                ok: false,
                mensaje: "El médico no existe"
            });
        }

        // Comprobar que el médico esté activo
        if (!doctor.activo) {
            return res.status(400).json({
                ok: false,
                mensaje: "No se puede asignar un horario a un médico inactivo"
            });
        }
        const horario = await crearHorarioDoctor({
            doctorId,
            dayOfWeek,
            startTime,
            endTime,
            slotDuration
        });

        return res.status(201).json({
            ok: true,
            mensaje: "Horario del médico registrado correctamente",
            data: horario
        });

    } catch (error) {
        console.error("Error al registrar horario:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}

export async function cambiarEstadoDoctor(req: Request, res: Response) {
    try {
        const doctorId = Number(req.params.id);
        const { activo } = req.body;

        if (!Number.isInteger(doctorId) || doctorId <= 0) {
            return res.status(400).json({
                ok: false,
                mensaje: "ID de médico inválido"
            });
        }

        if (typeof activo !== "boolean") {
            return res.status(400).json({
                ok: false,
                mensaje: "El campo activo debe ser true o false"
            });
        }

        const doctor = await buscarDoctorPorId(doctorId);

        if (!doctor) {
            return res.status(404).json({
                ok: false,
                mensaje: "Médico no encontrado"
            });
        }

        const doctorActualizado = await actualizarEstadoDoctor(
            doctorId,
            activo
        );

        return res.status(200).json({
            ok: true,
            mensaje: activo
                ? "Médico activado correctamente"
                : "Médico desactivado correctamente",
            data: doctorActualizado
        });

    } catch (error) {
        console.error("Error al cambiar estado del médico:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}


export async function obtenerHorariosDoctor(req: Request, res: Response) {
    try {
        const doctorId = Number(req.params.id);

        if (!Number.isInteger(doctorId) || doctorId <= 0) {
            return res.status(400).json({
                ok: false,
                mensaje: "ID de médico inválido"
            });
        }

        const doctor = await buscarDoctorPorId(doctorId);

        if (!doctor || !doctor.activo) {
            return res.status(404).json({
                ok: false,
                mensaje: "Médico no encontrado o inactivo"
            });
        }

        const horarios = await listarHorariosPorDoctor(doctorId);

        return res.status(200).json({
            ok: true,
            doctor: {
                id: doctor.id,
                name: doctor.name,
                lastName: doctor.lastName,
                speciality: doctor.speciality.name
            },
            data: horarios
        });

    } catch (error) {
        console.error("Error al obtener horarios del médico:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}
