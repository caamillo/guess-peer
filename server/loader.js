const { readdirSync } = require('fs');

self.commands = {}

console.log(`Loading commands...`);

readdirSync('./commands/').forEach(dirs => {
    const commands = readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

    for (const file of commands) {
        const command = require(`./commands/${dirs}/${file}`);
        console.log(`-> Loaded command ${command.name.toLowerCase()}`);
        self.commands[command.name.toLowerCase()] = command
        delete require.cache[require.resolve(`./commands/${dirs}/${file}`)];
    };
});