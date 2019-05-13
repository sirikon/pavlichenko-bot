/* eslint-disable no-param-reassign */
function messageBuilder(message) {
  message = message || {
    chat: {},
    text: '',
    entities: [],
    from: {},
  };

  function text(_text) {
    message.text = _text;
    return messageBuilder(message);
  }

  function command(_text) {
    message.text = _text;
    message.entities.push({
      length: _text.length,
      offset: 0,
      type: 'bot_command',
    });
    return messageBuilder(message);
  }

  function from(id) {
    message.from.id = id;
    return messageBuilder(message);
  }

  function group(id) {
    message.chat.type = 'group';
    message.chat.id = id;
    return messageBuilder(message);
  }

  function privateChat(id) {
    message.chat.type = 'private';
    message.chat.id = id;
    return messageBuilder(message);
  }

  function replyToUser(id) {
    message.reply_to_message = {
      from: {
        id,
      },
    };
    return messageBuilder(message);
  }

  function build() {
    return message;
  }

  return {
    from,
    command,
    group,
    privateChat,
    replyToUser,
    text,
    build,
  };
}

module.exports = messageBuilder;
