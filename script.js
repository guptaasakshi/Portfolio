// Register plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Animated Background Particles
const particleCount = 50;
const bg = document.querySelector(".animated-bg");

for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    bg.appendChild(particle);

    gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.6 + 0.2
    });

    animateParticle(particle);
}

function animateParticle(p) {
    gsap.to(p, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        duration: Math.random() * 6 + 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

//  Section-Based Background Color Change 
const sections = document.querySelectorAll("section");
sections.forEach(section => {
    ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => changeBackground(section.dataset.bg),
        onEnterBack: () => changeBackground(section.dataset.bg)
    });
});

function changeBackground(section) {
    let colors;
    switch (section) {
        case "home":
            colors = ["#ff9a9e", "#fad0c4", "#a1c4fd", "#c2e9fb"];
            break;
        case "about":
            colors = ["#f5a9ab", "#2e6176", "#3c6a79", "#4986a0"];
            break;
        case "skills":
            colors = ["#1e3c72", "#ac91ad", "#9b918f", "#f9d3fe"];
            break;
        case "education":
            colors = ["#bb9389", "#275264", "#315764", "#65bce1"];
            break;
        case "projects":
            colors = ["#c7ddfe", "#2d436b", "#243b55", "#fac3dd"];
            break;
        case "contact":
            colors = ["#736c7d", "#232526", "#414345", "#b3cbef"];
            break;
        case "certifications":
            colors = ["#c7ddfe", "#576887", "#36558b", "#fac3dd"];
            break;
        default:
            colors = ["#fffbf0", "#f0fff9", "#f6f0ff", "#fff6f0"];
    }

    gsap.to(".animated-bg", {
        duration: 2.5,
        background: `linear-gradient(135deg, ${colors.join(",")})`,
        ease: "power2.inOut"
    });
}

//  Hamburger Toggle for Mobile 
const menuToggle = document.createElement("div");
menuToggle.classList.add("menu-toggle");
menuToggle.innerHTML = "☰";
document.querySelector("header").appendChild(menuToggle);

menuToggle.addEventListener("click", () => {
    document.querySelector(".nav-links").classList.toggle("show");
    menuToggle.textContent = menuToggle.textContent === "☰" ? "✖" : "☰";
});

//  Home Section Entry Animations 
window.addEventListener("load", () => {
    gsap.from(".logo", { duration: 1, y: -20, opacity: 0, ease: "power3.out" });
    gsap.from(".nav-links li a", {
        duration: 0.7,
        y: -40,
        opacity: 0,
        stagger: 0.15,
        delay: 0.5,
        ease: "power3.out"
    });

    // gsap.from("#home .intro h1", { duration: 1, x: -100, opacity: 0, delay: 0.5 });
    gsap.from("#home .intro h2", { duration: 1, x: 100, opacity: 0, delay: 0.7 });
    gsap.from("#home .intro p", { duration: 1, y: 50, opacity: 0, delay: 0.9 });
    gsap.from("#home .btn", { duration: 0.8, scale: 0, delay: 1.2, ease: "back.out(1.7)" });
});

var h1 = document.querySelector(".home .intro h1")
var h1Text = h1.textContent

var splittedtText = h1Text.split("")
var halfValue = splittedtText.length / 2

var clutter = ""

splittedtText.forEach(function (elem, idx) {
    if (idx < halfValue) {
        clutter += `<span class="a">${elem}</span>`
    } else {
        clutter += `<span class="b">${elem}</span>`
    }
})

h1.innerHTML = clutter


gsap.from(".home .intro h1 .a", {
    y: 80,
    opacity: 0,
    duration: 0.6,
    delay: 0.5,
    stagger: 0.15,
})

gsap.from(".home .intro h1 .b", {
    y: 80,
    opacity: 0,
    duration: 0.6,
    delay: 0.5,
    stagger: -0.15,
})

