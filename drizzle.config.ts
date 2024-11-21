import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./configs/schema.ts",
    out: "./drizzle.config.ts",
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://neondb_owner:XMsKf1P7OLbQ@ep-mute-shadow-a1cesem8.ap-southeast-1.aws.neon.tech/Form-Builder?sslmode=require',
    },
});

