const Telegraf = require('telegraf');
const floodDatabase = require('./database/flood');

module.exports = () => {
    const bot = new Telegraf(process.env.BOT_TOKEN)
    
    bot.catch((err) => {
        console.log('Ooops', err)
    })

    bot.start((ctx) => ctx.reply('Welcome'))

    bot.help((ctx) => ctx.reply('You make me laugh. Go to gulag.'))

    bot.command('flood', (ctx) => {
        ctx.telegram.getChatAdministrators(ctx.chat.id)
            .then((admins) => {
                if 
            });
    });

    bot.on('message', (ctx) => {
        if (ctx.message.from.is_bot) return;
        if (floodDatabase.addMessageAndCheck(ctx.message.from.id)) return;
        return ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
    });

    bot.launch()
        .then(() => {
            console.log('Running')
        }, (err) => {
            console.log(err);
        });
}
