import { prisma } from "../config/prisma";
export async function crearEspecialidad(datos: {
    name: string;
}) {
    return await prisma.speciality.create({
        data: datos
    });
}

export async function listarEspecialidades() {
    return await prisma.speciality.findMany({
        include: {
            doctors: true
        }
    });
}
