import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import useEntropyStore from '../store/entropyStore';

const EntropyPool = () => {
    const containerRef = useRef(null);
    const { addEntropy, entropyLevel, maxEntropy } = useEntropyStore();
    const entropyRef = useRef(entropyLevel);

    // Throttle ref
    const lastUpdateRef = useRef(Date.now());

    // Keep ref synced with store to avoid re-init
    useEffect(() => {
        entropyRef.current = entropyLevel;
    }, [entropyLevel]);

    useEffect(() => {
        let myP5;

        const sketch = (p) => {
            let cols, rows;
            let scl = 20;
            let w, h;
            let particles = [];
            const numParticles = 800; // Increased count for smoke effect
            let zOff = 0;

            p.setup = () => {
                w = containerRef.current.clientWidth;
                h = 400;
                p.createCanvas(w, h);
                cols = p.floor(w / scl);
                rows = p.floor(h / scl);

                for (let i = 0; i < numParticles; i++) {
                    particles.push(new Particle(p));
                }
                p.background(5);
            };

            p.draw = () => {
                // Smoke trail effect: lower alpha background
                p.background(5, 50);

                // Draw Grid
                p.stroke(255, 176, 0, 10);
                p.strokeWeight(1);
                for (let x = 0; x <= w; x += scl) {
                    for (let y = 0; y <= h; y += scl) {
                        // Warp grid near mouse
                        let d = p.dist(x, y, p.mouseX, p.mouseY);
                        let warpX = x;
                        let warpY = y;
                        if (d < 100) {
                            let angle = p.atan2(y - p.mouseY, x - p.mouseX);
                            let force = p.map(d, 0, 100, 20, 0);
                            warpX += p.cos(angle) * force;
                            warpY += p.sin(angle) * force;
                        }
                        p.point(warpX, warpY);
                    }
                }

                zOff += 0.002; // Slower time evolution for smoke

                for (let i = 0; i < particles.length; i++) {
                    particles[i].follow(cols, rows, scl, zOff);
                    particles[i].update();
                    particles[i].edges(w, h);
                    particles[i].show();
                }

                // Draw Entropy Bar
                let barWidth = p.map(entropyRef.current, 0, maxEntropy, 0, w);
                p.noStroke();
                p.fill(255, 176, 0);
                p.rect(0, h - 2, barWidth, 2);
            };

            p.windowResized = () => {
                w = containerRef.current.clientWidth;
                p.resizeCanvas(w, h);
                cols = p.floor(w / scl);
                rows = p.floor(h / scl);
            };

            class Particle {
                constructor(p) {
                    this.p = p;
                    this.pos = p.createVector(p.random(w), p.random(h));
                    this.vel = p.createVector(0, 0);
                    this.acc = p.createVector(0, 0);
                    this.maxSpeed = 1.5; // Slower smoke
                    this.prevPos = this.pos.copy();
                }

                follow(cols, rows, scl, zOff) {
                    let x = this.p.floor(this.pos.x / scl);
                    let y = this.p.floor(this.pos.y / scl);

                    // Clamp to grid
                    x = this.p.constrain(x, 0, cols - 1);
                    y = this.p.constrain(y, 0, rows - 1);

                    // Simplex noise for smoke
                    let angle = this.p.noise(x * 0.05, y * 0.05, zOff) * this.p.TWO_PI * 4;

                    // Mouse interaction (Repel/Swirl)
                    let dx = this.p.mouseX - this.pos.x;
                    let dy = this.p.mouseY - this.pos.y;
                    let dSq = dx * dx + dy * dy;

                    if (dSq < 22500) { // 150px radius
                        let mouseAngle = this.p.atan2(dy, dx);
                        angle = mouseAngle + this.p.PI + (1 / (dSq * 0.01)); // Swirl
                    }

                    let forceX = Math.cos(angle);
                    let forceY = Math.sin(angle);

                    this.acc.add(forceX * 0.1, forceY * 0.1); // Lower force for floaty feel
                }

                update() {
                    this.vel.add(this.acc);
                    this.vel.limit(this.maxSpeed);
                    this.pos.add(this.vel);
                    this.acc.mult(0);
                }

                edges(width, height) {
                    // Wrap around smoothly
                    if (this.pos.x > width) { this.pos.x = 0; this.updatePrev(); }
                    if (this.pos.x < 0) { this.pos.x = width; this.updatePrev(); }
                    if (this.pos.y > height) { this.pos.y = 0; this.updatePrev(); }
                    if (this.pos.y < 0) { this.pos.y = height; this.updatePrev(); }
                }

                updatePrev() {
                    this.prevPos.x = this.pos.x;
                    this.prevPos.y = this.pos.y;
                }

                show() {
                    this.p.stroke(255, 176, 0, 100); // Lower opacity
                    this.p.strokeWeight(1); // 1px size
                    this.p.point(this.pos.x, this.pos.y); // Draw as point for 1px
                }
            }
        };

        myP5 = new p5(sketch, containerRef.current);

        return () => {
            myP5.remove();
        };
    }, []);

    const handleMouseMove = () => {
        const now = Date.now();
        if (now - lastUpdateRef.current > 100) {
            addEntropy(5);
            lastUpdateRef.current = now;
        }
    };

    return (
        <div className="entropy-container">
            <h2 className="section-title">ENTROPY_POOL</h2>
            <div
                className="p5-wrapper"
                ref={containerRef}
                onMouseMove={handleMouseMove}
            >
                <div className="entropy-overlay">
                    <span className="entropy-status">
                        ENTROPY_LEVEL: {Math.floor(entropyLevel)} / {maxEntropy}
                    </span>
                </div>
            </div>
            <p className="instruction-text">PERTURB THE SYSTEM TO GENERATE CHAOS.</p>
        </div>
    );
};

export default EntropyPool;
