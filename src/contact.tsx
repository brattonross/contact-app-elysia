import type { Contact } from "./contacts";
import { Layout } from "./layout";

export function ViewContact({
	contact,
}: {
	contact: Contact;
}) {
	return (
		<Layout>
			<h1>
				{contact.first_name} {contact.last_name}
			</h1>
			<div>
				<p>{contact.email}</p>
				<p>{contact.phone_number}</p>
			</div>
			<div>
				<a href={`/contacts/${contact.id}/edit`}>Edit</a>
				<a href="/contacts">Back</a>
			</div>
		</Layout>
	);
}
