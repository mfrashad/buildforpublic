// Clerk JWT issuer domain.
// Find it in your Clerk Dashboard → API Keys → JWT Templates → Issuer URL.
// Format: https://<your-clerk-frontend-api>.clerk.accounts.dev
// Set as a Convex environment variable: npx convex env set CLERK_JWT_ISSUER_DOMAIN "https://..."
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN as string,
      applicationID: "convex",
    },
  ],
};
