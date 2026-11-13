import { prisma } from "../config/prisma";

export async function crearCita(datos: {
    date: Date;
    patientID: number;
    doctorId: number;
}) {
    return await prisma.appointment.create({
        data: datos,
        include: {
            patient: true,
            doctor: {
                include: {
                    speciality: true
                }
            }
        }
    })
}

export async function listarCitas() {
    return await prisma.appointment.findMany({
        include: {
            patient: true,
            doctor: {
                include: {
                    speciality: true
                }
            }
        }
    })
}

export async function listarCitasPorDoctor(
    doctorId: number,
    startDate: Date,
    endDate: Date
) {
    return await prisma.appointment.findMany({
        where: {
            doctorId: doctorId,
            date: {
                gte: startDate,
                lte: endDate
            }
        },
        include: {
            patient: true,
            doctor: {
                include: {
                    speciality: true
                }
            }
        },
        orderBy: {
            date: "asc"
        }
    });
}

export async function listarCitasPorDoctorYFecha(
    doctorId: number,
    startDate: Date,
    endDate: Date
) {
    return await prisma.appointment.findMany({
        where: {
            doctorId: doctorId,
            date: {
                gte: startDate,
                lt: endDate
            },
            status: {
                not: "CANCELADA"
            }
        },
        select: {
            id: true,
            date: true,
            status: true
        },
        orderBy: {
            date: "asc"
        }
    });
}

export async function buscarDoctorPorUsuario(userId: number) {
    return await prisma.doctor.findUnique({
        where: {
            userId
        }
    });
}
export async function buscarCitaPorId(id: number) {
    return await prisma.appointment.findUnique({
        where: {
            id
        }
    });
}

export async function actualizarEstadoCita(
    id: number,
    estado: "COMPLETADA" | "CANCELADA"
) {
    return await prisma.appointment.update({
        where: {
            id: id
        },
        data: {
            status: estado
        },
        include: {
            patient: true,
            doctor: {
                include: {
                    speciality: true
                }
            }
        }
    });
}
