import express from "express";
import { prisma } from "./config/prisma";
import patienteRoutes from "./routes/patient.routes";
import doctorRoutes from "./routes/doctor.routes";
import specialityRoutes from "./routes/speciality.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import appointmentRoutes from "./routes/appointment.routes";
import reportRoutes from "./routes/report.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

const app = express();

const PORT = 3000;

app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/patients", patienteRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/specialities", specialityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
    res.json({
        mensaje: "Bienvenido a la API Clínica Salud Integral"
    });
});


app.listen(PORT, async () => {
    try {
        await prisma.$connect();

        console.log("Conexion exitosa con PostgreSQL");
        console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
    } catch (error) {
        console.error("Error al conecter con PostgreSQL: ", error)
    }
});