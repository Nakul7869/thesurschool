import { Suspense } from "react";
import { LogoMark } from "@/components/brand/logo";
import { LoginForm } from "./login-form";

export default function LoginPage(props: PageProps<"/admin/login">) {
  return (
    <div className="mx-auto grid min-h-dvh w-full max-w-md content-center gap-6 px-4 py-12">
      <LogoMark className="h-16 w-auto text-accent" label="The Sur School" />
      <h1 className="font-display text-4xl font-black">Admin sign in</h1>
      <Suspense fallback={null}>
        <Notice searchParams={props.searchParams} />
      </Suspense>
      <LoginForm />
    </div>
  );
}

async function Notice({ searchParams }: Pick<PageProps<"/admin/login">, "searchParams">) {
  const { reason } = await searchParams;
  if (reason !== "not-admin") return null;
  return (
    <p role="alert" className="rounded-lg bg-red-100 px-4 py-3 text-sm font-semibold text-red-900">
      This account is not allowed to manage the site. Sign in with the admin email.
    </p>
  );
}
