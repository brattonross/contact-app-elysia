import { Database } from "bun:sqlite";
import { faker } from "@faker-js/faker";

const db = new Database("contacts.sqlite");

db.run(`
  drop table if exists contacts
`);

db.run(`
  create table if not exists contacts (
    id integer primary key autoincrement,
    first_name text not null,
    last_name text not null,
    email text not null,
    phone_number text not null
  )
`);

const insert = db.prepare(`
  insert into contacts (first_name, last_name, email, phone_number)
  values (?, ?, ?, ?)
`);

for (let i = 0; i < 300; i++) {
	const firstName = faker.person.firstName();
	const lastName = faker.person.lastName();
	insert.run(
		faker.person.firstName(),
		faker.person.lastName(),
		faker.internet.email({ firstName, lastName }),
		faker.phone.number(),
	);
}

db.close();
