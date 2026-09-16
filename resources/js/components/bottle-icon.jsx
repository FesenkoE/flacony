import { useId } from 'react';

const TINT = '#a9835a';
const GOLD = '#b8944a';

export default function BottleIcon({ size = 120, tint = TINT }) {
    const height = Math.round((size / 80) * 90);
    const gradientId = `bottleGrad-${useId()}`;

    return (
        <svg
            width={size}
            height={height}
            viewBox="0 0 80 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={tint} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={tint} stopOpacity="0.08" />
                </linearGradient>
            </defs>
            {/* Two-tier cap: wide smooth drum + a short plain neck, stepped not tapered. Square flacon with a flat base */}
            <rect
                x="25"
                y="4"
                width="30"
                height="12"
                rx="3"
                fill={GOLD}
                fillOpacity="0.85"
            />
            <rect
                x="29"
                y="15"
                width="22"
                height="7"
                rx="2"
                fill={GOLD}
                fillOpacity="0.85"
            />
            <rect
                x="13"
                y="21"
                width="54"
                height="58"
                rx="7"
                fill={`url(#${gradientId})`}
                stroke={tint}
                strokeOpacity="0.4"
            />
        </svg>
    );
}
