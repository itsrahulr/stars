document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particlesCanvas");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  let particles = [];
  const color = "#ffffff";
  const particleCount = 100;
  const size = 0.4;
  const staticity = 50;
  const ease = 50;
  let mouseX = 0;
  let mouseY = 0;

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
    const hexInt = parseInt(hex, 16);
    const red = (hexInt >> 16) & 255;
    const green = (hexInt >> 8) & 255;
    const blue = hexInt & 255;
    return [red, green, blue];
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.scale(dpr, dpr);
  }

  function createParticle() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const pSize = Math.random() * 2 + size;
    const alpha = Math.random();
    const targetAlpha = Math.random() * 0.6 + 0.1;
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
      translateX: 0,
      translateY: 0,
      originalSize: pSize,
    };
  }

  function drawParticle(particle) {
    ctx.translate(particle.translateX, particle.translateY);
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
    const [r, g, b] = hexToRgb(color);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.alpha})`;
    ctx.fill();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, i) => {
      // Twinkling effect
      particle.alpha += (Math.random() - 0.5) * 0.02;
      if (particle.alpha < 0) particle.alpha = 0;
      if (particle.alpha > 1) particle.alpha = 1;

      // Hover effect: enlarge particle when mouse is near
      const distance = Math.hypot(mouseX - particle.x, mouseY - particle.y);
      if (distance < 50) {
        particle.size = particle.originalSize * 1.5; // Enlarge particle
      } else {
        particle.size = particle.originalSize; // Reset to original size
      }

      particle.x += particle.dx;
      particle.y += particle.dy;
      particle.translateX +=
        (mouseX / (staticity / particle.magnetism) - particle.translateX) /
        ease;
      particle.translateY +=
        (mouseY / (staticity / particle.magnetism) - particle.translateY) /
        ease;

      drawParticle(particle);

      // Regenerate particle if it goes out of bounds
      if (
        particle.x < -particle.size ||
        particle.x > canvas.width + particle.size ||
        particle.y < -particle.size ||
        particle.y > canvas.height + particle.size
      ) {
        particles[i] = createParticle();
      }
    });
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle());
  }

  animateParticles();

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX - canvas.width / 2;
    mouseY = e.clientY - canvas.height / 2;
  });
});
