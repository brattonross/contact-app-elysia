import type { PropsWithChildren } from "@kitajs/html";

export function Layout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Contact App</title>
				<link rel="stylesheet" href="/public/styles.css" />
				<script src="https://unpkg.com/htmx.org@1.9.5" />
			</head>
			<body class="bg-white text-slate-12 antialiased dark:bg-slate-1">
				{children}
			</body>
		</html>
	);
}
