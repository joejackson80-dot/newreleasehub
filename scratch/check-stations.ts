import { prisma } from '../apps/web/src/lib/prisma';

async function main() {
  const stations = await prisma.station.findMany();
  console.log(JSON.stringify(stations, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
