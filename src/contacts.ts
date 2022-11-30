import { ContactType } from "./types/ContactType";
import localforage from "localforage";
import { matchSorter } from "match-sorter";
/* @ts-ignore */
import sortBy from "sort-by";
export async function getContacts(query: string = "") {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = (await localforage.getItem("contacts")) as ContactType[];
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ["first", "last"],
    });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}
export async function createContact() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let contact = {
    id,
    createdAt: Date.now(),
  } as unknown as ContactType;
  let contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}
export async function getContact(id: string | number) {
  await fakeNetwork(`contact:${id}`);
  let contacts = (await localforage.getItem("contacts")) as ContactType[];
  let contact = contacts.find((contact) => contact.id === id);
  return contact ?? null;
}
export async function updateContact(
  id: string | number,
  updates: Partial<ContactType>
) { 
  await fakeNetwork();
  let contacts = (await localforage.getItem("contacts")) as ContactType[];
  let contact = contacts!.find((contact) => contact.id === id);
  if (!contact) throw new Error("No contact found for", id as any);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}
export async function deleteContact(id: string | number) {
  let contacts = (await localforage.getItem("contacts")) as ContactType[];
  let index = contacts!.findIndex((contact) => contact.id === id);
  if (index > -1) {
    contacts!.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}
function set(contacts: ContactType[]) {
  return localforage.setItem("contacts", contacts);
}
// fake a cache so we don't slow down stuff we've already seen
let fakeCache: any = {};
async function fakeNetwork(key: any = "") {
  if (!key) {
    fakeCache = {};
  }
  if (fakeCache[key]) {
    return;
  }
  fakeCache[key] = true;
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}
