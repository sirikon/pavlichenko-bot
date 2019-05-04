let state = {
  users: {},
};

module.exports = (timeProvider, config) => {
  function ensureUser(userId) {
    if (!state.users[userId]) {
      state.users[userId] = [];
    }
  }

  function deleteOldMessages(userId) {
    const now = timeProvider();
    const userStack = state.users[userId];
    if (userStack.length === 0) return;
    let finished = false;
    let c = 0;
    while (!finished) {
      if (((now - userStack[c]) < config.window) || c === userStack.length - 1) {
        finished = true;
        continue;
      }
      c++;
    }
    userStack.splice(0, c);
  }

  // Returns true if the message is allowed
  // or false if the message should be removed, as it
  // exceeded the message rate limit.
  function addMessageAndCheck(userId) {
    ensureUser(userId);
    deleteOldMessages(userId);
    const userStack = state.users[userId];

    if (userStack.length >= config.limit) {
      return false;
    }

    userStack.push(timeProvider());
    return true;
  }

  function reset() {
    state = { users: [] };
  }

  return {
    addMessageAndCheck,
    reset,
  };
};
