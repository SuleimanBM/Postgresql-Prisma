import { Client } from "pg";

const client = new Client({
    connectionString: "postgresql://postgres.kpyqjisrotzbxzutzsbp:Yellow24%280%29%26%26240@aws-1-eu-north-1.pooler.supabase.com:5432/postgres",
    ssl: {
        rejectUnauthorized: false,
    },
});

async function main() {
    try {
        await client.connect();
        const res = await client.query("SELECT NOW()");
        console.log("Connected:", res.rows[0]);
        await client.end();
    } catch (err) {
        console.error("Connection error:", err);
    }
}

main();
