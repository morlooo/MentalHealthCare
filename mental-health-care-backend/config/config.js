var dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const corsOptions = {
  origin: process.env.CLIENT_APP_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = {
  corsOptions,
};
