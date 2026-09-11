export default function StarRating({ value, size = 14 }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <svg
                    key={n}
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill={n <= Math.round(value) ? '#bf8438' : 'none'}
                    stroke="#bf8438"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                </svg>
            ))}
        </div>
    );
}
