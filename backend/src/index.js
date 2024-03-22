import mongoose from "mongoose";
import app from "./app.js";
import logger from "./config/logger.config.js";


// Varibales de entorno
const { DATABASE_URL } = process.env;
const PORT = process.env.PORT || 3000;

// Exit on mongoose connection error
mongoose.connection.on("error", (error) => {
    logger.error("Error en la base de datos: ", error);
    process.exit(1);
})

//mongodb debug mode
if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
}

// Conectarse a la base de datos MongoDB
mongoose.connect(DATABASE_URL).then(() => {
    logger.info("Conectado a la base de datos MongoDB");
});


let server;

server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    console.log("process id", process.pid)
    // throw new Error("Error al iniciar el servidor");
})

//handle server errors

const exitHandler = () => {
    if (server) {
        logger.info('Server closed');
        process.exit(1);
    } else {
        process.exit(1);
    }
}

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
}

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

//SIGTERM
process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        logger.info('Server closed');
        process.exit(1);
    }
})