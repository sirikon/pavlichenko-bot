class MockBot {
  constructor() {
    this.commands = {};
    this.eventHandlers = {};
  }

  command(name, callback) {
    this.commands[name] = callback;
  }

  runCommand(name, ctx) {
    return this.commands[name](ctx);
  }

  on(event, callback) {
    this.eventHandlers[event] = callback;
  }
}

module.exports = MockBot;
