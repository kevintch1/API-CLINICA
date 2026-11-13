import { prisma } from "../config/prisma";

export async function obtenerRentabilidadPorArea() {
    return await prisma.appointment.findMany({
        include: {
            doctor: {
                include: {
                    speciality: true
                }
            }
        }
    });
}

export async function obtenerResumenDiario(fecha: string) {
    const inicioDia = new Date(`${fecha}T00:00:00-04:00`);
    const finDia = new Date(`${fecha}T23:59:59.999-04:00`);

    const completadas = await prisma.appointment.count({
        where: {
            date: {
                gte: inicioDia,
                lte: finDia
            },
            status: "COMPLETADA"
        }
    });

    const canceladas = await prisma.appointment.count({
        where: {
            date: {
                gte: inicioDia,
                lte: finDia
            },
            status: "CANCELADA"
        }
    });

    return {
        fecha: fecha,
        completadas: completadas,
        canceladas: canceladas
    };
}