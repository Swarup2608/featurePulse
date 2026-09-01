import app from "./app.js";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 FeaturePulse API running on port ${PORT}`);
}); 