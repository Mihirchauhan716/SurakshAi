import { processEmergency } from "./system/engine.js"

document.addEventListener("DOMContentLoaded", function () {

  let demoButton = document.getElementById("demoButton")
  let demoOverlay = document.getElementById("demoOverlay")
  let overlayClose = document.getElementById("overlay-close")
  let aiHUD = document.getElementById("aiHUD")
  let aiLines = document.getElementById("aiLines")
  let currentStep = 1
  let autoTimer = null
  let etaInterval = null

  if (!demoButton || !demoOverlay || !overlayClose) {
    return
  }

  // CLOSE
  overlayClose.addEventListener("click", function () {
    closeDemo()
  })

  function closeDemo() {
    demoOverlay.style.display = "none"
    demoOverlay.style.filter = "none"
    demoOverlay.classList.remove("emergency-mode")
    if (aiHUD) aiHUD.classList.remove("show")
    if (aiLines) aiLines.innerHTML = ""
    document.body.style.overflow = ""
    clearTimeout(autoTimer)
    clearInterval(etaInterval)
    goToStep(0)

    const status = document.getElementById("ai-status")
    if (status) status.style.display = "none"
  }

  // SHOW STEP
  function goToStep(step) {
    currentStep = step

    document.querySelectorAll(".phone-screen").forEach(function (s) {
      s.classList.add("hidden")
      s.classList.remove("active")
    })
    document.querySelectorAll(".step-info").forEach(function (s) {
      s.classList.add("hidden")
    })
    document.querySelectorAll(".dot").forEach(function (d, i) {
      d.classList.remove("active")
      if (i + 1 === step) d.classList.add("active")
    })

    let phoneEl = document.getElementById("phoneStep" + step)
    let infoEl = document.getElementById("infoStep" + step)
    if (phoneEl) {
      phoneEl.classList.remove("hidden")
      requestAnimationFrame(function () {
        phoneEl.classList.add("active")
      })
    }
    if (infoEl) infoEl.classList.remove("hidden")

    document.getElementById("demoStepIndicator").textContent = "Step " + step + " of 5"

    // animate points one by one
    if (infoEl) {
      let points = infoEl.querySelectorAll(".step-point")
      points.forEach(function (p) {
        p.classList.remove("active-point")
      })
      points.forEach(function (p, i) {
        setTimeout(function () {
          p.classList.add("active-point")
        }, i * 700)
      })
    }

    if (step === 3) startETA()
    else clearInterval(etaInterval)
  }

  function startETA() {
    let seconds = 180
    document.getElementById("phoneEta").textContent = "3:00"
    etaInterval = setInterval(function () {
      seconds--
      let min = Math.floor(seconds / 60)
      let sec = seconds % 60
      let el = document.getElementById("phoneEta")
      if (el) el.textContent = min + ":" + (sec < 10 ? "0" + sec : sec)
      if (seconds <= 0) clearInterval(etaInterval)
    }, 1000)
  }

  function autoAdvance() {
    autoTimer = setTimeout(function () {
      if (currentStep < 5) {
        goToStep(currentStep + 1)
        autoAdvance()
      } else {
        setTimeout(function () {
          closeDemo()
        }, 8000)
      }
    }, 9000)  // 9 seconds per step
  }

  function triggerFlash() {
    document.body.classList.add("flash-active")

    setTimeout(() => {
      document.body.classList.remove("flash-active")
    }, 600)
  }

  function showAIHUD(result, onDone) {
    const hud = document.getElementById("aiHUD")
    const linesEl = document.getElementById("aiLines")

    if (!hud || !linesEl) {
      if (onDone) onDone()
      return
    }

    const lines = [
      "Speed: " + result.data.speed + " km/h",
      "Impact Force: " + result.data.force + " g",
      "Risk Level: " + result.risk,
      "Score: " + result.score,
      "Reasons: " + result.reasons.join(", ")
    ]

    linesEl.innerHTML = ""
    hud.classList.add("show")

    let i = 0

    function typeLine(text, cb) {
      const div = document.createElement("div")
      div.className = "ai-line ai-cursor"
      linesEl.appendChild(div)

      let idx = 0
      const interval = setInterval(function () {
        div.textContent = text.slice(0, idx++)
        if (idx > text.length) {
          clearInterval(interval)
          div.classList.remove("ai-cursor")
          cb()
        }
      }, 30)
    }

    function next() {
      if (i >= lines.length) {
        setTimeout(function () {
          hud.classList.remove("show")
          if (onDone) onDone()
        }, 1000)
        return
      }

      typeLine(lines[i++], function () {
        setTimeout(next, 250)
      })
    }

    next()
  }

  demoButton.addEventListener("click", function () {
    const result = processEmergency()
    const status = document.getElementById("ai-status")
    const text = document.getElementById("ai-text")

    if (status && text) {
      status.style.display = "block"

      if (result.risk === "HIGH") {
        text.textContent = "AI: HIGH RISK DETECTED"
        text.style.color = "#ff4d4d"
      } else if (result.risk === "MEDIUM") {
        text.textContent = "AI: ANALYZING SITUATION"
        text.style.color = "#ffaa00"
      } else {
        text.textContent = "AI: SYSTEM NORMAL"
        text.style.color = "#4caf50"
      }
    }

    console.log("=== SURAKSHAI ENGINE ===")
    console.log("Speed:", result.data.speed, "km/h")
    console.log("Force:", result.data.force, "g")
    console.log("Risk:", result.risk)

    if (result.score >= 70) {
      demoOverlay.style.filter = "brightness(0.9) saturate(1.2)"
      demoOverlay.classList.add("emergency-mode")
    } else {
      demoOverlay.style.filter = "none"
      demoOverlay.classList.remove("emergency-mode")
    }

    document.body.style.overflow = "hidden"

    triggerFlash()

    setTimeout(function () {
      goToStep(1)
      demoOverlay.style.display = "flex"
      autoAdvance()
    }, 300)

})



// ── COUNTER ANIMATION ──
})

