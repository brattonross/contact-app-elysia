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
					</tbody>
				</table>
				<div>
					{page > 1 ? (
						<a href={`/contacts?page=${page - 1}`}>Previous</a>
					) : null}
					{page < totalPages ? (
						<a href={`/contacts?page=${page + 1}`}>Next</a>
					) : null}
				</div>
				<p>
					<a href="/contacts/new">Add Contact</a>
				</p>
			</div>
		</Layout>
	);
}
