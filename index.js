import app from './backend/server/app.js';
import 'dotenv/config'

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
