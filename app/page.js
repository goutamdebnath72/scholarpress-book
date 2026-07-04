// app/page.js
// The bare root "/" has no locale, so send visitors to the default locale.
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/en");
}
