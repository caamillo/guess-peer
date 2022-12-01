const initGame = (self, roomid) => {
    self.rooms[roomid].game = {
        status: {
            started: false,
            usedids: [],
            points: []
        },
        config: self.config.guess,
        round: {
            nround: -1
        }
    }
    for (let usrid of self.rooms[roomid].usrids) self.rooms[roomid].game.status.points.push({
        usrid: usrid,
        points: 0
    })
}

const findParams = (args) => {
    const params = []
    for (arg of args) {
        if (arg.slice(0, 2) === '--') params.push(arg.slice(2))
    }
    return params
}

const defaultCommand = ([cmd, args], callback) => {
    try {
        if (args.length < cmd.args.min) throw `Error: min. args: ${ cmd.args.min }. You inserted: ${ args.length } args`
        if (args.length > cmd.args.max && cmd.args.max !== -1) throw `Error: max. args: ${ cmd.args.max }. You inserted: ${ args.length } args`
        const params = findParams(args)
        const paramsPrinted = []
        for (let param of params)
            if (cmd[param]) paramsPrinted.push(cmd[param])
        const res = callback()
        return {
            code: 200,
            body: res,
            params: paramsPrinted
        }
    } catch(err) {
        console.log(err)
        return {
            code: 400,
            message: err
        }
    }
}

module.exports = {
    initGame,
    defaultCommand
}