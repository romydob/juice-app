// src/app/auth/reset-password/page.tsx
import { connection } from "next/server";
import ResetForm from "./ResetForm";

export default async function ResetPasswordPage() {
  // This ensures the page waits for a request and disables prerendering
  await connection();

  return <ResetForm />;
}
