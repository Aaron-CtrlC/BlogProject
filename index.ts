import app from './src/app.js';
import { assertEnv } from './src/config/env.js';

import 'dotenv/config.js';

assertEnv();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
