// const assert = require('assert');

// const floodDatabase = require('../src/database/flood');

// const databaseConfig = {
//   limit: 10,
//   window: 60,
// };

// describe('Database', () => {
//   describe('Flood', () => {
//     beforeEach(() => floodDatabase(() => 1, databaseConfig).reset());

//     it('should accept a single message', () => {
//       const db = floodDatabase(() => 1, databaseConfig);
//       assert.equal(db.addMessageAndCheck(1), true);
//     });

//     it('should accept exactly the message limit', () => {
//       const db = floodDatabase(() => 1, databaseConfig);
//       for (let i = 0; i < databaseConfig.limit; i++) {
//         assert.equal(db.addMessageAndCheck(1), true);
//       }
//     });

//     it('should accept exactly the message limit, then reject the next one', () => {
//       const db = floodDatabase(() => 1, databaseConfig);
//       for (let i = 0; i < databaseConfig.limit; i++) {
//         assert.equal(db.addMessageAndCheck(1), true);
//       }
//       assert.equal(db.addMessageAndCheck(1), false);
//     });

//     it('should accept exactly the message limit (one), then reject the next one', () => {
//       const internalConfig = { limit: 1, window: 60 };
//       const db = floodDatabase(() => 1, internalConfig);
//       for (let i = 0; i < internalConfig.limit; i++) {
//         assert.equal(db.addMessageAndCheck(1), true);
//       }
//       assert.equal(db.addMessageAndCheck(1), false);
//     });

//     it('should accept exactly the message limit, reject the next one, and accept it once the window passed', () => {
//       const db = floodDatabase(() => 1, databaseConfig);
//       for (let i = 0; i < databaseConfig.limit; i++) {
//         assert.equal(db.addMessageAndCheck(1), true);
//       }
//       assert.equal(db.addMessageAndCheck(1), false);
//       const db2 = floodDatabase(() => 61, databaseConfig);
//       assert.equal(db2.addMessageAndCheck(1), true);
//     });
//   });
// });
