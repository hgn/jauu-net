(() => {
  const viewport = document.querySelector(".carousel__viewport");
  const slides = Array.from(viewport?.children || []);
  if (!viewport || slides.length === 0) return;

  // Wrap slides in an inner flex container for smooth translate animation.
  const inner = document.createElement("div");
  inner.className = "carousel__inner";
  slides.forEach((slide) => inner.appendChild(slide));
  viewport.appendChild(inner);

  let index = 0;
  const dotsWrap = document.querySelector(".dots");
  const prevBtn = document.querySelector('[data-dir="prev"]');
  const nextBtn = document.querySelector('[data-dir="next"]');
  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    dot.addEventListener("click", () => goTo(i));
    dotsWrap?.appendChild(dot);
    return dot;
  });

  const setBg = (el) => {
    const bg = el.dataset.bg;
    if (!bg) return;
    el.style.backgroundImage = `url(${bg})`;
  };

  slides.forEach(setBg);
  document.querySelectorAll("[data-bg]").forEach(setBg);

  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    inner.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, d) => {
      dot.classList.toggle("is-active", d === index);
    });
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  nextBtn?.addEventListener("click", next);
  prevBtn?.addEventListener("click", prev);

  let timer = setInterval(next, 5200);
  const resetTimer = () => {
    clearInterval(timer);
    timer = setInterval(next, 5200);
  };
  viewport.addEventListener("pointerdown", resetTimer);
  nextBtn?.addEventListener("click", resetTimer);
  prevBtn?.addEventListener("click", resetTimer);

  goTo(0);
})();