// // Animate All H2 Headings 
// document.querySelectorAll("h2.section-title").forEach(function (h2, index) {
//     var h2Text = h2.textContent
//     var splittedtText = h2Text.split("")
//     var halfValue = Math.floor(splittedtText.length / 2)

//     var clutter = ""
//     splittedtText.forEach(function (elem, idx) {
//         if (elem === " ") elem = "&nbsp;" // space ko preserve karne ke liye
//         if (idx < halfValue) {
//             clutter += `<span class="a">${elem}</span>`
//         } else {
//             clutter += `<span class="b">${elem}</span>`
//         }
//     })

//     h2.innerHTML = clutter

//     // Animate left part
//     gsap.from(h2.querySelectorAll(".a"), {
//         y: 80,
//         opacity: 0,
//         duration: 0.6,
//         delay: 0.5, // thoda delay har section ke liye
//         stagger: 0.15,
//         scrollTrigger: {
//             trigger: h2,
//             start: "top 85%",
//         }
//     })

//     // Animate right part
//     gsap.from(h2.querySelectorAll(".b"), {
//         y: 80,
//         opacity: 0,
//         duration: 0.6,
//         delay: 0.5,
//         stagger: -0.15,
//         scrollTrigger: {
//             trigger: h2,
//             start: "top 85%",
//         }
//     })
// })



// ---------- About Section ----------
gsap.from(".about-img img", {
    scrollTrigger: {
        trigger: ".about",
        start: "top 80%",
        end: "bottom 60%",
        toggleActions: "play reverse play reverse",
        scrub: true
    },
    x: -200,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

gsap.from(".about-content p", {
    scrollTrigger: {
        trigger: ".about",
        start: "top 80%",
        end: "bottom 60%",
        toggleActions: "play reverse play reverse",
        scrub: true
    },
    x: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.3,
    ease: "power3.out"
});

// ---------- Skills Section ----------
gsap.from(".skill-box", {
    scrollTrigger: {
        trigger: ".skills",
        start: "top 80%",
        end: "bottom 60%",
        toggleActions: "play reverse play reverse",
        scrub: true
    },
    y: 60,
    opacity: 0,
    duration: 1,
    stagger: 0.3,
    ease: "power3.out"
});

// ---------- Education Section ----------
gsap.utils.toArray(".timeline-item").forEach((item, i) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "bottom 60%",
            toggleActions: "play reverse play reverse",
            scrub: true
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: i * 0.2
    });
});

// ---------- Projects Section ----------

// ---------- Projects Section ----------
const projectCards = document.querySelectorAll(".project-card");
const filterButtons = document.querySelectorAll(".filter-btn");

//  Filter Projects
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        // Active button highlight
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        projectCards.forEach(card => {
            if (filter === "all") {
                card.style.display = "block"; // show all
            } else {
                card.style.display = card.dataset.category === filter ? "block" : "none";
            }
        });

        // Refresh ScrollTrigger to recalc positions after filtering
        ScrollTrigger.refresh();
    });
});

//  Animate Project Cards 
projectCards.forEach((card, i) => {
    let fromProps = {};

    // Different animation direction for variety
    if (i % 3 === 0) {
        fromProps = { x: -300, opacity: 0 };
    } else if (i % 3 === 1) {
        fromProps = { y: 300, scale: 0.8, opacity: 0 };
    } else {
        fromProps = { x: 300, opacity: 0 };
    }

    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 60%",
            toggleActions: "play reverse play reverse",
            scrub: true
        },
        ...fromProps,
        duration: 1,
        ease: "power3.out"
    });
});

//
// gsap.utils.toArray(".project-card").forEach((card, i) => {
//     let fromProps = {};

//     if (i % 3 === 0) {
//         fromProps = { x: -300, opacity: 0 };
//     } else if (i % 3 === 1) {
//         fromProps = { y: 300, scale: 0.8, opacity: 0 };
//     } else {
//         fromProps = { x: 300, opacity: 0 };
//     }

