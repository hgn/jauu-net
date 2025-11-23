document.addEventListener("DOMContentLoaded", function() {
    const cards = document.querySelectorAll('.nav-card');

    cards.forEach(card => {
        // 1. Canvas erzeugen und einfügen
        const canvas = document.createElement('canvas');
        card.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        let width, height;
        let particles = [];
        let animationFrame;

        // Konfiguration für den Graphen
        const config = {
            particleCount: 20,     // Anzahl der Knoten
            connectionDistance: 100, // Ab wann eine Linie gezogen wird
            speed: 0.5,            // Geschwindigkeit der Bewegung
            color: getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#ffffff'
        };

        // Canvas Größe anpassen
        const resize = () => {
            width = card.offsetWidth;
            height = card.offsetHeight;
            canvas.width = width;
            canvas.height = height;
        };

        // Partikel Klasse
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * config.speed;
                this.vy = (Math.random() - 0.5) * config.speed;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Abprallen an den Rändern
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.fillStyle = config.color;
                ctx.globalAlpha = 0.5; // Punkte etwas transparent
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialisierung
        const initParticles = () => {
            particles = [];
            resize();
            for (let i = 0; i < config.particleCount; i++) {
                particles.push(new Particle());
            }
        };

        // Der Zeichen-Loop
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            // Nodes updaten und zeichnen
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Kanten (Lines) zeichnen
            connectParticles();

            animationFrame = requestAnimationFrame(animate);
        };

        // Verbindungen zeichnen (Triangulation)
        const connectParticles = () => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.connectionDistance) {
                        // Linie wird transparenter, je weiter weg
                        let opacity = 1 - (distance / config.connectionDistance);
                        ctx.strokeStyle = config.color;
                        ctx.lineWidth = 1;
                        ctx.globalAlpha = opacity * 0.2; // Sehr dezent (0.2)
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        // Event Listeners: Nur animieren wenn Maus drauf ist!
        card.addEventListener('mouseenter', () => {
            // Farben beim Hover neu laden (falls Dark/Light Mode Switch)
            config.color = getComputedStyle(document.body).getPropertyValue('--primary').trim();
            initParticles();
            animate();
        });

        card.addEventListener('mouseleave', () => {
            cancelAnimationFrame(animationFrame);
            ctx.clearRect(0, 0, width, height); // Canvas leeren
        });
        
        // Einmal initial resize, damit Dimensionen stimmen
        resize();
    });
});
