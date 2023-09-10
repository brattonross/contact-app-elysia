import type { Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { t } from "elysia";
import { Database } from "bun:sqlite";

const contactSchema = t.Object({
	id: t.Number(),
	first_name: t.String(),
	last_name: t.String(),
	email: t.String(),
	phone_number: t.String(),
});

export type Contact = Static<typeof contactSchema>;

class ContactsDb {
	#db: Database;

	public constructor(db: Database) {
		this.#db = db;
	}

	public all(): Array<Contact> {
		const query = this.#db.prepare("select * from contacts");
		const contacts = query.all();
		if (!Value.Check(t.Array(contactSchema), contacts)) {
			throw new Error("Invalid contacts");
		}
		return contacts;
	}

	public search(term: string): Array<Contact> {
		const query = this.#db.prepare(
			"select * from contacts where first_name like ? or last_name like ? or email like ? or phone_number like ?",
		);
		const q = `%${term}%`;
		const contacts = query.all(q, q, q, q);
		if (!Value.Check(t.Array(contactSchema), contacts)) {
			throw new Error("Invalid contacts");
		}
		return contacts;
	}

	public create(contact: Omit<Contact, "id">): Contact {
		const query = this.#db.prepare(
			"insert into contacts (first_name, last_name, email, phone_number) values (?, ?, ?, ?) returning id",
		);
		const result = query.get(
			contact.first_name,
			contact.last_name,
			contact.email,
			contact.phone_number,
		) as { id: number };
		return {
			...contact,
			id: result.id,
		};
	}

	public find(id: number): Contact | null {
		const query = this.#db.prepare("select * from contacts where id = ?");
		const contact = query.get(id);
		if (!contact) {
			return null;
		}
		if (!Value.Check(contactSchema, contact)) {
			throw new Error("Invalid contact");
		}
		return contact;
	}
}

export const db = new ContactsDb(
	Database.open("contacts.sqlite", {
		readwrite: true,
	}),
);
