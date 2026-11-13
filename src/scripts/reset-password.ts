
import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

async function restablecerPassword() {
    try {
        const email = await rl.question("Correo del usuario: ");
        const nuevaPassword = await rl.question("Nueva contraseña temporal: ");

        if (nuevaPassword.length < 8) {
            console.log("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        const usuario = await prisma.user.findUnique({
            where: { email }
        });

        if (!usuario) {
            console.log("No existe un usuario con ese correo.");
            return;
        }

        const passwordHash = await bcrypt.hash(nuevaPassword, 10);

        await prisma.user.update({
            where: { email },
            data: { password: passwordHash }
        });

        console.log(`Contraseña restablecida para ${email}.`);
    } catch (error) {
        console.error("Error al restablecer la contraseña:", error);
    } finally {
        rl.close();
        await prisma.$disconnect();
    }
}

restablecerPassword();
