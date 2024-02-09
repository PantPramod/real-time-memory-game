import express from 'express'
const app = express()
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'

const PORT = process.env.PORT || 8000

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

let count = 0
const rooms = [{ id: 1, count: 0 }]
io.on("connection", (socket) => {
    //console.log("User connected", socket.id)

    socket.on("createroom", () => {

        count++
        rooms.push({ id: `${count}`, count: 1 })
        socket.join(`${count}`)
        socket.emit("isroomcreated", true, `Room ${count} created and joined`, count)
    })

    socket.on("joinroom", (roomName) => {
    
        let isabletojoin = false
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].id == roomName && rooms[i].count < 2) {
                isabletojoin = true
                break;
            }
        }

        if (isabletojoin) {
            socket.join(`${roomName}`)
            for (let j = 0; j < rooms.length; j++) {
                if (rooms[j].id == roomName && rooms[j].count === 1) {
                    socket.to(roomName).emit("startgame", true)
                    socket.emit("startgame", true)
                    rooms[j].count = rooms[j].count + 1
                }
            }
            socket.emit("isroomjoined", true, `Room ${roomName} joined by user ${socket.id}`, roomName)
            //console.log(`Room ${roomName} joined by user ${socket.id}`)
        } else {
            socket.emit("isroomjoined", false, `room not exist`)
        }
    })

    socket.on("data", (roomName, data) => {
        // console.log("roomname==>", roomName, "data===>", data)
        socket.to(`${roomName}`).emit("data", data, socket.id)
    })

    socket.on("disconnect", () => {
        //console.log("user disconnected", socket.id)
    })
})

app.use(express.json())
app.use(cors())


app.get("/", (req, res) => {
    res.send("Welcome to server.")
})


server.listen(PORT, () => {
    console.log("server listening at PORT", PORT)
})