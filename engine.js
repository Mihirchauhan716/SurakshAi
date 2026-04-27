function generateDemoSensorData() {
  return {
    speed: 2,
    force: 4.5,
    tilt: 0.9,
    vibration: 0.8
  }
}

function getPrediction(data) {
  const weights = {
    speed: 0.2,
    force: 0.4,
    tilt: 0.2,
    vibration: 0.2
  }

  const safeData = {
    speed: Number(data?.speed) || 0,
    force: Number(data?.force) || 0,
    tilt: Number(data?.tilt) || 0,
    vibration: Number(data?.vibration) || 0
  }

  const score =
    safeData.speed * weights.speed +
    safeData.force * weights.force +
    safeData.tilt * weights.tilt +
    safeData.vibration * weights.vibration

  let risk = "LOW"
  if (score > 3.5) risk = "HIGH"
  else if (score > 2) risk = "MEDIUM"

  if (
    safeData.force >= 4.5 &&
    safeData.tilt >= 0.9 &&
    safeData.vibration >= 0.8
  ) {
    risk = "HIGH"
  }

  const confidence =
    risk === "HIGH"
      ? Math.max(82, Math.min(95, Math.round(score * 20)))
      : Math.min(95, Math.round(score * 20))

  return {
    risk,
    confidence,
    source: "ML Model (Simulated)",
    data: safeData,
    score: Number(score.toFixed(2))
  }
}

window.generateDemoSensorData = generateDemoSensorData
window.getPrediction = getPrediction
