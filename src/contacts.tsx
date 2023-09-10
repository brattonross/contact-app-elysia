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
				<form action="/contacts" method="GET">
					<label for="search">Search</label>
					<input id="search" name="q" type="search" value={search} />
					<button type="submit">Search</button>
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
						{contacts.map((contact) => (
							<tr key={contact.id}>
								<td>{contact.first_name}</td>
								<td>{contact.last_name}</td>
								<td>{contact.phone_number}</td>
								<td>{contact.email}</td>
								<td>
									<a href={`/contacts/${contact.id}/edit`}>Edit</a>
									<a href={`/contacts/${contact.id}`}>View</a>
								</td>
							</tr>
						))}
						{page < totalPages ? (
							<tr>
								<td colspan={5} class="text-center">
									<button
										hx-target="closest tr"
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
