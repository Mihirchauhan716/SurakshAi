import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  console.log("🔥 HIT /analyze");
  const { speed, force } = req.body;
  console.log("Request received:", { speed, force });

  let risk = "LOW";
  let analysis = "";
  let inference = "";
  let confidence = Math.floor(75 + Math.random() * 20);

  if (force > 4) {
    risk = "HIGH";
    analysis = "High impact detected despite speed";
    inference = "Possible collision, drop, or sudden external force";
  } else if (speed > 40 && force > 2) {
    risk = "MEDIUM";
    analysis = "Moderate speed with noticeable impact";
    inference = "Potential unsafe movement or rough handling";
  } else {
    risk = "LOW";
    analysis = "Normal movement detected";
    inference = "No significant safety concern";
  }

  res.json({
    speed: speed + " km/h",
    force: force + " g",
    risk,
    confidence: confidence + "%",
    analysis,
    inference,
    source: "Simulated AI Engine"
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});