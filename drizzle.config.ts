import { defineConfig } from 'drizzle-kit';

const connectionString = process.env.DATABASE_NAME || process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_NAME or DATABASE_URL environment variable is not set');
}

export default defineConfig({
	schema: './src/lib/db/schemas/*.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		connectionString: connectionString
	}
});

