module.exports = {
    name: 'test',
    desc: 'test desc',
    args: {
        min: 0,
        max: -1
    },
    utilisation: 'test [...args]',
    execute: (self, args) => {
        try {
            for (let arg of args) console.log(arg)
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