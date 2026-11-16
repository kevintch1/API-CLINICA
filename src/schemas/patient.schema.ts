
import { z } from "zod";

export const patientSchema = z.object({
    name: z.string().trim().min(1, "El nombre es obligatorio"),
    lastName: z.string().trim().min(1, "El apellido es obligatorio"),
    email: z.string().trim().email("El correo no es válido"),
    phone: z.string().trim().min(1, "El telefono es obligatorio"),
    birthDate: z.coerce.date().refine((date) => date <= new Date(), {
        message: "La fecha de nacimiento no puede ser futura"
    }),
    address: z.string().trim().min(1, "La direccion es obligatoria")
});
