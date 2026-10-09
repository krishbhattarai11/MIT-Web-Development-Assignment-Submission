document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".slider");

    if (!slider) {
        return;
    }
    const track = slider.querySelector(".slider-track");
    const previousButton = slider.querySelector(".prev");
    const nextButton = slider.querySelector(".next");
    const dotsContainer = slider.querySelector(".slider-dots");

    const originalSlides = Array.from(
        track.querySelectorAll(".slide")
    );

    const slideCount = originalSlides.length;

    if (slideCount === 0) {
        return;
    }

    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[slideCount - 1].cloneNode(true);

    firstClone.setAttribute("aria-hidden", "true");
    lastClone.setAttribute("aria-hidden", "true");

    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalSlides[0]);

    let position = 1;
    let currentIndex = 0;
    let isAnimating = false;

    const dots = originalSlides.map((slide, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.setAttribute("aria-label", `Go to image ${index + 1}`);

        dot.addEventListener("click", () => {
            moveTo(index + 1);
        });

        dotsContainer.appendChild(dot);

        return dot;
    });

    function updateDots() {
        currentIndex = (position - 1 + slideCount) % slideCount;

        dots.forEach((dot, index) => {
            const active = index === currentIndex;

            dot.classList.toggle("active", active);

            if (active) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    }

    function moveTo(newPosition) {
        if (isAnimating) {
            return;
        }

        position = newPosition;
        isAnimating = true;

        track.style.transition = "transform 0.45s ease-in-out";
        track.style.transform = `translateX(-${position * 100}%)`;

        updateDots();
    }
    nextButton.addEventListener("click", () => {
        moveTo(position + 1);
    });

    previousButton.addEventListener("click", () => {
        moveTo(position - 1);
    });

    track.addEventListener("transitionend", (event) => {
        if (event.target !== track || event.propertyName !== "transform") {
            return;
        }

        if (position === slideCount + 1) {
            position = 1;
            resetPosition();
        } else if (position === 0) {
            position = slideCount;
            resetPosition();
        }

        isAnimating = false;
        updateDots();
    });

    function resetPosition() {
        track.style.transition = "none";
        track.style.transform = `translateX(-${position * 100}%)`;

        track.offsetHeight;
    }
    resetPosition();
    updateDots();
});