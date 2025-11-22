import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import useEntropyStore from '../store/entropyStore';

const EntropyPool = () => {
    const containerRef = useRef(null);
    const { addEntropy, entropyLevel, maxEntropy } = useEntropyStore();

    // Ref to store the p5 instance so we can clean it up
    const p5Instance = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const sketch = (p) => {
            let particles = [];

            p.setup = () => {
                const canvas = p.createCanvas(containerRef.current.offsetWidth, 300);
                canvas.parent(containerRef.current);
                p.background(5); // Deep void
                p.frameRate(30);
            };

            p.draw = () => {
                p.background(5, 20); // Trail effect

                // Visual representation of current entropy level
                const intensity = p.map(entropyLevel, 0, maxEntropy, 0, 255);

                // Add random particles based on entropy
                if (p.random(1000) < entropyLevel) {
                    particles.push(new Particle(p, p.width / 2, p.height / 2));
                }

                // User interaction adds entropy
                if (p.mouseIsPressed || (p.mouseX !== p.pmouseX || p.mouseY !== p.pmouseY)) {
                    // Only add entropy if mouse is over canvas
                    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
                        addEntropy(1);
                        particles.push(new Particle(p, p.mouseX, p.mouseY));
                    }
                }

                // Update and display particles
                for (let i = particles.length - 1; i >= 0; i--) {
                    particles[i].update();
                    particles[i].display(intensity);
                    if (particles[i].isDead()) {
                        particles.splice(i, 1);
                    }
                }

                // Display Entropy Level Text
                p.fill(0, 255, 65);
                p.noStroke();
                p.textSize(14);
                p.textFont('Courier New');
                p.text(`ENTROPY_LEVEL: ${Math.floor(entropyLevel)} / ${maxEntropy}`, 10, 25);

                // Bar at bottom
                p.fill(0, 255, 65);
                p.rect(0, p.height - 2, p.map(entropyLevel, 0, maxEntropy, 0, p.width), 2);
            };

            p.windowResized = () => {
                if (containerRef.current) {
                    p.resizeCanvas(containerRef.current.offsetWidth, 300);
                }
            };
        };

        class Particle {
            constructor(p, x, y) {
                this.p = p;
                this.pos = p.createVector(x, y);
                this.vel = p5.Vector.random2D().mult(p.random(1, 3));
                this.alpha = 255;
                // Randomly green or purple
                this.color = p.random() > 0.5 ? [0, 255, 65] : [188, 19, 254];
            }

            update() {
                this.pos.add(this.vel);
                this.alpha -= 5;
            }

            display(intensity) {
                this.p.noStroke();
                this.p.fill(this.color[0], this.color[1], this.color[2], this.alpha);
                this.p.ellipse(this.pos.x, this.pos.y, 4);
            }

            isDead() {
                return this.alpha < 0;
            }
        }

        // Create p5 instance
        p5Instance.current = new p5(sketch);

        // Cleanup
        return () => {
            if (p5Instance.current) {
                p5Instance.current.remove();
            }
        };
    }, [addEntropy, entropyLevel, maxEntropy]);

    return (
        <div className="entropy-pool-container">
            <h3>ENTROPY_POOL</h3>
            <div ref={containerRef} className="p5-canvas-container" style={{ width: '100%', height: '300px', border: '1px solid #003b00' }}></div>
            <p className="instruction">PERTURB THE SYSTEM TO GENERATE CHAOS.</p>
        </div>
    );
};

export default EntropyPool;
