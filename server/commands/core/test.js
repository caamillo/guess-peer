module.exports = {
    name: 'test name',
    desc: 'test desc',
    args: {
        min: 0,
        max: -1
    },
    utilisation: 'test [...args]',
    execute: (self, args) => {
        for (let arg of args) console.log(arg)
    }
}