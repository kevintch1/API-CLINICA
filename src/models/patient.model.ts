import { prisma } from "../config/prisma";

export async function crearPaciente(datos: {
    name: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: Date;
    address: string;
}) {
    return await prisma.patient.create({
        data: datos
    });
}
export async function listarPacientes() {
    return await prisma.patient.findMany();
}
export async function buscarPacientePorId(id: number) {
    return await prisma.patient.findUnique({
        where: {
            id: id
        }
    });
}
export async function obtenerHistorialPaciente(id: number) {
    return await prisma.patient.findUnique({
        where: {
            id: id
        },
        include: {
            appointments: {
                include: {
                    doctor: {
                        include: {
                            speciality: true
                        }
                    }
                }
            }
        }
    });
}


export async function obtenerCitasPorUsuario(userId: number) {
    return await prisma.patient.findUnique({
        where: {
            userId: userId
        },
        select: {
            id: true,
            name: true,
            lastName: true,
            appointments: {
                orderBy: {
                    date: "asc"
                },
                select: {
                    id: true,
                    date: true,
                    status: true,
                    doctor: {
                        select: {
                            name: true,
                            lastName: true,
                            speciality: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}


export async function buscarPacientePorUsuario(userId: number) {
    return await prisma.patient.findUnique({
        where: {
            userId: userId
        }
    });
}