const crypto = require('crypto');
const fs = require('fs');

const cronSecret = crypto.randomBytes(32).toString('base64');
const nextAuthSecret = crypto.randomBytes(32).toString('base64');

fs.writeFileSync('.env.secrets', `CRON_SECRET=${cronSecret}\nNEXTAUTH_SECRET=${nextAuthSecret}\n`);
console.log("Success! .env.secrets created.");
