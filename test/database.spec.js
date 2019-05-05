const assert = require('assert');

const FloodService = require('../src/services/floodService');

function buildState(limit, window) {
  return {
    flood: {
      users: [],
      messageStacks: {},
      config: {
        limit,
        window,
      },
    },
  };
}

describe('Database', () => {
  describe('Flood', () => {
    it('should accept a single message', () => {
      const sut = FloodService(buildState(10, 60), () => 1);
      assert.equal(sut.addMessageAndCheck(1), true);
    });

    it('should accept exactly the message limit', () => {
      const state = buildState(10, 60);
      const sut = FloodService(state, () => 1);
      for (let i = 0; i < state.flood.config.limit; i++) {
        assert.equal(sut.addMessageAndCheck(1), true);
      }
    });

    it('should accept exactly the message limit, then reject the next one', () => {
      const state = buildState(10, 60);
      const sut = FloodService(state, () => 1);
      for (let i = 0; i < state.flood.config.limit; i++) {
        assert.equal(sut.addMessageAndCheck(1), true);
      }
      assert.equal(sut.addMessageAndCheck(1), false);
    });

    it('should accept exactly the message limit (one), then reject the next one', () => {
      const state = buildState(1, 60);
      const sut = FloodService(state, () => 1);
      for (let i = 0; i < state.flood.config.limit; i++) {
        assert.equal(sut.addMessageAndCheck(1), true);
      }
      assert.equal(sut.addMessageAndCheck(1), false);
    });

    it('should accept exactly the message limit, reject the next one, and accept it once the window passed', () => {
      const state = buildState(10, 60);
      const sut = FloodService(state, () => 1);
      for (let i = 0; i < state.flood.config.limit; i++) {
        assert.equal(sut.addMessageAndCheck(1), true);
      }
      assert.equal(sut.addMessageAndCheck(1), false);
      const sut2 = FloodService(state, () => 61);
      assert.equal(sut2.addMessageAndCheck(1), true);
    });
  });
});
