import { PrismaClient } from '@prisma/client'

// PrismaClient tipini al
const prismaClientSingleton = () => {
  let url = process.env.DATABASE_URL;
  
  // Auto-patch for NeonDB/PgBouncer in serverless environments
  if (url && !url.includes('localhost') && !url.includes('pgbouncer=true')) {
    url += (url.includes('?') ? '&' : '?') + 'pgbouncer=true';
    console.log('Using patched DATABASE_URL with pgbouncer=true');
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
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
