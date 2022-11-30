import {
  Form,
  LoaderFunctionArgs,
  useFetcher,
  useLoaderData,
} from "react-router-dom";
import { getContact, updateContact } from "../contacts";

import { ContactType } from "../types/ContactType";
import React from "react";

export async function loader({ params }: LoaderFunctionArgs) {
  const { contactId } = params as { contactId: string };
  return await getContact(contactId);
}

export async function action({ request, params }: LoaderFunctionArgs) {
  const id = params.contactId;
  const formData = await request.formData();
  return updateContact(id!, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Contact() {
  const contact = useLoaderData() as ContactType;

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar} />
      </div>
      {/* <div>{contact.id}</div> */}
      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

type FavProps = { contact: ContactType };

function Favorite({ contact }: FavProps): JSX.Element {
  // yes, this is a `let` for later
  let favorite = contact.favorite;
  const fetcher = useFetcher();
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
