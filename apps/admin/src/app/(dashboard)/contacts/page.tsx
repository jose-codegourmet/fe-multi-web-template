import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { contactsQueryKey } from "@/hooks/use-contacts/query";
import { fetchContacts } from "@/hooks/use-contacts/server";
import { ContactsList } from "./contacts-list/ContactsList";

export default async function ContactsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: contactsQueryKey.list(), queryFn: fetchContacts });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContactsList />
    </HydrationBoundary>
  );
}
