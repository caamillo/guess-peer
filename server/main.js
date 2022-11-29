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

const leaveRoom = (roomid, usrid) => {
    const room = rooms[roomid]
    if (room == null) throw "Non esiste nessuna stanza con questo id"
    if (!room.usrids.some(el => el === usrid)) throw "Non sei in questa stanza"
    if (room.headusr === usrid && room.usrids.length === 1) return delete rooms[roomid]
    else if (room.headusr === usrid && room.usrids.length > 1)
        rooms[roomid].usrids.splice(rooms[roomid].usrids.indexOf(usrid), 1)
    rooms[roomid].headusr = rooms[roomid].usrids[Math.random() * rooms[roomid].usrids.length]
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

app.get('/getroom', (req, res) => res.json({
    room: rooms[ getUsrRoom(req.query.usrid) ]
}))

app.get('/leaveroom', (req, res) => {
    try {
        leaveRoom(req.query.roomid, req.query.usrid)
    } catch(err) {
        return res.status(400).json({
            message: err
        })
    }
    return res.status(200).json({
        roomid: req.query.roomid
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