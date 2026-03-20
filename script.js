function calculateETA(distance) {
  let eta = distance / 60
  return eta
}

let time = calculateETA(30)
console.log(`Ambulance arrives in ${time} minutes`)