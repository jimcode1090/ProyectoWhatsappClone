import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import createHttpError from "http-errors";
import routes from "./routes/index.js";

// Configuración dotEnv
dotenv.config();


const app = express();

//Morgan
if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"));
}

//Helmet
app.use(helmet());

//Parse json request url
app.use(express.json());

//Parse json request body
app.use(express.urlencoded({ extended: true }));

//Sanitize request data
app.use(mongoSanitize());

//Enable cookier parser
app.use(cookieParser());

//gzip compression
app.use(compression());

//File upload
app.use(fileUpload({
    useTempFiles: true,
}));

//cors
app.use(cors());


//api v1 routes
app.use("/api/v1", routes);


app.use((req, res, next) => {
    next(createHttpError.NotFound('This route does not exist'));
})

//Error handler
app.use(async (error, req, res, next) => {
    res.status(error.status || 500);
    res.send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        }
    })
})

export default app;
