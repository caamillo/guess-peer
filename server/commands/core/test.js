module.exports = {
    name: 'test',
    minArgs: 0,
    maxArgs: -1,
    utilisation: 'test',
    execute: (self, args) => {
        for (let arg of args) console.log(arg)
        return {
            test: true
        }
    }
}