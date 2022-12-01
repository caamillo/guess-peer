const { defaultCommand } = require('../../guess/utils')

module.exports = {
    name: 'help',
    desc: 'get utilisation of cmd',
    args: {
        min: 1, max: -1
    },
    utilisation: 'help [cmd]',
    execute: (self, args) => defaultCommand([module.exports, args], () => self.commands[args[0]].utilisation)
}