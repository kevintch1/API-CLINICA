//vamos a ahcer las pruebas
import { email } from "zod";
import { validarPaciente } from "./src/middlewares/patient.validation";

const pacienteValido = {
    name: "carlos",
    lastName: "Perez",
    email: "calos@gmail.com",
    phone: "75412368",
    birthDate: "1995-05-20",
    address: "Santa Cruz, Bolivia"
};
const pacienteInvalido = {
    name: "",
    lastName: "Perez",
    email: "calos@gmail.com",
    phone: "75412368",
    birthDate: "1995-05-20",
    address: "Santa Cruz, Bolivia"
}

console.log("PAciente VAlido:");
console.log(validarPaciente(pacienteValido));
console.log("PAciente invalido:");
console.log(validarPaciente(pacienteInvalido));