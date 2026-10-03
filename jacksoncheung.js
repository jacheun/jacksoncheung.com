const RADIUS = 1000;      // how close the cursor must be to affect a circle
const MAX_TRAVEL = 100;  // px a circle moves at full influence
const STIFFNESS = 0.01;  // higher = snappier
const DAMPING = 0.8;     // lower = more glide (below ~0.75 starts to overshoot)

const circles = [...document.querySelectorAll('.drift-circle')].map(el => ({
    el, cx: 0, cy: 0, dirX: 0, dirY: 0, x: 0, y: 0, vx: 0, vy: 0
}));

let mouse = null;

function measure() {
    circles.forEach(c => {
        c.el.style.transform = 'none'; // measure at rest position
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

function tick() {
    circles.forEach(c => {
        let influence = 0;
        if (mouse) {
            const d = Math.hypot(mouse.x - c.cx, mouse.y - c.cy);
            influence = Math.max(0, 1 - d / RADIUS);
        }

        const targetX = c.dirX * MAX_TRAVEL * influence;
        const targetY = c.dirY * MAX_TRAVEL * influence;

        c.vx = (c.vx + (targetX - c.x) * STIFFNESS) * DAMPING;
        c.vy = (c.vy + (targetY - c.y) * STIFFNESS) * DAMPING;
        c.x += c.vx;
        c.y += c.vy;

        c.el.style.transform = `translate(${c.x}px, ${c.y}px)`;
    });
    requestAnimationFrame(tick);
}

document.addEventListener('mousemove', e => {
    mouse = { x: e.clientX, y: e.clientY };
});
document.documentElement.addEventListener('mouseleave', () => { mouse = null; });
window.addEventListener('resize', measure);

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    measure();
    tick();
}