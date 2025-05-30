/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-green': '#10B981',
                'primary-green-dark': '#059669',
                'border-gray': '#E5E7EB',
                'text-dark': '#1F2937',
                'text-light': '#6B7280',
                'light-gray': '#F3F4F6',
                'error-red': '#EF4444',
                'warning-yellow': '#F59E0B',
                'success-green': '#10B981',
            },
            animation: {
                'spin': 'spin 1s linear infinite',
            },
            keyframes: {
                spin: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
            },
        },
    },
    plugins: [],
}; 