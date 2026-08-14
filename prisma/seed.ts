import { PrismaClient } from '@prisma/client';
import { ADMIN_HIERARCHY } from '../src/data/adminHierarchy';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding admin hierarchy...');

  // 1. Divisions
  for (const div of ADMIN_HIERARCHY.divisions) {
    await prisma.division.upsert({
      where: { code: div.code },
      update: { nameBn: div.nameBn, nameEn: div.nameEn },
      create: { id: div.id, code: div.code, nameBn: div.nameBn, nameEn: div.nameEn },
    });
  }
  console.log(`  ✓ ${ADMIN_HIERARCHY.divisions.length} divisions`);

  // 2. Districts
  for (const dist of ADMIN_HIERARCHY.districts) {
    await prisma.district.upsert({
      where: { code: dist.code },
      update: { divisionId: dist.divisionId, nameBn: dist.nameBn, nameEn: dist.nameEn },
      create: {
        id: dist.id,
        divisionId: dist.divisionId,
        code: dist.code,
        nameBn: dist.nameBn,
        nameEn: dist.nameEn,
      },
    });
  }
  console.log(`  ✓ ${ADMIN_HIERARCHY.districts.length} districts`);

  // 3. Upazilas (batched for performance)
  const BATCH = 100;
  for (let i = 0; i < ADMIN_HIERARCHY.upazilas.length; i += BATCH) {
    const chunk = ADMIN_HIERARCHY.upazilas.slice(i, i + BATCH);
    await Promise.all(
      chunk.map((u) =>
        prisma.upazila.upsert({
          where: { code: u.code },
          update: { districtId: u.districtId, nameBn: u.nameBn, nameEn: u.nameEn },
          create: {
            id: u.id,
            districtId: u.districtId,
            code: u.code,
            nameBn: u.nameBn,
            nameEn: u.nameEn,
          },
        })
      )
    );
  }
  console.log(`  ✓ ${ADMIN_HIERARCHY.upazilas.length} upazilas`);

  // 4. Unions (batched — 4564 records)
  const UNION_BATCH = 200;
  for (let i = 0; i < ADMIN_HIERARCHY.unions.length; i += UNION_BATCH) {
    const chunk = ADMIN_HIERARCHY.unions.slice(i, i + UNION_BATCH);
    await Promise.all(
      chunk.map((u) =>
        prisma.union.create({
          data: {
            upazilaId: u.upazilaId,
            nameBn: u.nameBn,
            nameEn: u.nameEn,
          },
          skipDuplicates: true,
        })
      )
    );
  }
  console.log(`  ✓ ${ADMIN_HIERARCHY.unions.length} unions`);

  console.log('\nSeed complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
