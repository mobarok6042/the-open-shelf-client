import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);

export const auth = betterAuth({
    user: {
        additionalFields: {
            username: {
                type: "string",
                required: true,
                unique: true,
                input: true,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    database: mongodbAdapter(client.db(), { client }),
});