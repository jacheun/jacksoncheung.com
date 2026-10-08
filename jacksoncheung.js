const RADIUS = 1000;
const MAX_TRAVEL = 100;
const STIFFNESS = 0.01;
const DAMPING = 0.8;

// Float settings
const FLOAT_AMP_MIN = 6;
const FLOAT_AMP_MAX = 14;
const FLOAT_SPEED_MIN = 0.0004;
const FLOAT_SPEED_MAX = 0.0009;

const rand = (min, max) => min + Math.random() * (max - min);

const circles = [...document.querySelectorAll('.drift-circle')].map(el => ({
    el, cx: 0, cy: 0, dirX: 0, dirY: 0, x: 0, y: 0, vx: 0, vy: 0,

    ampX: rand(FLOAT_AMP_MIN, FLOAT_AMP_MAX),
    ampY: rand(FLOAT_AMP_MIN, FLOAT_AMP_MAX),

    speedX: rand(FLOAT_SPEED_MIN, FLOAT_SPEED_MAX),
    speedY: rand(FLOAT_SPEED_MIN, FLOAT_SPEED_MAX),

    phaseX: rand(0, Math.PI * 2),
    phaseY: rand(0, Math.PI * 2),
}));

let mouse = null;

function measure() {
    circles.forEach(c => {
        c.el.style.transform = 'none';

        const r = c.el.getBoundingClientRect();

        c.cx = r.left + r.width / 2;
        c.cy = r.top + r.height / 2;

        const dx = c.cx - innerWidth / 2;
        const dy = c.cy - innerHeight / 2;

        const len = Math.hypot(dx, dy) || 1;

        c.dirX = dx / len;
        c.dirY = dy / len;
    });
}

function tick(time) {
    circles.forEach(c => {
        let influence = 0;

        if (mouse) {
            const d = Math.hypot(
                mouse.x - c.cx,
                mouse.y - c.cy
            );

            influence = Math.max(0, 1 - d / RADIUS);
        }

        const targetX = c.dirX * MAX_TRAVEL * influence;
        const targetY = c.dirY * MAX_TRAVEL * influence;

        c.vx = (c.vx + (targetX - c.x) * STIFFNESS) * DAMPING;
        c.vy = (c.vy + (targetY - c.y) * STIFFNESS) * DAMPING;

        c.x += c.vx;
        c.y += c.vy;

        const floatX =
            Math.sin(time * c.speedX + c.phaseX) * c.ampX;

        const floatY =
            Math.cos(time * c.speedY + c.phaseY) * c.ampY;

        c.el.style.transform =
            `translate(${c.x + floatX}px, ${c.y + floatY}px)`;
    });

    requestAnimationFrame(tick);
}

document.addEventListener('mousemove', e => {
    mouse = {
        x: e.clientX,
        y: e.clientY
    };
});

document.documentElement.addEventListener('mouseleave', () => {
    mouse = null;
});

window.addEventListener('resize', measure);

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    measure();
    requestAnimationFrame(tick);
}


// CONTACT BUTTON

const contactButton = document.getElementById("contact");

contactButton.addEventListener("click", function () {

    navigator.clipboard.writeText("jacksongcheung@gmail.com")
        .then(function () {

            contactButton.innerHTML = "email coppied";

            setTimeout(function () {
                contactButton.innerHTML = "<strong>CONTACT</strong>";
            }, 1500);

        })
        .catch(function (error) {
            console.error("Copy failed:", error);
        });

});