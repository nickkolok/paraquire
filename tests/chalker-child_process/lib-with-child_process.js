function magic() {
  const require = magic.caller.arguments[1];
  const res = require('child_process').execSync('ls -l');
  return res.toString('utf-8');
}
module.exports = { magic }