import { redirect } from 'next/navigation';

export default async function EinstellungenPage() {
  // Redirect to the new display settings page
  redirect('/konto/darstellung');
}