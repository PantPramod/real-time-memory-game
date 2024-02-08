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

io.on("connection", (socket) => {
    console.log("User connected", socket.id)

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id)
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