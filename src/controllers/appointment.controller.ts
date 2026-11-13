import type { Request, Response } from "express";

import {
    crearCita,
    listarCitas,
    listarCitasPorDoctor,
    listarCitasPorDoctorYFecha,
    actualizarEstadoCita,
    buscarDoctorPorUsuario,
    buscarCitaPorId
} from "../models/appointment.model";
import { buscarPacientePorId, buscarPacientePorUsuario } from "../models/patient.model";
import {
    buscarDoctorPorId,
    listarHorariosPorDoctor
} from "../models/doctor.model";


export async function registrarCita(req: Request, res: Response) {
    try {
        const { date, doctorId } = req.body;

        const usuario = res.locals.usuario as {
            id: number;
            email: string;
            role: string;
        };

        // 1. Validar el doctorId
        if (!Number.isInteger(doctorId) || doctorId <= 0) {
            return res.status(400).json({
                ok: false,
                mensaje: "El doctorId debe ser un número entero válido"
            });
        }

        //Identificar al paciente
        let patientID: number;

        if (usuario.role === "PACIENTE") {
            const paciente = await buscarPacientePorUsuario(usuario.id);

            if (!paciente) {
                return res.status(404).json({
                    ok: false,
                    mensaje: "No se encontró un paciente vinculado a esta cuenta"
                });
            }

            patientID = paciente.id;
        } else {
            const patientIdBody = req.body.patientID;

            if (!Number.isInteger(patientIdBody) || patientIdBody <= 0) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "El patientID debe ser un número entero válido"
                });
            }

            const paciente = await buscarPacientePorId(patientIdBody);

            if (!paciente) {
                return res.status(404).json({
                    ok: false,
                    mensaje: "Paciente no encontrado"
                });
            }

            patientID = paciente.id;
        }

        //Validar la fecha
        const fechaCita = new Date(date);

        if (!date || isNaN(fechaCita.getTime())) {
            return res.status(400).json({
                ok: false,
                mensaje: "La fecha proporcionada no es válida"
            });
        }

        if (fechaCita <= new Date()) {
            return res.status(400).json({
                ok: false,
                mensaje: "La fecha de la cita debe ser futura"
            });
        }

        //Comprobar que el médico exista y esté activo
        const doctor = await buscarDoctorPorId(doctorId);

        if (!doctor || !doctor.activo) {
            return res.status(404).json({
                ok: false,
                mensaje: "Médico no encontrado o inactivo"
            });
        }

        //Obtener los horarios activos del médico
        const horarios = await listarHorariosPorDoctor(doctorId);

        const fechaLocal = new Date(
            fechaCita.getTime() - 4 * 60 * 60 * 1000
        );

        const dayOfWeek = fechaLocal.getUTCDay();

        const hora = String(fechaLocal.getUTCHours()).padStart(2, "0");
        const minuto = String(fechaLocal.getUTCMinutes()).padStart(2, "0");
        const segundo = fechaLocal.getUTCSeconds();
        const milisegundo = fechaLocal.getUTCMilliseconds();

        //Comprobar que el turno esté dentro del horario
        const horarioValido = horarios.some(horario => {
            if (horario.dayOfWeek !== dayOfWeek) {
                return false;
            }

            const partesInicio = horario.startTime.split(":").map(Number);
            const partesFin = horario.endTime.split(":").map(Number);

            const horaInicio = partesInicio[0] ?? 0;
            const minutoInicio = partesInicio[1] ?? 0;
            const horaFin = partesFin[0] ?? 0;
            const minutoFin = partesFin[1] ?? 0;

            const inicio = horaInicio * 60 + minutoInicio;
            const fin = horaFin * 60 + minutoFin;
            const seleccion = Number(hora) * 60 + Number(minuto);

            return (
                seleccion >= inicio &&
                seleccion + horario.slotDuration <= fin &&
                (seleccion - inicio) % horario.slotDuration === 0 &&
                segundo === 0 &&
                milisegundo === 0
            );
        });

        if (!horarioValido) {
            return res.status(400).json({
                ok: false,
                mensaje: "El médico no atiende en el horario seleccionado"
            });
        }

        //Consultar las citas del médico para ese día
        const inicioDia = new Date(fechaLocal);
        inicioDia.setUTCHours(4, 0, 0, 0);

        const finDia = new Date(inicioDia);
        finDia.setUTCDate(finDia.getUTCDate() + 1);

        const citasReservadas = await listarCitasPorDoctorYFecha(
            doctorId,
            inicioDia,
            finDia
        );

        //Comprobar que el turno no esté ocupado
        const turnoOcupado = citasReservadas.some(
            cita => cita.date.getTime() === fechaCita.getTime()
        );

        if (turnoOcupado) {
            return res.status(409).json({
                ok: false,
                mensaje: "Este turno ya está reservado"
            });
        }

        //Registrar la cita
        const cita = await crearCita({
            date: fechaCita,
            patientID,
            doctorId
        });

        return res.status(201).json({
            ok: true,
            mensaje: "Cita registrada correctamente",
            data: cita
        });

    } catch (error) {
        console.error("Error al registrar cita:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}



export async function obtenerCitas(req: Request, res: Response) {
    try {
        const citas = await listarCitas();

        return res.status(200).json({
            ok: true,
            data: citas
        });

    } catch (error) {
        console.error("Error al obtener citas:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}


export async function obtenerAgendaDoctor(req: Request, res: Response) {
    try {
        const usuario = res.locals.usuario as {
            id: number;
            email: string;
            role: string;
        };

        const startDate = new Date(req.query.startDate as string);
        const endDate = new Date(req.query.endDate as string);

        if (
            isNaN(startDate.getTime()) ||
            isNaN(endDate.getTime()) ||
            startDate > endDate
        ) {
            return res.status(400).json({
                ok: false,
                mensaje: "Debes proporcionar un rango de fechas válido"
            });
        }

        let doctorId: number;

        if (usuario.role === "MEDICO") {
            const doctor = await buscarDoctorPorUsuario(usuario.id);

            if (!doctor) {
                return res.status(404).json({
                    ok: false,
                    mensaje: "No se encontró un médico asociado a tu usuario"
                });
            }

            doctorId = doctor.id;
        } else {
            doctorId = Number(req.query.doctorId);

            if (!Number.isInteger(doctorId) || doctorId <= 0) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Debes proporcionar un doctorId válido"
                });
            }
        }

        const citas = await listarCitasPorDoctor(
            doctorId,
            startDate,
            endDate
        );

        return res.status(200).json({
            ok: true,
            data: citas
        });

    } catch (error) {
        console.error("Error al obtener agenda:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}


export async function obtenerTurnosDisponibles(req: Request, res: Response) {
    try {
        const doctorId = Number(req.query.doctorId);
        const fecha = req.query.date as string;

        if (!Number.isInteger(doctorId) || doctorId <= 0) {
            return res.status(400).json({
                ok: false,
                mensaje: "Debes proporcionar un doctorId válido"
            });
        }

        if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            return res.status(400).json({
                ok: false,
                mensaje: "Debes proporcionar una fecha con formato YYYY-MM-DD"
            });
        }

        // Separar y validar la fecha
        const partesFecha = fecha.split("-");

        const year = Number(partesFecha[0]);
        const month = Number(partesFecha[1]);
        const day = Number(partesFecha[2]);

        const fechaUTC = new Date(Date.UTC(year, month - 1, day));

        if (
            fechaUTC.getUTCFullYear() !== year ||
            fechaUTC.getUTCMonth() !== month - 1 ||
            fechaUTC.getUTCDate() !== day
        ) {
            return res.status(400).json({
                ok: false,
                mensaje: "La fecha no existe"
            });
        }

        // Comprobar que el médico exista y esté activo
        const doctor = await buscarDoctorPorId(doctorId);

        if (!doctor || !doctor.activo) {
            return res.status(404).json({
                ok: false,
                mensaje: "Médico no encontrado o inactivo"
            });
        }

        // Obtener el día de la semana
        const dayOfWeek = fechaUTC.getUTCDay();

        // Consultar los horarios del médico
        const horarios = await listarHorariosPorDoctor(doctorId);

        const horariosDelDia = horarios.filter(
            horario => horario.dayOfWeek === dayOfWeek
        );

        // Establecer el inicio y final del día en Bolivia (UTC-4)
        const inicioDia = new Date(`${fecha}T00:00:00-04:00`);
        const finDia = new Date(`${fecha}T00:00:00-04:00`);
        finDia.setUTCDate(finDia.getUTCDate() + 1);

        // Consultar las citas que ya están reservadas
        const citasReservadas = await listarCitasPorDoctorYFecha(
            doctorId,
            inicioDia,
            finDia
        );

        const citasOcupadas = new Set(
            citasReservadas.map(cita => cita.date.getTime())
        );

        const ahora = new Date();
        const turnosDisponibles: { date: Date; time: string }[] = [];

        // Generar los turnos según la duración configurada
        for (const horario of horariosDelDia) {
            const partesInicio = horario.startTime.split(":");
            const partesFin = horario.endTime.split(":");

            const horaInicio = Number(partesInicio[0]);
            const minutoInicio = Number(partesInicio[1]);

            const horaFin = Number(partesFin[0]);
            const minutoFin = Number(partesFin[1]);

            const inicioMinutos = horaInicio * 60 + minutoInicio;
            const finMinutos = horaFin * 60 + minutoFin;

            for (
                let minutos = inicioMinutos;
                minutos + horario.slotDuration <= finMinutos;
                minutos += horario.slotDuration
            ) {
                const hora = String(Math.floor(minutos / 60)).padStart(2, "0");
                const minuto = String(minutos % 60).padStart(2, "0");

                const fechaTurno = new Date(
                    `${fecha}T${hora}:${minuto}:00-04:00`
                );

                // Excluir turnos pasados y turnos reservados
                if (
                    fechaTurno > ahora &&
                    !citasOcupadas.has(fechaTurno.getTime())
                ) {
                    turnosDisponibles.push({
                        date: fechaTurno,
                        time: `${hora}:${minuto}`
                    });
                }
            }
        }

        return res.status(200).json({
            ok: true,
            doctor: {
                id: doctor.id,
                name: doctor.name,
                lastName: doctor.lastName,
                speciality: doctor.speciality.name
            },
            fecha,
            turnosDisponibles
        });

    } catch (error) {
        console.error("Error al consultar turnos disponibles:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}


export async function cambiarEstadoCita(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { status } = req.body;

        const usuario = res.locals.usuario as {
            id: number;
            email: string;
            role: string;
        };

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                ok: false,
                mensaje: "El ID de la cita no es válido"
            });
        }

        if (status !== "COMPLETADA" && status !== "CANCELADA") {
            return res.status(400).json({
                ok: false,
                mensaje: "El estado debe ser COMPLETADA o CANCELADA"
            });
        }

        //busca la cita antes de modificarla
        const citaExistente = await buscarCitaPorId(id);

        if (!citaExistente) {
            return res.status(404).json({
                ok: false,
                mensaje: "Cita no encontrada"
            });
        }

        // Comprobar que la cita todavía esté programada
        if (citaExistente.status !== "PROGRAMADA") {
            return res.status(409).json({
                ok: false,
                mensaje: "Solo se pueden modificar citas que estén PROGRAMADAS"
            });
        }
        //si es usuar médico, comprobar que la cita le pertenece.
        if (usuario.role === "MEDICO") {
            const doctor = await buscarDoctorPorUsuario(usuario.id);

            if (!doctor || doctor.id !== citaExistente.doctorId) {
                return res.status(403).json({
                    ok: false,
                    mensaje: "No tienes permiso para modificar esta cita"
                });
            }
        }

        const cita = await actualizarEstadoCita(id, status);

        return res.status(200).json({
            ok: true,
            mensaje: "Estado de la cita actualizado correctamente",
            data: cita
        });

    } catch (error) {
        console.error("Error al actualizar cita:", error);

        return res.status(500).json({
            ok: false,
            mensaje: "Error interno del servidor"
        });
    }
}
