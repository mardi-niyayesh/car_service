import {execSync} from 'node:child_process';
import * as readline from 'node:readline/promises';

(async (): Promise<void> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let migrationName: string = process.argv[2];

    if (!migrationName) {
        const answer: string = await rl.question('enter migration name (default = init): ');
        migrationName = answer.trim() || 'init';
    }

    console.log(`Running migration: ${migrationName}...`);

    try {
        execSync(`npx prisma migrate dev --name ${migrationName}`, {stdio: 'inherit'});
        execSync(`npx prisma generate`, {stdio: 'inherit'});

        console.log('Migration and Prisma Client generation done!');
    } catch (e) {
        console.log(`Error: ${e}`);
        process.exit(1);
    } finally {
        rl.close();
    }
})().catch(r => console.error(r));