//     gsap.from(card, {
//         scrollTrigger: {
//             trigger: card,
//             start: "top 85%",
//             end: "bottom 60%",
//             toggleActions: "play reverse play reverse",
//             scrub: true
//         },
//         ...fromProps,
//         duration: 1,
//         ease: "power3.out"
//     });
// });

//  Certifications Section 
gsap.from(".cert-card", {
    scrollTrigger: {
        trigger: ".certifications",
        start: "top 80%",
        end: "bottom 60%",
        toggleActions: "play reverse play reverse",
        scrub: true
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.3,
    ease: "power2.out"
});

// Contact Section 
gsap.fromTo(".contact-form input, .contact-form textarea, .contact-form button",
    { y: 250, opacity: 0 },
    {
        scrollTrigger: {
            trigger: ".contact-form",
            start: "top 90%",
            end: "bottom 70%",
            toggleActions: "play reverse play reverse",
            scrub: true
        },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.6,
        ease: "power3.out"
    }
);

gsap.from(".contact-info", {
    scrollTrigger: {
        trigger: ".contact-info",
        start: "top 85%",
        end: "bottom 60%",
        toggleActions: "play reverse play reverse",
        scrub: true
    },
    x: 280,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

// Smooth Scroll for Nav Links 
const navLinks = document.querySelectorAll(".nav-links li a");
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        const target = document.querySelector(targetId);

        gsap.to(window, {
            duration: 1,
            scrollTo: target,
            ease: "power2.inOut"
        });
    });
});

// Active Nav Highlight 
sections.forEach((section, index) => {
    ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveLink(index),
        onEnterBack: () => setActiveLink(index),
    });
});

function setActiveLink(index) {
    navLinks.forEach(link => link.classList.remove("active"));
    navLinks[index].classList.add("active");
}

gsap.registerPlugin(ScrollTrigger);

/* RESPONSIVE GSAP */
const mm = gsap.matchMedia();

/* DESKTOP (≥ 769px)*/
mm.add("(min-width: 769px)", () => {

    // Section Titles
    gsap.utils.toArray(".section-title").forEach(title => {
        gsap.from(title.children, {
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
            },
            y: 80,
            opacity: 0,
            stagger: 0.06,
            duration: 0.6,
            ease: "power3.out"
        });
    });

    // Project Cards
    gsap.utils.toArray(".project-card").forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                scrub: true
            },
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // About Section
    gsap.from(".about-img img", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 75%",
            scrub: true
        },
        x: -200,
        opacity: 0,
        duration: 1
    });

    gsap.from(".about-content p", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 75%",
            scrub: true
        },
        x: 150,
        opacity: 0,
        stagger: 0.2
    });

});

/*MOBILE (≤ 768px)*/
mm.add("(max-width: 768px)", () => {

    // Section Titles (NO SCRUB for performance)
    gsap.utils.toArray(".section-title").forEach(title => {
        gsap.from(title.children, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            stagger: 0.04,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    // Project Cards 
    gsap.from(".project-card", {
        scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 85%",
        },
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out"
    });

    // About Section
    gsap.from(".about-img img, .about-content p", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 85%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 0.6
    });

});

/* COMMON*/

// Refresh on resize
window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
});

/*Contact Section*/

// gsap.matchMedia().add("(max-width: 768px)", () => {

//     gsap.from(".contact-form input, .contact-form textarea, .contact-form button", {
//         scrollTrigger: {
//             trigger: ".contact",
//             start: "top 90%",
//             toggleActions: "play none none none"
//         },
//         y: 40,              // small movement
//         opacity: 0,
//         duration: 0.6,
//         stagger: 0.2,
//         ease: "power2.out"
//     });

//     gsap.from(".contact-info", {
//         scrollTrigger: {
//             trigger: ".contact",
//             start: "top 90%",
//             toggleActions: "play none none none"
//         },
//         y: 40,
//         opacity: 0,
//         duration: 0.6,
//         ease: "power2.out"
//     });

// });
