// ===== SENSOR INPUT =====
function generateSensorData() {
  let speed = Math.floor(Math.random() * 80)
  let force

  if (speed > 60) {
    force = 3.5 + Math.random() * 1.5
  } else if (speed > 30) {
    force = 2 + Math.random() * 2
  } else if (speed > 10) {
    force = 1 + Math.random() * 1.5
  } else {
    force = Math.random() * 1.5
  }

  return {
    speed,
    force: parseFloat(force.toFixed(2)),
    orientationChange: Math.random(),
    vibration: Math.random()
  }
}

// ===== FEATURE EXTRACTION =====
function extractFeatures(data) {
  return {
    highImpact: data.force > 3.5,
    suddenStop: data.speed < 5,
    deviceTilted: data.orientationChange > 0.7,
    unstableMotion: data.vibration > 0.6
  }
}

// ===== DECISION ENGINE =====
function evaluateRisk(features) {
  let score = 0
  let reasons = []

  if (features.highImpact) {
    score += 40
    reasons.push("High impact detected")
  }

  if (features.suddenStop) {
    score += 25
    reasons.push("Sudden stop detected")
  }

  if (features.deviceTilted) {
    score += 20
    reasons.push("Device orientation changed")
  }

  if (features.unstableMotion) {
    score += 15
    reasons.push("Unstable motion detected")
  }

  let risk =
    score >= 70 ? "HIGH" :
    score >= 40 ? "MEDIUM" :
    "LOW"

  return { score, risk, reasons }
}

// ===== MAIN ENGINE =====
function processEmergency() {
  const data = generateSensorData()
  const features = extractFeatures(data)
  const result = evaluateRisk(features)

  return {
    data,
    features,
    ...result
  }
}

// ✅ EXPORT (IMPORTANT)
export { processEmergency }
