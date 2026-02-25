export default function handler(req, res) {
  const fs = require('fs');
  const path = require('path');
  
  const logPath = path.join('/tmp', 'usage.log');
  fs.appendFileSync(logPath, `Access at ${new Date().toISOString()}\n`);

  res.status(200).json({ status: 'Logged' });
}
