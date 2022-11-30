import {
  Form,
  LoaderFunctionArgs,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { createContact, getContacts } from "../contacts";

import { ContactType } from "../types/ContactType";
import React from "react";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q!);
  return { contacts, q };
}

export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}
export default function Root() {
  const navigation = useNavigation();
  const { contacts, q } = useLoaderData() as {
    contacts: ContactType[];
    q: string;
  };
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");
  const searchInput = React.createRef<HTMLInputElement>();
  const [query, setQuery] = React.useState<string>(q || "");
  const submit = useSubmit();
  React.useEffect(() => {
    document.title = "Contacts";
    searchInput.current!.value = q!;
  }, [q]);
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              className={searching ? "loading" : ""}
              ref={searchInput}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                const firstSearch = q == null;
                submit(e.target.form, { replace: !firstSearch });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
