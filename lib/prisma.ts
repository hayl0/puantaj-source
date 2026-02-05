import { PrismaClient } from '@prisma/client'

// PrismaClient tipini al
const prismaClientSingleton = () => {
  // Build time check to prevent errors when DATABASE_URL is missing
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return new PrismaClient()
  }

  let url = process.env.DATABASE_URL;
  
  // Fallback for build phase or missing env
  if (!url) {
    console.warn('DATABASE_URL is missing, using empty string for Prisma initialization to prevent build crash.');
    url = "postgresql://dummy:dummy@localhost:5432/dummy";
  } else {
     // Auto-patch for NeonDB/PgBouncer in serverless environments
     if (!url.includes('localhost') && !url.includes('pgbouncer=true')) {
        url += (url.includes('?') ? '&' : '?') + 'pgbouncer=true';
        console.log('Using patched DATABASE_URL with pgbouncer=true');
     }
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  })
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
