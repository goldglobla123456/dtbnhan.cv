"use strict";

const canvas = document.getElementById("fireworksCanvas");
const cvPage = document.querySelector(".cv-page");

if (canvas) {
	const ctx = canvas.getContext("2d");
	const particles = [];
	const palette = ["#f43f5e", "#f59e0b", "#22c55e", "#38bdf8", "#a855f7", "#f97316"];

	const resizeCanvas = () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};

	const createBurst = (x, y) => {
		const count = 42;
		for (let index = 0; index < count; index += 1) {
			const angle = (Math.PI * 2 * index) / count + Math.random() * 0.25;
			const speed = 1.4 + Math.random() * 3.2;
			particles.push({
				x,
				y,
				vx: Math.cos(angle) * speed,
				vy: Math.sin(angle) * speed,
				alpha: 1,
				radius: 1.6 + Math.random() * 2.4,
				decay: 0.012 + Math.random() * 0.01,
				gravity: 0.018 + Math.random() * 0.012,
				color: palette[Math.floor(Math.random() * palette.length)]
			});
		}
	};

	const createBurstAroundCv = () => {
		if (!cvPage) {
			createBurst(Math.random() * canvas.width, Math.random() * canvas.height * 0.7);
			return;
		}

		const rect = cvPage.getBoundingClientRect();
		const side = Math.floor(Math.random() * 4);
		let x = 0;
		let y = 0;

		if (side === 0) {
			x = rect.left - 20 + Math.random() * (rect.width + 40);
			y = Math.max(20, rect.top - 30);
		} else if (side === 1) {
			x = rect.right + 24;
			y = rect.top + Math.random() * rect.height;
		} else if (side === 2) {
			x = rect.left - 24;
			y = rect.top + Math.random() * rect.height;
		} else {
			x = rect.left - 20 + Math.random() * (rect.width + 40);
			y = Math.min(canvas.height - 20, rect.bottom + 30);
		}

		createBurst(x, y);
	};

	const animate = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let index = particles.length - 1; index >= 0; index -= 1) {
			const particle = particles[index];
			particle.x += particle.vx;
			particle.y += particle.vy;
			particle.vy += particle.gravity;
			particle.vx *= 0.992;
			particle.alpha -= particle.decay;

			if (particle.alpha <= 0.02) {
				particles.splice(index, 1);
				continue;
			}

			ctx.globalAlpha = particle.alpha;
			ctx.beginPath();
			ctx.fillStyle = particle.color;
			ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
			ctx.fill();
		}

		ctx.globalAlpha = 1;
		requestAnimationFrame(animate);
	};

	resizeCanvas();
	createBurstAroundCv();
	createBurstAroundCv();
	animate();

	window.addEventListener("resize", resizeCanvas);
	window.addEventListener("click", (event) => {
		createBurst(event.clientX, event.clientY);
	});

	setInterval(createBurstAroundCv, 780);
}
