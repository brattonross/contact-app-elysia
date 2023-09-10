import type { PropsWithChildren } from "@kitajs/html";
import { flash } from "./flash";

export function Layout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Contact App</title>
				<link rel="stylesheet" href="/public/styles.css" />
				<script src="https://unpkg.com/htmx.org@1.9.5" />
				<script src="https://unpkg.com/hyperscript.org@0.9.11" />
			</head>
			<body class="bg-white text-slate-12 antialiased dark:bg-slate-1">
				{children}
				<div class="fixed bottom-0 right-0 p-4">
					<ul class="flex flex-col gap-2">
						{flash.all().map((message) => (
							<li
								class="bg-slate-3 border-slate-6 text-white rounded-lg px-4 py-2.5"
								_="on load wait 3s then remove me"
							>
								{message.message}
							</li>
						))}
					</ul>
				</div>
			</body>
		</html>
	);
}
