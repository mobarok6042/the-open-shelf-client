import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";


const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db();


export const auth = betterAuth({
    database: mongodbAdapter(db,{client}),
  
});