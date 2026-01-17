const dotenv = require("dotenv");
dotenv.config();

const connectDatabase = require("./config/db");
const app = require("./app");
const port = process.env.PORT || 3000;
connectDatabase();
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
