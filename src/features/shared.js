async function senderIsAdmin(ctx) {
  const admins = await ctx.telegram.getChatAdministrators(ctx.chat.id);
  return admins
    .filter(a => a.user.id === ctx.message.from.id)
    .length > 0;
}

module.exports = {
  senderIsAdmin,
};
