import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				coffee: {
					light: "#fdf6ee",
					DEFAULT: "#c69c6d",
					dark: "#6f4e37",
				},
			},
			fontFamily: {
				serif: ["'Playfair Display'", "serif"],
			},
		},
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
				coffeehouse: {
					primary: "#5C4033",      // Rich Coffee Brown
					secondary: "#D7B49E",    // Latte Beige
					accent: "#A47551",       // Espresso
					neutral: "#3B2F2F",      // Deep Roast
					"base-100": "#FCF5ED",   // Cream Background
					info: "#9D6B53",         // Mocha Hint
					success: "#6F4E37",      // Medium Roast
					warning: "#E1B382",      // Toasted Almond
					error: "#A0522D",        // Burnt Cinnamon
				},
			},
		],
	},
};
