module.exports = (rootState, timeProvider) => {
  function getState() {
    if (!rootState.flood) {
      // eslint-disable-next-line no-param-reassign
      rootState.flood = {
        users: [],
        messageStacks: {},
        config: {
          limit: 10,
          window: 1 * 60 * 1000, // One minute
        },
      };
    }
    return rootState.flood;
  }

  function getUserMessageStack(userId) {
    const state = getState();
    if (!state.messageStacks[userId]) {
      state.messageStacks[userId] = [];
    }
    return state.messageStacks[userId] || [];
  }

  function deleteOutOfWindowMessagesFromUserStack(userId) {
    const state = getState();
    const now = timeProvider();
    const userStack = getUserMessageStack(userId);

    let finished = false;
    let c = 0;
    while (!finished) {
      if (((now - userStack[c]) < state.config.window) || c === userStack.length) {
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
    const state = getState();
    deleteOutOfWindowMessagesFromUserStack(userId);
    const userStack = getUserMessageStack(userId);

    if (userStack.length >= state.config.limit) {
      return false;
    }

    userStack.push(timeProvider());
    return true;
  }

  function flagUserAsFlooder(userId, enable) {
    const state = getState();
    const userPositionInArray = state.users.indexOf(userId);
    if (enable) {
      if (userPositionInArray >= 0) return;
      state.users.push(userId);
    } else {
      if (userPositionInArray === -1) return;
      state.users.splice(userPositionInArray, 1);
    }
  }

  function isUserFlooder(userId) {
    const state = getState();
    return state.users.indexOf(userId) >= 0;
  }

  function getStatus() {
    const state = getState();
    const result = {};
    state.users.forEach((userId) => {
      deleteOutOfWindowMessagesFromUserStack(userId);
      result[userId] = `${getUserMessageStack(userId).length}/${state.config.limit}`;
    });
    return result;
  }

  return {
    addMessageAndCheck,
    flagUserAsFlooder,
    isUserFlooder,
    getStatus,
  };
};
