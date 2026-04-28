import { defineConfig } from '@prisma/config';

const DIRECT_URL = "postgresql://postgres.vrqhvndemhajrggcaudm:7TPZTS68BJAF2P2y@aws-1-us-east-2.pooler.supabase.com:5432/postgres";

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: DIRECT_URL,
  },
});
