document.addEventListener("DOMContentLoaded", function() {

  let demoButton = document.getElementById("demoButton")
  let demoOverlay = document.getElementById("demoOverlay")

  function hideAllSteps() {
    document.querySelectorAll(".demo-step").forEach(function(step) {
      step.style.display = "none"
      step.style.opacity = "0"
    })
  }

  function showStep(stepId, callback) {
    hideAllSteps()
    let step = document.getElementById(stepId)
    step.style.display = "block"

    let opacity = 0
    let fade = setInterval(function() {
      opacity += 0.02
      step.style.opacity = opacity
      if (opacity >= 1) clearInterval(fade)
    }, 30)

    if (callback) setTimeout(callback, 6000)
  }

  demoButton.addEventListener("click", function() {

    // SCREEN FLASH RED
    document.body.style.backgroundColor = "#ff0000"
    setTimeout(function() { document.body.style.backgroundColor = "#080808" }, 150)
    setTimeout(function() { document.body.style.backgroundColor = "#ff0000" }, 300)
    setTimeout(function() { document.body.style.backgroundColor = "#080808" }, 450)
    setTimeout(function() { document.body.style.backgroundColor = "#ff0000" }, 600)
    setTimeout(function() { document.body.style.backgroundColor = "#080808" }, 750)

    setTimeout(function() {
      demoOverlay.style.display = "flex"
      hideAllSteps()

      // Step 1 — Accident Detected
      showStep("demoStep1", function() {

        // Step 2 — Finding Ambulance
        showStep("demoStep2", function() {
          setTimeout(function() {
            document.getElementById("ambulancePin").style.left = "45%"
            document.getElementById("ambulancePin").style.top = "55%"
          }, 500)
          setTimeout(function() {
            document.getElementById("etaText").textContent = "Ambulance Found — ETA 3 Minutes"
          }, 3000)

          // Step 3 — Hospital
          setTimeout(function() {
            showStep("demoStep3", function() {

              // Step 4 — Family
              showStep("demoStep4", function() {

                // Step 5 — Response Time
                showStep("demoStep5", function() {
                  setTimeout(function() {
                    demoOverlay.style.display = "none"
                    document.getElementById("ambulancePin").style.left = "20px"
                    document.getElementById("ambulancePin").style.top = "20px"
                    document.getElementById("etaText").textContent = "Calculating ETA..."
                  }, 4000)
                })
              })
            })
          }, 4000)
        })
      })
    }, 900)
  })
})