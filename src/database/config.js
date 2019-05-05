let state = {
  floodControl: {
    users: [],
    limit: 10,
    window: 1 * 60 * 1000,
  },
};

module.exports = () => {
  function floodControlUser(userId, enable) {
    const userPositionInArray = state.floodControl.users.indexOf(userId);
    if (enable) {
      if (userPositionInArray >= 0) return;
      state.floodControl.users.push(userId);
    } else {
      if (userPositionInArray === -1) return;
      state.floodControl.users.splice(userPositionInArray, 1);
    }
  }

  function isUserInFloodControl(userId) {
    return state.floodControl.users.indexOf(userId) >= 0;
  }

  function getState() {
    return state;
  }

  function setState(newState) {
    state = newState;
  }

  return {
    floodControlUser,
    isUserInFloodControl,
    getState,
    setState,
  };
};
