const dotenv = require("dotenv");
dotenv.config();

// HANDLING UNCAUGHT EXCEPTIONS
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
    process.exit(1);
});


const connectDatabase = require("./config/db");
const app = require("./app");
const port = process.env.PORT || 3000;
connectDatabase();
const server=app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});


// HANDLING UNCAUGHT EXCEPTIONS
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
    process.exit(1);
});

// Handling Unhandled rejections
process.on("unhandledRejection",(err)=>{
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(()=>{
    process.exit(1);
  })
})

