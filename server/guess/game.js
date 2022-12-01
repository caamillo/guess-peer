const fs = require('fs');

const characters = JSON.parse(fs.readFileSync('./characters.json'))

const setRound = (self, roomid) => {
    const round = self.rooms[roomid].game.round
    const toguess = characters[Math.floor(Math.random() * characters.length)].id
    const tempcharacters = [...characters]
    const guessoptions = []
    for (let i = 0; i < self.config.noptions; i++) {
        const optioncharacter = Math.floor(Math.random() * tempcharacters.length)
        guessoptions.push(tempcharacters[optioncharacter].id)
        tempcharacters.splice(optioncharacter, 1)
    }
    self.rooms[roomid].game.round = {
        nround: round.nround + 1,
        toguess: toguess,
        guessoptions: guessoptions
    }
}

const addPoints = (self, roomid, usrid) => {
    const points = self.rooms[roomid].game.status.points
    self.rooms[roomid].game.status.points[points.findIndex(el => el.usrid === usrid)].points += self.config.guess.correct
}

module.exports = {
    setRound,
    addPoints
}