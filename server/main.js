const express = require('express')
const app = express()
const cors = require('cors')
const { uuid } = require('uuidv4')
const morgan = require('morgan')
const PORT = 5001

app.use(cors())
app.use(morgan('tiny'))

global.self = {}

require('./config')
require('./loader')

self.rooms = {}

const getUsrRoom = (usrid) => Object.keys(self.rooms).find(room => self.rooms[room].usrids.some(id => id === usrid))

const leaveRoom = (roomid, usrid) => {
    const room = self.rooms[roomid]
    if (room == null) throw "Non esiste nessuna stanza con questo id"
    if (!room.usrids.some(el => el === usrid)) throw "Non sei in questa stanza"
    if (room.headusr === usrid && room.usrids.length === 1) return delete self.rooms[roomid]
    else if (room.headusr === usrid && room.usrids.length > 1)
        self.rooms[roomid].headusr = self.rooms[roomid].usrids[Math.floor(Math.random() * self.rooms[roomid].usrids.length)]
    console.log(usrid + ' è uscito')
    self.rooms[roomid].usrids.splice(self.rooms[roomid].usrids.indexOf(usrid), 1)
}

const joinRoom = (roomid, usrid) => {
    const actualroom = getUsrRoom(usrid)
    if (actualroom) throw ("Sei già nella stanza " + actualroom)
    if (self.rooms[roomid] == null) throw "Non esiste nessuna stanza con questo id"
    const room = self.rooms[roomid]
    self.rooms[roomid].usrids = [...room.usrids, usrid]
    return self.rooms[roomid]
}

const createRoom = (roomid, usrid) => {
    const actualroom = getUsrRoom(usrid)
    if (actualroom) throw ("Sei già nella stanza " + actualroom)
    self.rooms[roomid] = {
        roomid: roomid,
        usrids: [ usrid ],
        headusr: usrid,
    }
    console.log('Created room ' + roomid)
    return self.rooms[roomid]
}

app.get('/sendCommand', (req, res) => {
    try {
        const cmd = self.commands[req.query.cmd]
        if (!cmd || !(cmd.execute)) throw "Command not found"
        if (cmd && cmd.execute) {
            const cmdRes = self.commands[req.query.cmd].execute(self, JSON.parse(req.query.params))
            if (cmdRes.code >= 400) throw cmdRes.message
            return res.status(200).json(cmdRes)
        }
    } catch(err) {
        return res.status(400).json({
            code: 400,
            message: err
        })
    }
})

app.get('/getroom', (req, res) => {
    console.log(self.rooms)
    res.status(200).json({
        room: self.rooms[ getUsrRoom(req.query.usrid) ]
    })
})

app.get('/leaveroom', (req, res) => {
    let roomid = null
    try {
        roomid = getUsrRoom(req.query.usrid)
        leaveRoom(roomid, req.query.usrid)
    } catch(err) {
        return res.status(400).json({
            message: err
        })
    }
    return res.status(200).json({
        roomid: roomid
    })
})

app.get('/joinroom', (req, res) => {
    let room = null
    let usrid = null
    try {
        usrid = req.query.usrid.length > 0 ? req.query.usrid : uuid()
        room = joinRoom(req.query.roomid, usrid)
    } catch(err) {
        return res.status(400).json({
            message: err
        })
    }
    return res.status(200).json({
        room: room,
        usrid: usrid
    })
})

app.get('/createroom', (req, res) => {
    let room = null
    let usrid = null
    try {
        const roomid = uuid()
        usrid = uuid()
        room = createRoom(roomid, usrid)
    } catch(err) {
        return res.status(400).json({
            message: err
        })
    }
    return res.status(200).json({
        room: room,
        usrid: usrid
    })
})

const server = app.listen(PORT, () => {
  console.log(`Server listening on ${ PORT }`);
});