import { LoaderFunctionArgs, redirect } from "react-router-dom";

import { deleteContact } from "../contacts";

export async function action({ params }: LoaderFunctionArgs) {
  const { contactId } = params as { contactId: string };
  await deleteContact(contactId);
  return redirect("/");
}
