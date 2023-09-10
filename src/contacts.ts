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

	public all({
		page = 1,
		pageSize = 10,
	}: {
		page?: number;
		pageSize?: number;
	}): { contacts: Array<Contact>; total: number; totalPages: number } {
		const query = this.#db.prepare("select * from contacts limit ? offset ?");
		const contacts = query.all(pageSize, (page - 1) * pageSize);
		if (!Value.Check(t.Array(contactSchema), contacts)) {
			throw new Error("Invalid contacts");
		}

		const result = this.#db
			.prepare("select count(*) as total from contacts")
			.get();
		if (!Value.Check(t.Object({ total: t.Number() }), result)) {
			throw new Error("Invalid total");
		}
		const { total } = result;
		return {
			contacts,
			total,
			totalPages: Math.ceil(total / pageSize),
		};
	}

	public search({
		search,
		page = 1,
		pageSize = 10,
	}: { search: string; page?: number; pageSize?: number }): {
		contacts: Array<Contact>;
		total: number;
		totalPages: number;
	} {
		const query = this.#db.prepare(
			"select * from contacts where first_name like ? or last_name like ? limit ? offset ?",
		);
		const contacts = query.all(
			`%${search}%`,
			`%${search}%`,
			pageSize,
			(page - 1) * pageSize,
		);
		if (!Value.Check(t.Array(contactSchema), contacts)) {
			throw new Error("Invalid contacts");
		}

		const result = this.#db
			.prepare(
				"select count(*) as total from contacts where first_name like ? or last_name like ?",
			)
			.get(`%${search}%`, `%${search}%`);
		if (!Value.Check(t.Object({ total: t.Number() }), result)) {
			throw new Error("Invalid total");
		}
		const { total } = result;
		return {
			contacts,
			total,
			totalPages: Math.ceil(total / pageSize),
		};
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

	public update(id: number, contact: Omit<Contact, "id">): Contact {
		const query = this.#db.prepare(
			"update contacts set first_name = ?, last_name = ?, email = ?, phone_number = ? where id = ?",
		);
		query.run(
			contact.first_name,
			contact.last_name,
			contact.email,
			contact.phone_number,
			id,
		);
		return {
			...contact,
			id,
		};
	}

	public delete(id: number): void {
		const query = this.#db.prepare("delete from contacts where id = ?");
		query.run(id);
	}
}

export const db = new ContactsDb(
	Database.open("contacts.sqlite", {
		readwrite: true,
	}),
);
