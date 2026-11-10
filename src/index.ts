import express from "express";
import { prisma } from "./config/prisma";
const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensaje: "Bienvenido a la API Clínica Salud Integral"
    });
});
app.get("/api/doctors", (req, res) => {
    res.json({
        mensaje: "Lista de médicos"
    });
});

app.listen(PORT, async () => {
    try {
        await prisma.$connect();

        console.log("Conexion exitosa con PostgreSQL");
        console.log(`Servidor ejecutandose en http://localhost${PORT}`);
    } catch (error) {
        console.error("Error al conecter con PostgreSQL: ", error)
    }
});