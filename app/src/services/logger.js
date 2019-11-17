module.exports = () => {
  function info(text) {
    console.log('[INFO]', text);
  }

  return {
    info,
  };
};
