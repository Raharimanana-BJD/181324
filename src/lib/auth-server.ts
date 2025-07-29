"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { client } from "./auth-client";
import db from "./prisma";

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  return session;
};

export const getUser = async () => {
  const session = await getSession();
  return session.user;
};

export const getOrganization = async () => {
  const session = await getSession();

  const organizations = await client.organization.list();

  const currentUser = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!currentUser) {
    return redirect("/sign-in");
  }

  return {
    organizations,
    currentUser,
  };
};

export const logoutAction = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/sign-in");
};
