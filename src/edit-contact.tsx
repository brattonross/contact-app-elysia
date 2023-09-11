import type { Contact } from "./contacts";
import { Layout } from "./layout";

export function EditContact({
	defaultValues,
	errors,
}: {
	defaultValues: Contact;
	errors?: Record<keyof Omit<Contact, "id">, string>;
}) {
	return (
		<Layout>
			<form action={`/contacts/${defaultValues.id}/edit`} method="POST">
				<fieldset>
					<legend>Contact Values</legend>
					<div>
						<label for="first_name">First Name</label>
						<input
							id="first_name"
							name="first_name"
							type="text"
							value={defaultValues.first_name}
						/>
						<span id="first_name_error">{errors?.first_name}</span>
					</div>
					<div>
						<label for="last_name">Last Name</label>
						<input
							id="last_name"
							name="last_name"
							type="text"
							value={defaultValues.last_name}
						/>
						<span id="last_name_error">{errors?.last_name}</span>
					</div>
					<div>
						<label for="email">Email</label>
						<input
							id="email"
							hx-get={`/contacts/${defaultValues.id}/email`}
							hx-target="#email_error"
							hx-trigger="change, keyup delay:300ms changed"
							name="email"
							type="email"
							value={defaultValues.email}
						/>
						<span id="email_error">{errors?.email}</span>
					</div>
					<div>
						<label for="phone_number">Phone Number</label>
						<input
							id="phone_number"
							name="phone_number"
							type="tel"
							value={defaultValues.phone_number}
						/>
						<span id="phone_number_error">{errors?.phone_number}</span>
					</div>
				</fieldset>
				<button type="submit">Submit</button>
			</form>
			<button
				id="edit-delete-button"
				hx-delete={`/contacts/${defaultValues.id}`}
				hx-push-url="true"
				hx-confirm="Are you sure you want to delete this contact?"
				hx-target="body"
				type="button"
			>
				Delete
			</button>
			<div>
				<a href="/contacts">Back</a>
			</div>
		</Layout>
	);
}
