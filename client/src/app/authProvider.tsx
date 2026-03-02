import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

const cognitoConfig = {
  userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
  userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
};

const isConfigured =
  !!cognitoConfig.userPoolId &&
  !!cognitoConfig.userPoolClientId &&
  !!cognitoConfig.region;

if (isConfigured) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: cognitoConfig.userPoolId!,
        userPoolClientId: cognitoConfig.userPoolClientId!,
      },
    },
  });
} else {
  console.warn(
    "Cognito not configured. Set NEXT_PUBLIC_USER_POOL_ID, NEXT_PUBLIC_USER_POOL_CLIENT_ID and NEXT_PUBLIC_AWS_REGION"
  );
}

const formFields = {
  signUp: {
    username: {
      order: 1,
      placeholder: "Choose a username",
      label: "Username",
      inputProps: { required: true },
    },
    email: {
      order: 2,
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
  if (!isConfigured) {
    return <>{children}</>;
  }

  return (
    <Authenticator formFields={formFields}>
      {({ user }: any) => (user ? <>{children}</> : <div>Please sign in</div>)}
    </Authenticator>
  );
};

export default AuthProvider;