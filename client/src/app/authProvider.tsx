import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

const authConfig = {
  Auth: {
    // AWS region for the Cognito user pool
    region: process.env.NEXT_PUBLIC_COGNITO_REGION || "",
    // Cognito user pool id (eg. us-east-1_xxxxx)
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
    // Web client id for the user pool (the correct key name for Amplify)
    userPoolWebClientId:
      process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
  },
};

if (!authConfig.Auth.userPoolId || !authConfig.Auth.userPoolWebClientId) {
  // Friendly console warning for missing config — the UI will show an error otherwise
  // Keep this as a client-side warning; do not throw so app can still render in non-auth mode.
  // Developer should set NEXT_PUBLIC_COGNITO_REGION, NEXT_PUBLIC_COGNITO_USER_POOL_ID and
  // NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID in their environment (Render/Netlify/Vercel/etc.).
  // eslint-disable-next-line no-console
  console.warn(
    "Cognito User Pool not configured. Set NEXT_PUBLIC_COGNITO_REGION, NEXT_PUBLIC_COGNITO_USER_POOL_ID and NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID"
  );
}

Amplify.configure(authConfig);

const formFields = {
  signUp: {
    username: {
      order: 1,
      placeholder: "Choose a username",
      label: "Username",
      inputProps: { required: true },
    },
    email: {
      order: 1,
      placeholder: "Enter your email address",
      label: "Email",
      inputProps: { type: "email", required: true },
    },
    password: {
      order: 3,
      placeholder: "Enter your password",
      label: "Password",
      inputProps: { type: "password", required: true },
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      inputProps: { type: "password", required: true },
    },
  },
};

const AuthProvider = ({ children }: any) => {
  return (
    <div>
      <Authenticator formFields={formFields}>
        {({ user }: any) =>
          user ? (
            <div>{children}</div>
          ) : (
            <div>
              <h1>Please sign in below:</h1>
            </div>
          )
        }
      </Authenticator>
    </div>
  );
};

export default AuthProvider;
