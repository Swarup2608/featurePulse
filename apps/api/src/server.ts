import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const PORT = process.env.PORT || 8000;

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 FeaturePulse API running on port ${PORT}`);
  });
};

startServer();