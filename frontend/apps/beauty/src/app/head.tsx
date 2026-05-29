import React from "react";

export default function Head() {
  const verification =
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
    "UHZdMrBhQF3dvWgVJdoX80gBYIQW8RvKpT_u-sdbFJo";

  return (
    <>
      <meta name="google-site-verification" content={verification} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
}
