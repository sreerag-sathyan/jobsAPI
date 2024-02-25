require("dotenv").config({ path: "./config.env" });
require("express-async-errors");
const express = require("express");
const app = express();
const helmet = require("helmet");
const ratelimit = require("express-rate-limit");
const xss = require("xss-clean");
const cors = require("cors");

const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const connectDB = require("./db/connect");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const auth = require("./middleware/authentication");

connectDB(process.env.MONGO_URL)
  .then(() => console.log("Mongo Server started"))
  .catch(() => console.log("MongoError"));

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// extra packages

// routes

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", auth, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
