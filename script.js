const root = document.documentElement;
const body = document.body;
const header = document.querySelector("#siteHeader");
const themeToggle = document.querySelector("#themeToggle");
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
const particleLayer = document.querySelector("#particleLayer");
const currentYear = document.querySelector("#currentYear");

if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let prefersReducedMotion = motionPreference.matches;
const desktopViewport = window.matchMedia("(min-width: 769px)");

const socialIconMarkup = {
  GitHub: '<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82a9.5 9.5 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
  Bilibili: '<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="m8 3 2 3m6-3-2 3M5 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm3 5v3m8-3v3"/></svg>',
  Email: '<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2 8 6 8-6"/></svg>',
};

document.querySelectorAll(".hero-links a").forEach((link) => {
  const label = link.textContent.trim();
  const icon = socialIconMarkup[label];
  if (icon) link.insertAdjacentHTML("afterbegin", icon);
  link.classList.add("hero-social-link");

  if (/^https?:/i.test(link.href)) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
});

const hero = document.querySelector(".hero");
const highlights = document.querySelector("#highlights");

if (hero) {
  const lineLengths = [118, 246, 168, 312, 214, 286, 142, 258, 190, 318];
  const lineGroup = document.createElement("div");
  lineGroup.className = "hero-lines";
  lineGroup.setAttribute("aria-hidden", "true");

  const renderHeroLines = () => {
    lineGroup.replaceChildren();
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const configuredCount = Number.parseInt(getComputedStyle(root).getPropertyValue("--hero-line-count"), 10) || lineLengths.length;
    const count = Math.min(configuredCount, lineLengths.length);

    lineLengths.slice(0, count).forEach((length) => {
      const line = document.createElement("span");
      line.className = "hero-line";
      line.style.setProperty("--line-height", `${mobile ? Math.min(length, 140) : length}px`);
      lineGroup.appendChild(line);
    });
  };

  renderHeroLines();
  hero.prepend(lineGroup);
  window.matchMedia("(max-width: 768px)").addEventListener?.("change", renderHeroLines);

  if (highlights) {
    const scrollCue = document.createElement("button");
    scrollCue.className = "scroll-cue";
    scrollCue.type = "button";
    scrollCue.setAttribute("aria-label", "向下滚动到个人亮点");
    scrollCue.title = "向下滚动";
    scrollCue.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6"/></svg>';
    scrollCue.addEventListener("click", () => {
      highlights.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    });
    hero.appendChild(scrollCue);

    window.setInterval(() => {
      if (prefersReducedMotion || scrollCue.classList.contains("is-hidden")) return;
      scrollCue.classList.add("is-bobbing");
      window.setTimeout(() => scrollCue.classList.remove("is-bobbing"), 300);
    }, 2000);

    if ("IntersectionObserver" in window) {
      const heroObserver = new IntersectionObserver(
        ([entry]) => scrollCue.classList.toggle("is-hidden", !entry.isIntersecting),
        { threshold: 0.2 }
      );
      heroObserver.observe(hero);
    } else {
      window.addEventListener("scroll", () => {
        scrollCue.classList.toggle("is-hidden", window.scrollY > hero.offsetHeight * 0.55);
      }, { passive: true });
    }
  }
}

const readStoredTheme = () => {
  try {
    return localStorage.getItem("resume-theme");
  } catch {
    return null;
  }
};

const storeTheme = (theme) => {
  try {
    localStorage.setItem("resume-theme", theme);
  } catch {
    // Theme switching still works when storage is unavailable.
  }
};

const savedTheme = readStoredTheme();
if (savedTheme === "dark" || savedTheme === "light") {
  root.dataset.theme = savedTheme;
}

const updateThemeButton = () => {
  const isDark = root.dataset.theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "切换为浅色主题" : "切换为深色主题");
};

updateThemeButton();

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  storeTheme(nextTheme);
  updateThemeButton();
});

const closeMenu = () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "打开导航菜单");
};

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "关闭导航菜单" : "打开导航菜单");
});

document.addEventListener("click", (event) => {
  if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !mainNav.classList.contains("open")) return;
  closeMenu();
  menuToggle.focus();
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    closeMenu();
  });
});

document.querySelectorAll('a[href="#top"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    closeMenu();
  });
});

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

let ambientFrame = 0;
const updateAmbientBackground = () => {
  ambientFrame = 0;

  if (prefersReducedMotion || !desktopViewport.matches) {
    root.style.removeProperty("--background-shift");
    return;
  }

  const offset = Math.min(window.scrollY * 0.025, 72);
  root.style.setProperty("--background-shift", `${offset}px`);
};

const requestAmbientBackgroundUpdate = () => {
  if (ambientFrame) return;
  ambientFrame = window.requestAnimationFrame(updateAmbientBackground);
};

updateAmbientBackground();
window.addEventListener("scroll", requestAmbientBackgroundUpdate, { passive: true });
desktopViewport.addEventListener?.("change", (event) => {
  updateAmbientBackground();
  if (event.matches) closeMenu();
});

body.classList.add("motion-ready");
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        const matchesSection = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("active", matchesSection);
        if (matchesSection) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    {
      rootMargin: "-24% 0px -62% 0px",
      threshold: [0.05, 0.2, 0.5],
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

document.querySelectorAll(".meter").forEach((meter) => {
  const replay = () => {
    meter.classList.remove("replay");
    void meter.offsetWidth;
    meter.classList.add("replay");
  };

  meter.addEventListener("click", replay);
  meter.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      replay();
    }
  });
  meter.addEventListener("animationend", () => meter.classList.remove("replay"));
});

