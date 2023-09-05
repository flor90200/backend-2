import express from "express";
import {engine} from "express-handlebars"
import { __dirname } from "./utils.js";
import * as path from "path";
import { Server } from "socket.io";


const app = express();
const PORT = 3030;

const server = app.listen(PORT, () => {
    console.log(`Server run express port: ${PORT}`);
    });
    
    const io = new Server(server);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

app.use("/", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.render('index');


});

    const message = [];

io.on("connection", (socket) => {
        console.log(`User ${socket.id}  connected`);

        //nombre de usuario
        let userName = '';
        //message de conection
        socket.on("userConnection", (data) => {
            userName = data.user
            message.push({
                id: socket.id,
                info: 'connection',
                name: data.user,
                message: `${data.user} Connectado`,
                date: new Date().toTimeString(),
            });
            io.sockets.emit("userConnection", message);

            //mensaje enviado
            socket.on("userMessage", (data) => {
                message.push({
                    id: socket.id,
                    info: 'message',
                    name: userName,
                    message: data.message,
                    date: new Date().toString(),
                });
                io.sockets.emit("userMessage", message);
            })
        });
    })