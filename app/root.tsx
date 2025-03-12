import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { useFormData } from "./form";

import "./tailwind.css";

export const links: LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	const hasBonusForm = useFormData(
		"bonus",
		(formData: FormData | null) => formData !== null
	);
	const isBonusFormdirty = useFormData("bonus", (formData: FormData | null) => {
		if (!formData) return false;

		return Array.from(formData.values()).every((value) => value !== "");
	});

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<div className="flex flex-col h-screen items-center justify-center">
					<div className="flex flex-col items-center justify-between gap-16">
						{children}
					</div>
					{hasBonusForm ? (
						<div className="fixed bottom-0 p-8">
							<button
								className="border p-8 border-orange-500 disabled:opacity-25"
								form="bonus"
								disabled={!isBonusFormdirty}
							>
								Buy it now
							</button>
						</div>
					) : null}
				</div>

				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
