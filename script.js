(() => {
  const WHATSAPP_NUMBER = "919508678989";

  // -------------------------------------------------------------------------
  // 1. Sticky Navbar Scroll State & Mobile Menu Drawer
  // -------------------------------------------------------------------------
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  const syncNavbarState = () => {
    if (!navbar) return;
    navbar.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", syncNavbarState, { passive: true });
  syncNavbarState();

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = !mobileMenu.hasAttribute("hidden");
      if (isOpen) {
        mobileMenu.setAttribute("hidden", "");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      } else {
        mobileMenu.removeAttribute("hidden");
        navToggle.classList.add("is-open");
        navToggle.setAttribute("aria-expanded", "true");
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.setAttribute("hidden", "");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // -------------------------------------------------------------------------
  // 2. Certificate Category Filters
  // -------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll(".filter-btn");
  const certCards = document.querySelectorAll(".cert-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      filterButtons.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      certCards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category === filter;
        if (matches) {
          card.removeAttribute("hidden");
        } else {
          card.setAttribute("hidden", "");
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 3. Full-Screen Lightbox Modal (Certificates & Visiting Card)
  // -------------------------------------------------------------------------
  const lightbox = document.getElementById("lightboxModal");
  const lightboxBackdrop = document.getElementById("lightboxBackdrop");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxMeta = document.getElementById("lightboxMeta");
  const lightboxFooter = document.getElementById("lightboxFooter");
  const lightboxVerifyBtn = document.getElementById("lightboxVerifyBtn");
  const vcardTrigger = document.getElementById("vcardTrigger");

  let lastFocusedElement = null;

  const openLightbox = ({ src, title, meta, url }) => {
    if (!lightbox || !lightboxImg) return;
    lastFocusedElement = document.activeElement;

    lightboxImg.src = src;
    lightboxImg.alt = title || "Full-screen preview";
    lightboxTitle.textContent = title || "Preview";
    lightboxMeta.textContent = meta || "";

    if (url) {
      lightboxVerifyBtn.href = url;
      lightboxFooter.removeAttribute("hidden");
    } else {
      lightboxVerifyBtn.href = "#";
      lightboxFooter.setAttribute("hidden", "");
    }

    lightbox.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.setAttribute("hidden", "");
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  };

  document.querySelectorAll("[data-lightbox-src]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openLightbox({
        src: trigger.dataset.lightboxSrc,
        title: trigger.dataset.lightboxTitle,
        meta: trigger.dataset.lightboxMeta,
        url: trigger.dataset.lightboxUrl
      });
    });
  });

  if (vcardTrigger) {
    const openVcard = () => {
      openLightbox({
        src: "assets/card/ayush-raj-visiting-card.png",
        title: "Ayush Raj — Official Visiting Card",
        meta: "IMAYUSH2108 • Web & Digital Creator Studio • Purnia, Bihar",
        url: ""
      });
    };

    vcardTrigger.addEventListener("click", openVcard);
    vcardTrigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openVcard();
      }
    });
  }

  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox && !lightbox.hasAttribute("hidden")) {
      closeLightbox();
    }
  });

  // -------------------------------------------------------------------------
  // 4. Add Your Review — Star Picker & Direct WhatsApp Submission
  // -------------------------------------------------------------------------
  const starPicker = document.getElementById("starPicker");
  const reviewForm = document.getElementById("reviewForm");
  const reviewerName = document.getElementById("reviewerName");
  const reviewerMessage = document.getElementById("reviewerMessage");
  const reviewFormError = document.getElementById("reviewFormError");

  let selectedRating = 5;

  if (starPicker) {
    const starBtns = starPicker.querySelectorAll(".star-btn");
    const renderStars = (rating) => {
      starBtns.forEach((btn) => {
        const val = Number(btn.dataset.rating);
        btn.classList.toggle("is-selected", val <= rating);
      });
    };

    starBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedRating = Number(btn.dataset.rating);
        renderStars(selectedRating);
      });
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const nameVal = reviewerName.value.trim();
      const msgVal = reviewerMessage.value.trim();

      if (!nameVal || !msgVal) {
        reviewFormError.textContent = "Please enter both your Name / Title and your Review message.";
        reviewFormError.removeAttribute("hidden");
        return;
      }

      reviewFormError.setAttribute("hidden", "");

      const starsText = "★".repeat(selectedRating) + "☆".repeat(5 - selectedRating);
      const formattedMessage =
        `Hello Ayush Raj (@imayush2108),\n\n` +
        `Here is my review for your portfolio:\n` +
        `Name / Title: ${nameVal}\n` +
        `Rating: ${starsText} (${selectedRating}/5)\n` +
        `Review: ${msgVal}`;

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  }

  // -------------------------------------------------------------------------
  // 5. Scroll Reveal Animations
  // -------------------------------------------------------------------------
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }
})();
