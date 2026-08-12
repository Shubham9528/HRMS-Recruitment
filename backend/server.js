import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import env from "./src/config/env.js";

const startServer = async () => {
  // 1. Connect to database
  await connectDB();

  // 2. Start the Express server
  app.listen(env.PORT, () => {
    console.log(
      `Server is running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`,
    );
  });
};

startServer();
