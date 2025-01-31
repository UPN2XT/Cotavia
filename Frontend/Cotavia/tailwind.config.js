/** @type {import('tailwindcss').Config} */
const colors = [
  "violet-600", "indigo-600", "gray-400", "neutral-700",
  "emerald-500", "emerald-900", "fuchsia-500", "cyan-500",
  "blue-800", "indigo-900", "red-500", "orange-500",
  "teal-500", "teal-900", "sky-500", "blue-700",
  "green-700", "lime-800", "cyan-500", "purple-700",
  "fuchsia-800", "rose-600", "pink-700", "blue-500"
];

export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    ...colors.flatMap(color => [`from-${color}`, `to-${color}`]),
    "bg-gradient-to-r", "bg-gradient-to-bl", "bg-gradient-to-br",
    "border-l-blue-500"
  ]
}


