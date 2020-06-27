const discord = require('discord.js');
const client = new discord.Client();

const token = 'NzI2MjcyNDg0ODAyMDM1ODIz.Xvd35g.I77fRxs4ZgUgZ-po0VdmO7Y6MgM';

client.on('ready', function() {

  console.log(`Logged in as ${client.user.tag}`);

  client.channels.cache.get('722870922653990994').send('hello');
});

client.on('message', function(message) {

  if (message.content == 'ping')
    message.reply('pong!');
});

client.login(token);
