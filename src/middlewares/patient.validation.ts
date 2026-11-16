
import { patientSchema } from "../schemas/patient.schema";

export function validarPaciente(datos: unknown) {
    return patientSchema.safeParse(datos);
}
