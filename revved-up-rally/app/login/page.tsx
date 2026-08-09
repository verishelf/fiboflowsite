import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-white/50">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
