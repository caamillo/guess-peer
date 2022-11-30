const initGame = (self, roomid) => {
    self.rooms[roomid].game = {
        started: false,
        config: self.config.guess,
        round: 0,
        points: []
    }
    for (let usrid of self.rooms[roomid].usrids) self.rooms[roomid].game.points.push({
        usrid: usrid,
        points: 0
    })
}

module.exports = {
    initGame
}