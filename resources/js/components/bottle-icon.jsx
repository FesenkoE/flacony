import { useId } from 'react';

const TINTS = ['#bf8438', '#a8702e', '#c48a56', '#9c6b4f'];

export function tintForId(id) {
    return TINTS[id % TINTS.length];
}

export default function BottleIcon({ size = 104, tint = '#bf8438' }) {
    const height = Math.round((size / 104) * 152);
    const gradientId = `bottleGrad-${useId()}`;

    return (
        <svg
            width={size}
            height={height}
            viewBox="0 0 104 152"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={tint} stopOpacity="0.32" />
                    <stop offset="100%" stopColor={tint} stopOpacity="0.05" />
                </linearGradient>
            </defs>
            <path
                d="M28 50c0-6 3-9 8-11V16h32v23c5 2 8 5 8 11v72a10 10 0 0 1-10 10H38a10 10 0 0 1-10-10z"
                fill={`url(#${gradientId})`}
                stroke={tint}
                strokeOpacity="0.5"
            />
            <rect x="32" y="4" width="40" height="15" rx="6" fill={tint} />
            <line
                x1="35"
                y1="60"
                x2="35"
                y2="130"
                stroke={tint}
                strokeOpacity="0.25"
                strokeWidth="7"
                strokeLinecap="round"
            />
            <line
                x1="69"
                y1="66"
                x2="69"
                y2="118"
                stroke="#ffffff"
                strokeOpacity="0.18"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}
