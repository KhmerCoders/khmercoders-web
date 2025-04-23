"use client";

import { signIn, signOut } from "@/utils/auth-client";
import { Button } from "../generated/button";
import { GithubIcon } from "./icons";

export function SignInButton() {
  return (
    <Button
      onClick={() => signIn()}
      className="text-black bg-yellow-500 hover:bg-yellow-500/90"
    >
      <GithubIcon className="w-4 h-4" />
      Sign in
    </Button>
  );
}

export default SignInButton;

export function SignOutButton() {
  return <Button onClick={() => signOut()}>Sign out</Button>;
}

