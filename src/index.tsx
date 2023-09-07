import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { Elysia, t } from "elysia";
import { db, type Contact } from "~/contacts.ts";
import { Contacts } from "~/contacts.tsx";
import { flash } from "~/flash";
import { NewContact } from "~/new-contact.tsx";

const app = new Elysia()
	// @ts-expect-error
	.use(html())
	.use(staticPlugin())
	.get("/", (context) => {
		context.set.redirect = "/contacts";
	})
	.get(
		"/contacts",
		({ query }) => {
			const search = query.q;
			const contacts = search ? db.search(search) : db.all();
			return <Contacts contacts={contacts} search={search} />;
		},
		{
			query: t.Object({
				q: t.Optional(t.String()),
			}),
		},
	)
	.get("/contacts/new", () => {
		return <NewContact />;
	})
	.post(
		"/contacts/new",
		(context) => {
			db.create(context.body);
			flash.success("Created new contact!");
			context.set.redirect = "/contacts";
		},
		{
			body: t.Object({
				first_name: t.String({
					minLength: 1,
				}),
				last_name: t.String({
					minLength: 1,
				}),
				email: t.String({
					minLength: 1,
				}),
				phone_number: t.String({
					minLength: 1,
				}),
			}),
			error: (context) => {
				if (context.code !== "VALIDATION") {
					return;
				}

				const errors: Record<keyof Omit<Contact, "id">, string> = {
					first_name: "",
					last_name: "",
					email: "",
					phone_number: "",
				};
				for (let i = 0; i < context.error.all.length; i++) {
					const error = context.error.all[i];
					const prop = error.path.slice(1);
					errors[prop as keyof Omit<Contact, "id">] = error.message;
				}
				context.set.headers["Content-Type"] = "text/html";
				return (
					<NewContact
						defaultValues={context.error.value as Omit<Contact, "id">}
						errors={errors}
					/>
				);
			},
		},
	)
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);