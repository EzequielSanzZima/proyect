import express from "express";

import { Server as HttpServer } from "http";
import { Server as Socket } from "socket.io";
import parseArgs from "minimist";

import authWebRouter from "./routers/web/auth.js";
import homeWebRouter from "./routers/web/home.js";
import productosApiRouter from "./routers/api/productos.js";

import addProductosHandlers from "./routers/ws/productos.js";
import addMensajesHandlers from "./routers/ws/mensajes.js";

import objectUtils from "./utils/objectUtils.js";
import { logger } from "./logger/logger.js";

import passport from "passport";
import cookieParser from "cookie-parser";
import path from "path";
import { fork } from "child_process";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import mongoose from "mongoose";
import os from "os";
//--------------------------------------------
// minimist

const optionsM = {
  default: { p: 8080, m: "fork" },
  alias: { p: "port", m: "modo" },
};
const args = parseArgs(process.argv.slice(2), optionsM);

const PORT = args.p;
const MODO = args.m;

//--------------------------------------------
// instancio .env
import * as dotenv from "dotenv";
const NODE_ENV = process.env.NODE_ENV || "development";

dotenv.config({
  path: `.env.${NODE_ENV}`,
});

mongoose.set("strictQuery", true);

//--------------------------------------------
// instancio servidor, socket y api

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);
app.use(passport.initialize());

//--------------------------------------------
// configuro el socket

io.on("connection", async (socket) => {
  console.log(`Cliente conectado.`);
  addProductosHandlers(socket, io.sockets);
  addMensajesHandlers(socket, io.sockets);
});

//--------------------------------------------
// configuro el servidor

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(objectUtils.createOnMongoStore());

// MIDDLEWARE PASSPORT
app.use(passport.initialize());
app.use(passport.session());

import auth from "./routers/web/auth.js";
const sessions = auth;
app.use("/api/sessions", sessions);

//--------------------------------------------
// rutas del servidor API REST

app.use(productosApiRouter);

//--------------------------------------------
// rutas del servidor web

app.use(authWebRouter);
app.use(homeWebRouter);

//--------------------------------------------
// inicio el servidor

//Cluster
if (MODO === "cluster" && cluster.isPrimary) {
  const numCpus = os.cpus().length;
  logger.info(numCpus);
  for (let i = 0; i < numCpus; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    logger.error(`Process ${worker.process.pid} stopped working`);
    cluster.fork();
  });
} else {
  //express
  app.listen(PORT, () =>
    logger.info(`Server listening on port ${PORT} on process ${process.pid}`)
  );
}
