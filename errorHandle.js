const headers = require('./corsHeaders.js');

function errorHandle(res) {
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      message: '欄位填寫錯誤，或無此待辦 id',
    })
  );
  res.end();
}

module.exports = errorHandle;
