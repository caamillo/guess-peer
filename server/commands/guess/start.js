const { initGame, defaultCommand } = require('../../guess/utils')
const { setRound } = require('../../guess/game')

module.exports = {
    name: 'start',
    desc: 'Start the game!',
    args: {
        min: 1, max: -1
    },
    utilisation: 'start [roomid]',
    execute: (self, args) => defaultCommand([module.exports, args], () => {
        const roomid = args[0]
        const room = self.rooms[roomid]
        if (!room) throw "Questa stanza non esiste"
        if (room.usrids.length < self.config.guess.players.min)
            throw `Giocatori attuali: ${ room.usrids.length }, giocatori richiesti: ${ self.config.guess.players.min }`
        else if (room.usrids.length > self.config.guess.players.max && self.config.guess.players.max !== -1)
            throw `Giocatori attuali: ${ room.usrids.length }, possono giocare solo: ${ self.config.guess.players.max }`
        initGame(self, roomid)
        self.rooms[roomid].game.status.started = true
        setRound(self, roomid)
        return self.rooms[roomid].game
    })
}