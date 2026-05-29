"use client";
import React from "react";

export default function Head() {
  const verification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  return (
    <>
      {verification ? (
        <meta name="google-site-verification" content={verification} />
      ) : null}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
}