const copyTextWithFallback = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    textArea.remove();
  }

  if (!copied) throw new Error("Clipboard is unavailable");
  return true;
};

document.querySelectorAll(".copy-button").forEach((button) => {
  let feedbackTimer;
  const originalLabel = button.getAttribute("aria-label") || "复制联系方式";

  button.addEventListener("click", async () => {
    clearTimeout(feedbackTimer);
    button.classList.remove("is-error");

    try {
      await copyTextWithFallback(button.dataset.copy);
      button.classList.add("is-copied");
      button.textContent = "已复制 ✓";
      button.setAttribute("aria-label", `已复制${button.dataset.copy}`);
    } catch {
      button.classList.add("is-error");
      button.textContent = "复制失败";
      button.setAttribute("aria-label", "复制失败，请手动复制");
    }

    feedbackTimer = window.setTimeout(() => {
      button.classList.remove("is-copied", "is-error");
      button.textContent = "复制";
      button.setAttribute("aria-label", originalLabel);
    }, 2000);
  });
});

const particleMotion = {
  pointerX: 0,
  pointerY: 0,
  scrollY: window.scrollY,
};
let interactiveParticles = [];
let particleFrame = 0;

window.addEventListener(
  "pointermove",
  (event) => {
    if (prefersReducedMotion || !desktopViewport.matches) return;
    particleMotion.pointerX = event.clientX / window.innerWidth - 0.5;
    particleMotion.pointerY = event.clientY / window.innerHeight - 0.5;
  },
  { passive: true }
);

window.addEventListener(
  "scroll",
  () => {
    particleMotion.scrollY = window.scrollY;
  },
  { passive: true }
);

const initializeParticles = () => {
  if (!particleLayer) return;

  if (particleFrame) {
    window.cancelAnimationFrame(particleFrame);
    particleFrame = 0;
  }
  particleLayer.replaceChildren();
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const particleCount = isMobile ? 36 : 72;
  const particles = [];

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    const x = 4 + Math.random() * 92;
    const y = 5 + Math.random() * 90;
    const size = 3.2 + Math.random() * 2.6;
    particle.className = `particle${index % 7 === 0 ? " brand-particle" : ""}`;
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.dataset.phase = String(Math.random() * Math.PI * 2);
    particle.dataset.depth = String(0.45 + (index % 7) * 0.08);
    particle.addEventListener("click", (event) => {
      event.stopPropagation();
      createParticleRipple(event.clientX, event.clientY);
    });
    particleLayer.appendChild(particle);
    particles.push(particle);
  }

  interactiveParticles = particles;
  startParticleAnimation();
};

const animateParticles = (time) => {
  particleFrame = 0;
  if (document.hidden || prefersReducedMotion || !desktopViewport.matches) return;

  interactiveParticles.forEach((particle) => {
    const phase = Number(particle.dataset.phase);
    const depth = Number(particle.dataset.depth);
    const driftX = Math.sin(time * 0.00026 + phase) * 3.2 + particleMotion.pointerX * 8 * depth;
    const scrollDrift = Math.sin(particleMotion.scrollY * 0.008 + phase) * 2.2 * depth;
    const driftY = Math.cos(time * 0.00022 + phase) * 3.2 + particleMotion.pointerY * 8 * depth + scrollDrift;
    particle.style.transform = `translate3d(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px), 0)`;
  });

  particleFrame = window.requestAnimationFrame(animateParticles);
};

function startParticleAnimation() {
  if (document.hidden || prefersReducedMotion || !desktopViewport.matches || particleFrame) return;
  particleFrame = window.requestAnimationFrame(animateParticles);
}

const createParticleRipple = (x, y) => {
  if (prefersReducedMotion || !desktopViewport.matches) return;
  const ripple = document.createElement("span");
  ripple.className = "particle-ripple";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  particleLayer.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
};

document.addEventListener("click", (event) => {
  if (prefersReducedMotion || !desktopViewport.matches) return;
  if (event.target.closest("a, button, input, textarea, select")) return;

  const hitParticle = interactiveParticles.some((particle) => {
    const bounds = particle.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;
    return distanceX * distanceX + distanceY * distanceY <= 12 * 12;
  });

  if (hitParticle) createParticleRipple(event.clientX, event.clientY);
});

initializeParticles();
const particleViewport = window.matchMedia("(max-width: 768px)");
particleViewport.addEventListener?.("change", initializeParticles);
motionPreference.addEventListener?.("change", (event) => {
  prefersReducedMotion = event.matches;
  document.querySelector(".scroll-cue")?.classList.remove("is-bobbing");
  updateAmbientBackground();
  initializeParticles();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && particleFrame) {
    window.cancelAnimationFrame(particleFrame);
    particleFrame = 0;
  } else {
    startParticleAnimation();
  }
});

document.querySelectorAll(".project-image img").forEach((image) => {
  const imageBox = image.closest(".project-image");

  const showFallback = () => {
    imageBox.classList.add("image-missing");
  };

  image.addEventListener("error", showFallback);

  if (image.complete && image.naturalWidth === 0) {
    showFallback();
  }
});
