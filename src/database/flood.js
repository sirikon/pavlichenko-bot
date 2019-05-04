const RATE_LIMIT_MESSAGES = 10
const RATE_LIMIT_TIME = 1 * 60 * 1000 // One minute. In milliseconds.

const state = {
    users: {}
}

function ensureUser(userId) {
    if (!state.users[userId]) {
        state.users[userId] = [];
    }
}

function deleteOldMessages(userId) {
    const now = new Date().getTime();
    const userStack = state.users[userId];
    if (userStack.length === 0) return;
    let finished = false;
    let c = 0;
    while (!finished) {
        if (((now - userStack[c]) < RATE_LIMIT_TIME) || c === userStack.length - 1) {
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
    ensureUser(userId)
    deleteOldMessages(userId)
    const userStack = state.users[userId];

    if (userStack.length >= RATE_LIMIT_MESSAGES) {
        return false;
    }

    userStack.push(new Date().getTime())
    return true;
}

module.exports = {
    addMessageAndCheck
}
