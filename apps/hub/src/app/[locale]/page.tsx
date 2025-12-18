import { redirect } from 'next/navigation'

export default function LocaleHomePage() {
  // Redirect to dashboard - the middleware handles locale prefixing
  redirect('/dashboard')
}
