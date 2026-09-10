import { useMemo } from 'react';

const PARTICLE_COUNT = 140;

export default function DissolveCard({ active, children, className = '', ...rest }) {
    const particles = useMemo(
        () =>
            Array.from({ length: PARTICLE_COUNT }, () => ({
                left: Math.random() * 100,
                top: Math.random() * 100,
                dx: (Math.random() - 0.5) * 180,
                dy: (Math.random() - 0.5) * 160 - 40,
                size: 1 + Math.random() * 2,
                delay: Math.random() * 0.3,
            })),
        [],
    );

    return (
        <div className={`relative ${active ? 'pointer-events-none' : ''}`} {...rest}>
            <div
                className={
                    `${className} transition-all duration-300 ` +
                    (active
                        ? 'scale-97 opacity-0 blur-[3px] duration-700'
                        : 'scale-100 opacity-100 blur-0')
                }
            >
                {children}
            </div>
            {active &&
                particles.map((p, i) => (
                    <span
                        key={i}
                        className="dissolve-particle"
                        style={{
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            animationDelay: `${p.delay}s`,
                            '--dx': `${p.dx}px`,
                            '--dy': `${p.dy}px`,
                        }}
                    />
                ))}
        </div>
    );
}
