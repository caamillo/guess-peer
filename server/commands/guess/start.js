const { initGame } = require('../../guess/utils')

module.exports = {
    name: 'start',
    desc: 'Start the game!',
    args: {
        min: 1, max: -1
    },
    utilisation: 'test [...args]',
    execute: (self, roomid) => {
        try {
            if (!self.rooms[roomid]) throw "Questa stanza non esiste"
            initGame(self, roomid)
            console.log(self.rooms[roomid])
        } catch(err) {
            return {
                code: 400,
                message: err
            }
        }
        return {
            code: 200,
            message: 'Testttstsstts'
        }
    }
}