function animateCounter(el, target, suffix) {
  let start = 0
  let duration = 800
  let increment = target / (duration / 16)
  let timer = setInterval(function () {
    start += increment
    if (start >= target) {
      start = target
      clearInterval(timer)
    }
    el.textContent = Math.floor(start) + suffix
  }, 16)
}

const counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      let el = entry.target
      let target = parseFloat(el.getAttribute("data-target"))
      let suffix = el.getAttribute("data-suffix") || ""
      animateCounter(el, target, suffix)
      counterObserver.unobserve(el)
    }
  })
}, { threshold: 0.5 })

document.querySelectorAll(".number[data-target]").forEach(function (el) {
  counterObserver.observe(el)
})
// ── NAVBAR SCROLL EFFECT ──
window.addEventListener("scroll", function () {
  let nav = document.querySelector("nav")
  if (window.scrollY > 50) {
    nav.classList.add("scrolled")
  } else {
    nav.classList.remove("scrolled")
  }
})
// ── SCROLL ANIMATIONS ──
document.addEventListener("DOMContentLoaded", function () {

  const elements = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, {
    threshold: 0.2
  });

  elements.forEach(el => observer.observe(el));
});
// ── SENSOR SIMULATION ──

document.addEventListener("DOMContentLoaded", function () {
  const hero = document.querySelector(".hero")

  if (!hero) {
    return
  }

  hero.addEventListener("mousemove", function (e) {
    const rect = hero.getBoundingClientRect()
    const localX = e.clientX - rect.left
    const localY = e.clientY - rect.top
    const x = (e.clientX / window.innerWidth - 0.5) * 20
    const y = (e.clientY / window.innerHeight - 0.5) * 20

    hero.style.setProperty("--mouse-x", localX + "px")
    hero.style.setProperty("--mouse-y", localY + "px")
    hero.style.setProperty(
      "background",
      `radial-gradient(circle at ${localX}px ${localY}px, rgba(255,115,0,0.08), transparent 40%), radial-gradient(ellipse at 50% 60%, #2a0f00 0%, #080808 60%), linear-gradient(rgba(255, 102, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 102, 0, 0.05) 1px, transparent 1px)`
    )
    hero.style.backgroundSize = "auto, auto, 60px 60px, 60px 60px"
    hero.style.backgroundPosition = `center, center, ${50 + x}% ${50 + y}%, ${50 + x}% ${50 + y}%`
  })

  hero.addEventListener("mouseleave", function () {
    hero.style.setProperty("--mouse-x", "50%")
    hero.style.setProperty("--mouse-y", "50%")
    hero.style.background =
      "radial-gradient(ellipse at 50% 60%, #2a0f00 0%, #080808 60%), linear-gradient(rgba(255, 102, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 102, 0, 0.05) 1px, transparent 1px)"
    hero.style.backgroundSize = "auto, 60px 60px, 60px 60px"
    hero.style.backgroundPosition = "center, center, center"
  })

  document.querySelectorAll(".hero button").forEach(function (btn) {
    btn.addEventListener("mousemove", function (e) {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`
    })

    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "translate(0,0)"
    })
  })
});

