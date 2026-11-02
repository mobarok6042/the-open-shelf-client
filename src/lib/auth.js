import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    user: {
        additionalFields: {
            username: {
                type: "string",
                required: false,
                unique: true,
                input: true,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    socialProviders: {
        trustedOrigins: [
            "http://localhost:3000",
            "https://the-open-shelf-frontend.vercel.app",
            "https://the-open-shelf-frontend-896zm1lfa-mobarok-hossens-projects.vercel.app",
        ],
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
            requireLocalEmailVerified: false,
        },
    },
    plugins: [jwt({ jwt: { expirationTime: "15m" } })],
    database: mongodbAdapter(client.db(), { client }),
});