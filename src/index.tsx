import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { Elysia, t } from "elysia";
import { db, type Contact } from "~/contacts.ts";
import { Contacts, Rows } from "~/contacts.tsx";
import { flash } from "~/flash";
import { NewContact } from "~/new-contact.tsx";
import { ViewContact } from "./contact";
import { EditContact } from "./edit-contact";

const app = new Elysia()
	// @ts-expect-error
	.use(html())
	.use(staticPlugin())
	.get("/", (context) => {
		context.set.redirect = "/contacts";
	})
	.get("/contacts", ({ query, request }) => {
		const search = typeof query.q === "string" ? query.q : undefined;
		const page = Number(query.page) || 1;
		const { contacts, totalPages } = search
			? db.search({ search, page })
			: db.all({ page });

		if (search && request.headers.get("HX-Trigger") === "search") {
			return <Rows contacts={contacts} />;
		}

		return (
			<Contacts
				contacts={contacts}
				page={page}
				search={search}
				totalPages={totalPages}
			/>
		);
	})
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
	.get("/contacts/:id", (context) => {
		const contact = db.find(Number(context.params.id));
		if (!contact) {
			context.set.status = 404;
			return <div>Not Found</div>;
		}
		return <ViewContact contact={contact} />;
	})
	.get(
		"/contacts/:id/email",
		(context) => {
			const contact = db.find(Number(context.params.id));
			if (!contact) {
				context.set.status = 404;
				return <div>Not Found</div>;
			}
			const { contacts } = db.search({
				search: contact.email,
			});
			if (contacts.length > 1 || contacts.some((c) => c.id !== contact.id)) {
				return "Email already in use.";
			}
			return "";
		},
		{
			query: t.Object({
				email: t.String(),
			}),
		},
	)
	.get("/contacts/:id/edit", (context) => {
		const contact = db.find(Number(context.params.id));
		if (!contact) {
			context.set.status = 404;
			return <div>Not Found</div>;
		}
		return <EditContact defaultValues={contact} />;
	})
	.post(
		"/contacts/:id/edit",
		(context) => {
			db.update(Number(context.params.id), context.body);
			flash.success("Updated contact!");
			context.set.redirect = `/contacts/${context.params.id}`;
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
					format: "email",
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
				const pathname = new URL(context.request.url).pathname.split("/");
				const id = pathname[pathname.length - 2];
				return (
					<EditContact
						defaultValues={{
							...(context.error.value as Omit<Contact, "id">),
							id: Number(id),
						}}
						errors={errors}
					/>
				);
			},
		},
	)
	.delete("/contacts/:id", (context) => {
		db.delete(Number(context.params.id));
		flash.success("Deleted contact!");
		return new Response(null, {
			status: 303,
			headers: {
				Location: "/contacts",
			},
		});
	})
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
