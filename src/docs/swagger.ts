import swaggerJsdoc from "swagger-jsdoc";

const opciones = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Clínica Salud Integral",
            version: "1.0.0",
            description: "Documentación de la API de Clínica Salud Integral"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor local"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Introduce tu token JWT"
                }
            }
        }
    },
    apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(opciones);