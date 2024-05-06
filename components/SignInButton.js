"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import styles from "../styles/signInButton.module.css";

function SignInButton() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <button
        className={styles.btn1}
        onClick={() => signOut()}
      >
        {session.user.name} Log Out
      </button>
    );
  }

  return (
    <button
      className={styles.btn2}
      onClick={() => signIn()}
    >
      LogIn
    </button>
  );
}

export default SignInButton;