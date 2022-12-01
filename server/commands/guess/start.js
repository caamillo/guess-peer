const { initGame, defaultCommand } = require('../../guess/utils')

module.exports = {
    name: 'start',
    desc: 'Start the game!',
    args: {
        min: 1, max: -1
    },
    utilisation: 'start [roomid]',
    execute: (self, args) => defaultCommand([module.exports, args], () => {
        const roomid = args[0]
        if (!self.rooms[roomid]) throw "Questa stanza non esiste"
        initGame(self, roomid)
        self.rooms[roomid].game.started = true
        return self.rooms[roomid].game
    })
}