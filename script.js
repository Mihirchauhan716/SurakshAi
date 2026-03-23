document.addEventListener("DOMContentLoaded", function() {

  let demoButton = document.getElementById("demoButton")
  let demoOverlay = document.getElementById("demoOverlay")
  let demoCloseBtn = document.getElementById("demoCloseBtn")
  let currentStep = 1
  let autoTimer = null
  let etaInterval = null

  // CLOSE
  demoCloseBtn.addEventListener("click", function() {
    closeDemo()
  })

  function closeDemo() {
    demoOverlay.style.display = "none"
    clearTimeout(autoTimer)
    clearInterval(etaInterval)
    goToStep(1)
  }

  // SHOW STEP
  function goToStep(step) {
  currentStep = step

  document.querySelectorAll(".phone-screen").forEach(function(s) {
    s.classList.add("hidden")
  })
  document.querySelectorAll(".step-info").forEach(function(s) {
    s.classList.add("hidden")
  })
  document.querySelectorAll(".dot").forEach(function(d, i) {
    d.classList.remove("active")
    if (i + 1 === step) d.classList.add("active")
  })

  let phoneEl = document.getElementById("phoneStep" + step)
  let infoEl = document.getElementById("infoStep" + step)
  if (phoneEl) phoneEl.classList.remove("hidden")
  if (infoEl) infoEl.classList.remove("hidden")

  document.getElementById("demoStepIndicator").textContent = "Step " + step + " of 5"

  // animate points one by one
  if (infoEl) {
    let points = infoEl.querySelectorAll(".step-point")
    points.forEach(function(p) {
      p.classList.remove("active-point")
    })
    points.forEach(function(p, i) {
      setTimeout(function() {
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
    etaInterval = setInterval(function() {
      seconds--
      let min = Math.floor(seconds / 60)
      let sec = seconds % 60
      let el = document.getElementById("phoneEta")
      if (el) el.textContent = min + ":" + (sec < 10 ? "0" + sec : sec)
      if (seconds <= 0) clearInterval(etaInterval)
    }, 1000)
  }

  function autoAdvance() {
  autoTimer = setTimeout(function() {
    if (currentStep < 5) {
      goToStep(currentStep + 1)
      autoAdvance()
    } else {
      setTimeout(function() {
        closeDemo()
      }, 8000)
    }
  }, 9000)  // 9 seconds per step
}

  demoButton.addEventListener("click", function() {

    // SCREEN FLASH
    document.body.style.backgroundColor = "#ff0000"
    setTimeout(function() { document.body.style.backgroundColor = "#080808" }, 150)
    setTimeout(function() { document.body.style.backgroundColor = "#ff0000" }, 300)
    setTimeout(function() { document.body.style.backgroundColor = "#080808" }, 450)
    setTimeout(function() { document.body.style.backgroundColor = "#ff0000" }, 600)
    setTimeout(function() { document.body.style.backgroundColor = "#080808" }, 750)

    setTimeout(function() {
      goToStep(1)
      demoOverlay.style.display = "flex"
      autoAdvance()
    }, 300)
  })
})
// ── HIDE EMERGENCY BANNER BY DEFAULT ──
document.getElementById("emergencyBanner").style.display = "none"

// ── SCROLL ANIMATIONS ──
const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
}

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")
    }
  })
}, observerOptions)

// observe all animatable elements
document.querySelectorAll(".alarm-card, .step-card, .feature-card, .section").forEach(function(el) {
  el.classList.add("animate-on-scroll")
  observer.observe(el)
})

// ── COUNTER ANIMATION ──
function animateCounter(el, target, suffix) {
  let start = 0
  let duration = 800
  let increment = target / (duration / 16)
  let timer = setInterval(function() {
    start += increment
    if (start >= target) {
      start = target
      clearInterval(timer)
    }
    el.textContent = Math.floor(start) + suffix
  }, 16)
}

const counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      let el = entry.target
      let target = parseFloat(el.getAttribute("data-target"))
      let suffix = el.getAttribute("data-suffix") || ""
      animateCounter(el, target, suffix)
      counterObserver.unobserve(el)
    }
  })
}, { threshold: 0.5 })

document.querySelectorAll(".number[data-target]").forEach(function(el) {
  counterObserver.observe(el)
})
// ── NAVBAR SCROLL EFFECT ──
window.addEventListener("scroll", function() {
  let nav = document.querySelector("nav")
  if (window.scrollY > 50) {
    nav.classList.add("scrolled")
  } else {
    nav.classList.remove("scrolled")
  }
}}
// frontend ends