import type { Contact } from "~/contacts";
import { Layout } from "./layout";

export function Contacts({
	contacts,
	page = 1,
	search,
	totalPages = 1,
}: {
	contacts: Array<Contact>;
	page?: number;
	search?: string;
	totalPages?: number;
}) {
	return (
		<Layout>
			<div>
				<form action="/contacts" method="GET" class="flex items-center gap-2">
					<label for="search">Search</label>
					<input
						id="search"
						hx-get="/contacts"
						hx-trigger="search, keyup delay:200ms changed"
						hx-target="tbody"
						hx-select="tbody tr"
						hx-push-url="true"
						hx-indicator="#spinner"
						name="q"
						type="search"
						value={search}
					/>
					<button type="submit">Search</button>
					<span id="spinner" class="htmx-indicator">
						<svg
							class="animate-spin h-6 w-6 text-white"
							fill="none"
							viewBox="0 0 24 24"
						>
							<title>Loading...</title>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							/>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					</span>
				</form>
				<table>
					<thead>
						<tr>
							<th>First</th>
							<th>Last</th>
							<th>Phone</th>
							<th>Email</th>
							<th />
						</tr>
					</thead>
					<tbody>
						<Rows contacts={contacts} />
						{page < totalPages ? (
							<tr>
								<td colspan={5} class="text-center">
									<button
										hx-target="closest tr"
										hx-trigger="revealed"
										hx-swap="outerHTML"
										hx-select="tbody > tr"
										hx-get={`/contacts?page=${page + 1}`}
										type="button"
									>
										Load more
									</button>
								</td>
							</tr>
						) : null}
					</tbody>
				</table>
				<p>
					<a href="/contacts/new">Add Contact</a>
				</p>
			</div>
		</Layout>
	);
}

export function Rows({ contacts }: { contacts: Array<Contact> }) {
	return (
		<>
			{contacts.map((contact) => (
				<tr
					key={contact.id}
					class="[&.htmx-swapping]:opacity-0 [&.htmx-swapping]:transition-opacity [&.htmx-swapping]:duration-1000 [&.htmx-swapping]:ease-out"
				>
					<td>{contact.first_name}</td>
					<td>{contact.last_name}</td>
					<td>{contact.phone_number}</td>
					<td>{contact.email}</td>
					<td>
						<a href={`/contacts/${contact.id}/edit`}>Edit</a>
						<a href={`/contacts/${contact.id}`}>View</a>
						<button
							hx-delete={`/contacts/${contact.id}`}
							hx-swap="outerHTML swap:1s"
							hx-confirm="Are you sure you want to delete this contact?"
							hx-target="closest tr"
							type="button"
						>
							Delete
						</button>
					</td>
				</tr>
			))}
		</>
	);
}
