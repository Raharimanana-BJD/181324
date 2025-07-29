import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { toast } from "sonner";

export const client = createAuthClient({
  baseURL: "http://localhost:3000",
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error("Too many requests. Please try again later.");
      }
    },
  },
  plugins: [organizationClient()],
});

export const {
  signUp,
  signIn,
  signOut,
  useSession,
  forgetPassword,
  sendVerificationEmail,
  updateUser,
  deleteUser,
  // organization,
  // useListOrganizations,
  // useActiveOrganization,
} = client;
