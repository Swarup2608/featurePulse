import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env"

const PORT = env.PORT;


const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`FeaturePulse API running on port ${PORT}`);
  });
};

startServer();