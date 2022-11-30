const express = require('express')
const app = express()
const cors = require('cors')
const { uuid } = require('uuidv4')
const morgan = require('morgan')
const PORT = 5001

const rooms = {}

app.use(cors())
app.use(morgan('tiny'))

const getUsrRoom = (usrid) => Object.keys(rooms).find(room => rooms[room].usrids.some(id => id === usrid))

global.self = {}

require('./loader')

console.log(self)

const leaveRoom = (roomid, usrid) => {
    const room = rooms[roomid]
    if (room == null) throw "Non esiste nessuna stanza con questo id"
    if (!room.usrids.some(el => el === usrid)) throw "Non sei in questa stanza"
    if (room.headusr === usrid && room.usrids.length === 1) return delete rooms[roomid]
    else if (room.headusr === usrid && room.usrids.length > 1)
        rooms[roomid].headusr = rooms[roomid].usrids[Math.floor(Math.random() * rooms[roomid].usrids.length)]
    console.log(usrid + ' è uscito')
    rooms[roomid].usrids.splice(rooms[roomid].usrids.indexOf(usrid), 1)
}

const joinRoom = (roomid, usrid) => {
    const actualroom = getUsrRoom(usrid)
    if (actualroom) throw ("Sei già nella stanza " + actualroom)
    if (rooms[roomid] == null) throw "Non esiste nessuna stanza con questo id"
    const room = rooms[roomid]
    rooms[roomid].usrids = [...room.usrids, usrid]
    return rooms[roomid]
}

const createRoom = (roomid, usrid) => {
    const actualroom = getUsrRoom(usrid)
    if (actualroom) throw ("Sei già nella stanza " + actualroom)
    rooms[roomid] = {
        roomid: roomid,
        usrids: [ usrid ],
        headusr: usrid
    }
    console.log('Created room ' + roomid)
    return rooms[roomid]
}

app.get('/sendCommand', (req, res) => {
    let cmdRes = null
    const cmd = self.commands[req.query.cmd]
    try {
        if (!cmd || !(cmd.execute)) throw "Command not found"
        if (cmd && cmd.execute) {
            const args = Object.keys(req.query).filter(el => el != 'cmd').map(el => req.query[el])
            if (args.length < cmd.args.min) throw `Error: min. args: ${ cmd.args.min }. You inserted: ${ args.length } args`
            if (args.length > cmd.args.max && cmd.args.max !== -1) throw `Error: max. args: ${ cmd.args.max }. You inserted: ${ args.length } args`
            cmdRes = self.commands[req.query.cmd].execute(self, args)
        }
    } catch(err) {
        return res.status(400).json({
            code: 400,
            message: err
        })
    }
    return res.status(200).json(cmdRes)
})

app.get('/getroom', (req, res) => {
    console.log(rooms)
    res.status(200).json({
        room: rooms[ getUsrRoom(req.query.usrid) ]
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