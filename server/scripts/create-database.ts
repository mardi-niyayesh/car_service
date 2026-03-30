import {Client} from "pg";
import * as readline from "node:readline/promises";
import {stdin as input, stdout as output} from "node:process";

async function getInput(rl: readline.Interface, question: string, defaultValue: string = ""): Promise<string> {
  const answer = (await rl.question(question)).trim();
  return answer || defaultValue;
}

async function getDbName(rl: readline.Interface, client: Client): Promise<string | null> {
  while (true) {
    const dbName = await getInput(rl, "Enter Database name (default = car_service): ", "car_service");
    const res = await client.query("SELECT datname FROM pg_database WHERE datname = $1", [dbName]);

    if (res.rows.length > 0) {
      const answer: string = await getInput(rl, `Database ${dbName} already exists. change db Name? (y/N): `, "N");

      if (answer.toLowerCase() === "y") {
        continue;
      } else {
        return null;
      }
    }

    return dbName;
  }
}

async function main(): Promise<void> {
  console.log("=========================================");
  console.log("Created PostgreSQL Database and Collation");
  console.log("=========================================");

  const rl = readline.createInterface({input, output});

  const userName: string = await getInput(rl, "Enter Database username (default = postgres): ", "postgres");
  const password = await getInput(rl, "Enter Database password: ");

  const client: Client = new Client({
    user: userName,
    database: "postgres",
    password: password.trim() || undefined,
    host: "localhost",
    port: 5432
  });

  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL.");

    const database: string | null = await getDbName(rl, client);

    if (database === null) {
      console.log("❌ Cancelled.");
      process.exit(0);
    }

    const safeName: string = database.replace(/"/g, '""');

    const dbOwner: string = await getInput(rl, "Enter Database owner role (default = postgres): ", "postgres");

    await client.query(`
      CREATE DATABASE "${safeName}"
      ENCODING 'UTF8'
      LC_COLLATE 'en_US.UTF-8'
      LC_CTYPE 'en_US.UTF-8'
      TEMPLATE template0
      OWNER "${dbOwner.replace(/"/g, '""')}"
    `);
    console.log("✅ Database created successfully!");

    const clientDB: Client = new Client({
      user: userName,
      database,
      password: password.trim() || undefined,
      host: "localhost",
      port: 5432
    });
    await clientDB.connect();

    try {
      await clientDB.query(`CREATE COLLATION IF NOT EXISTS "ar_SA.utf8" (LOCALE = 'ar_SA.utf8')`);
      await clientDB.query(`CREATE COLLATION IF NOT EXISTS "ar_SA" (LOCALE = 'ar_SA.utf8')`);
      console.log("→ Collations created (or already exist)");
    } catch (e) {
      console.warn("Warning: Collations not created (locale probably missing, but db created): ", (e as Error).message);
    }

    await clientDB.end();
    console.log("\n🎉 All done!");

  } catch (e) {
    console.error("❌ Error: ", (e as Error).message || "Something went wrong");
    process.exit(1);

  } finally {
    rl.close();
  }
}

main()
  .catch(e => console.error(e));
