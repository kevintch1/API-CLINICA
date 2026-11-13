
import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";

export async function crearUsuario(datos: {
    email: string;
    password: string;
    role: string;
}) {
    const passwordHash = await bcrypt.hash(datos.password, 10);

    return await prisma.user.create({
        data: {
            email: datos.email,
            password: passwordHash,
            role: datos.role
        },
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });
}

export async function buscarUsuarioPorEmail(email: string) {
    return await prisma.user.findUnique({
        where: { email }
    });
}

export async function listarUsuarios() {
    return await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }
    });
}

// Crear una cuenta y vincularla con un paciente existente
export async function crearCuentaPaciente(datos: {
    patientId: number;
    email: string;
    password: string;
}) {
    const email = datos.email.trim().toLowerCase();

    return await prisma.$transaction(async (tx) => {
        const paciente = await tx.patient.findUnique({
            where: { id: datos.patientId }
        });

        if (!paciente) {
            throw new Error("PACIENTE_NO_ENCONTRADO");
        }

        if (paciente.userId !== null) {
            throw new Error("PACIENTE_YA_TIENE_CUENTA");
        }

        if (paciente.email.toLowerCase() !== email) {
            throw new Error("CORREO_NO_COINCIDE");
        }

        const usuarioExistente = await tx.user.findUnique({
            where: { email }
        });

        if (usuarioExistente) {
            throw new Error("CORREO_YA_REGISTRADO");
        }

        const passwordHash = await bcrypt.hash(datos.password, 10);

        const usuario = await tx.user.create({
            data: {
                email,
                password: passwordHash,
                role: "PACIENTE",
                patient: {
                    connect: { id: datos.patientId }
                }
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        return usuario;
    });
}
