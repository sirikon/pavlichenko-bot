/* eslint-disable no-param-reassign */
export default function messageBuilder(message?: any) {
	message = message || {
		chat: {},
		text: '',
		entities: [],
		from: {},
	};

	function text(textToExpect: string) {
		message.text = textToExpect;
		return messageBuilder(message);
	}

	function command(textToExpect: any) {
		message.text = textToExpect;
		message.entities.push({
			length: textToExpect.length,
			offset: 0,
			type: 'bot_command',
		});
		return messageBuilder(message);
	}

	function from(id: any) {
		message.from.id = id;
		return messageBuilder(message);
	}

	function group(id: any) {
		message.chat.type = 'group';
		message.chat.id = id;
		return messageBuilder(message);
	}

	function privateChat(id: any) {
		message.chat.type = 'private';
		message.chat.id = id;
		return messageBuilder(message);
	}

	function replyToUser(id: any) {
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
