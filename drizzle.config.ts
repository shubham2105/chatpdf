import { Config } from "drizzle-kit";
import * as dotenv from 'dotenv';
dotenv.config({path:".env"})


export default {
    schema:"./src/lib/db/schema.ts",
    dialect:"postgresql",
    // driver:"pg",
    dbCredentials:{
        url: process.env.DATABASE_URL!,
    }
} satisfies Config