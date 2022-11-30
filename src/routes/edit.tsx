import {
  Form,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";

import { ContactType } from "../types/ContactType";
import { updateContact } from "../contacts";

export async function action({ params, request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const { contactId } = params as { contactId: string };
  await updateContact(contactId, updates);
  return redirect(`/contacts/${contactId}`);
}

export default function EditContact() {
  const contact = useLoaderData() as ContactType;
  const navigate = useNavigate();
  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact.notes} rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
