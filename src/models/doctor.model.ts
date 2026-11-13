import { prisma } from "../config/prisma";

export async function crearDoctor(datos: {
    name: string;
    lastName: string;
    specialityId: number;
    userId: number;
}) {
    return await prisma.doctor.create({
        data: datos
    });
}

export async function listarDoctores() {
    return await prisma.doctor.findMany({
        include: {
            speciality: true
        }
    });
}

export async function listarDoctoresPublicos() {
    return await prisma.doctor.findMany({
        where: {
            activo: true
        },
        select: {
            id: true,
            name: true,
            lastName: true,
            speciality: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
}

export async function listarDoctoresPorEspecialidad(specialityId: number) {
    return await prisma.doctor.findMany({
        where: {
            specialityId: specialityId
        },
        include: {
            speciality: true
        }
    });
}


export async function crearHorarioDoctor(datos: {
    doctorId: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDuration?: number;
}) {
    return await prisma.doctorSchedule.create({
        data: datos
    });
}


export async function buscarDoctorPorId(doctorId: number) {
    return await prisma.doctor.findUnique({
        where: { id: doctorId },
        include: {
            speciality: true
        }
    });
}

export async function actualizarEstadoDoctor(
    doctorId: number,
    activo: boolean
) {
    return await prisma.doctor.update({
        where: {
            id: doctorId
        },
        data: {
            activo: activo
        }
    });
}


export async function listarHorariosPorDoctor(doctorId: number) {
    return await prisma.doctorSchedule.findMany({
        where: {
            doctorId: doctorId,
            activo: true,
            doctor: {
                activo: true
            }
        },
        orderBy: {
            dayOfWeek: "asc"
        }
    });
}


