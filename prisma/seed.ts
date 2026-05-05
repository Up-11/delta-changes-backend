import {
  PrismaClient,
  MediaType,
  FinishingType,
  InfrastructureCategory,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database...');
  // Order matters due to foreign keys
  await prisma.application.deleteMany();
  await prisma.media.deleteMany();
  await prisma.apartment.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.featureItem.deleteMany();
  await prisma.infrastructurePoint.deleteMany();
  await prisma.constructionProgress.deleteMany();
  await prisma.object.deleteMany();
  await prisma.project.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.news.deleteMany();
  await prisma.manager.deleteMany();
  await prisma.timelineEvent.deleteMany();
  await prisma.shareholder.deleteMany();
  await prisma.aboutPage.deleteMany();

  // Create default admin user if not exists
  const existingAdmin = await prisma.user.findUnique({
    where: { username: 'root' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('root', 10);
    await prisma.user.create({
      data: {
        username: 'root',
        password: hashedPassword,
        name: 'Administrator',
        role: 'ADMIN',
        isActive: true,
      },
    });
    console.log('Default admin user created: root / root');
  }

  console.log('Seeding projects...');
  const project1 = await prisma.project.create({
    data: {
      name: 'Сити-квартал «Дельта»',
      slug: 'city-kvartal-delta',
      description:
        'Современный жилой комплекс в центре города с развитой инфраструктурой и закрытыми дворами.',
      isActive: true,
      sortOrder: 1,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Жилой район «Река»',
      slug: 'zhiloy-rayon-reka',
      description:
        'Экологичный район на берегу реки с собственным парком и набережной.',
      isActive: true,
      sortOrder: 2,
    },
  });

  console.log('Seeding objects...');
  const objectsData = [
    {
      name: 'Дом 1 (Дельта)',
      slug: 'delta-house-1',
      projectId: project1.id,
      address: 'ул. Центральная, 10',
      completionDate: new Date('2025-12-31T00:00:00.000Z'),
      floors: 16,
      finishing: 'TURNKEY' as FinishingType,
      description: 'Первая очередь строительства квартала Дельта.',
    },
    {
      name: 'Дом 2 (Дельта)',
      slug: 'delta-house-2',
      projectId: project1.id,
      address: 'ул. Центральная, 12',
      completionDate: new Date('2026-06-30T00:00:00.000Z'),
      floors: 16,
      finishing: 'WHITE_CUBE' as FinishingType,
      description: 'Вторая очередь строительства с видом на парк.',
    },
    {
      name: 'Блок А (Река)',
      slug: 'reka-block-a',
      projectId: project2.id,
      address: 'Набережная, 5',
      completionDate: new Date('2025-09-30T00:00:00.000Z'),
      floors: 10,
      finishing: 'DESIGNER' as FinishingType,
      description: 'Премиальный блок на первой линии реки.',
    },
  ];

  const createdObjects: any[] = [];
  for (const obj of objectsData) {
    try {
      console.log(`Creating object: ${obj.name}`);
      // Use raw SQL with explicit type casting to avoid binary format issues
      const id = crypto.randomUUID();
      await prisma.$executeRawUnsafe(`
        INSERT INTO objects (id, name, slug, project_id, address, completion_date, floors, finishing, description, is_active, sort_order, created_at, updated_at)
        VALUES (
          '${id}',
          '${obj.name.replace(/'/g, "''")}',
          '${obj.slug}',
          '${obj.projectId}',
          '${obj.address.replace(/'/g, "''")}',
          '${obj.completionDate.toISOString()}',
          ${obj.floors},
          '${obj.finishing}'::"FinishingType",
          '${obj.description.replace(/'/g, "''")}',
          true,
          0,
          NOW(),
          NOW()
        )
      `);

      const created = await prisma.object.findUnique({ where: { id } });
      createdObjects.push(created);
    } catch (error) {
      console.error(`Error creating object ${obj.name}:`, error);
      throw error;
    }
  }

  console.log('Updating object coordinates...');
  for (let i = 0; i < createdObjects.length; i++) {
    const coords = [
      { lat: 56.01, lng: 92.86 },
      { lat: 56.02, lng: 92.87 },
      { lat: 56.0, lng: 92.85 },
    ][i];

    await prisma.$executeRawUnsafe(
      `UPDATE objects SET latitude = ${coords.lat}, longitude = ${coords.lng} WHERE id = '${createdObjects[i].id}'`,
    );
  }

  console.log('Seeding apartments...');
  const finishingTypes = [
    FinishingType.TURNKEY,
    FinishingType.WHITE_CUBE,
    FinishingType.CLEAN,
    FinishingType.ROUGH,
  ];

  // Real images from uploads for layouts
  const layoutImages = [
    '1777641788848-c5lxd.jpg',
    '1777641792892-y7lvr7.jpg',
    '1777641890160-x8voiv.jpg',
    '1777641902991-toyfx.jpg',
    '1777641912670-2z3g3c.jpg',
  ];

  for (const obj of createdObjects) {
    for (let i = 1; i <= 5; i++) {
      const rooms = (i % 3) + 1;
      const area = 40 + rooms * 20 + Math.random() * 10;
      const price = 5000000 + area * 100000;

      const apartment = await prisma.apartment.create({
        data: {
          number: (100 + i).toString(),
          price: price,
          area: parseFloat(area.toFixed(1)),
          rooms: rooms,
          building: '1',
          entrance: '1',
          floor: (i % 10) + 1,
          floorTotal: obj.floors || 16,
          completionDate: new Date('2025-12-31T00:00:00.000Z'),
          finishing: finishingTypes[i % finishingTypes.length],
          projectId: obj.projectId,
          objectId: obj.id,
          isAvailable: true,
          sortOrder: i,
        },
      });

      // Add layout photo to apartment
      const layoutFilename = layoutImages[i % layoutImages.length];
      await prisma.media.create({
        data: {
          filename: layoutFilename,
          url: `/uploads/${layoutFilename}`,
          type: MediaType.IMAGE,
          mimeType: 'image/jpeg',
          size: 100000,
          apartmentLayoutId: apartment.id,
        },
      });
    }
  }

  console.log('Seeding news...');
  const newsImages = [
    '1777064769550-qxhzg.jpg',
    '1777064789723-vrh4nc.jpg',
    '1777065403564-612t8f.jpg',
  ];

  for (let i = 1; i <= 3; i++) {
    const news = await prisma.news.create({
      data: {
        title: `Новость №${i}: Развитие инфраструктуры`,
        slug: `news-${i}`,
        content: `Это подробный контент новости номер ${i}. Мы строим лучшие дома в городе Красноярске, обеспечивая жителей всем необходимым.`,
        excerpt: `Краткое описание новости номер ${i} для превью на главной странице.`,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    const newsFilename = newsImages[i % newsImages.length];
    await prisma.media.create({
      data: {
        filename: newsFilename,
        url: `/uploads/${newsFilename}`,
        type: MediaType.IMAGE,
        mimeType: 'image/jpeg',
        size: 200000,
        newsId: news.id,
      },
    });
  }

  console.log('Seeding infrastructure...');
  for (const obj of createdObjects) {
    await prisma.infrastructurePoint.create({
      data: {
        title: 'Средняя школа №150',
        category: InfrastructureCategory.EDUCATION,
        latitude: obj.latitude! + 0.001,
        longitude: obj.longitude! + 0.001,
        address: 'ул. Школьная, 5',
        objectId: obj.id,
      },
    });
    await prisma.infrastructurePoint.create({
      data: {
        title: 'ТРЦ «Планета»',
        category: InfrastructureCategory.SHOPPING,
        latitude: obj.latitude! - 0.002,
        longitude: obj.longitude! + 0.002,
        address: 'ул. 9 Мая, 77',
        objectId: obj.id,
      },
    });
  }

  console.log('Seeding managers...');
  const managers = [
    {
      name: 'Алексей Иванов',
      position: 'Старший менеджер',
      isHead: true,
      file: '1777701669813-g00p8l.jpg',
    },
    {
      name: 'Мария Петрова',
      position: 'Менеджер по продажам',
      isHead: false,
      file: '1777701672193-7tayhj.jpg',
    },
  ];

  for (const m of managers) {
    const manager = await prisma.manager.create({
      data: {
        name: m.name,
        position: m.position,
        isHead: m.isHead,
      },
    });
    await prisma.media.create({
      data: {
        filename: m.file,
        url: `/uploads/${m.file}`,
        type: MediaType.IMAGE,
        mimeType: 'image/jpeg',
        size: 50000,
        managerId: manager.id,
      },
    });
  }

  console.log('Seeding About Page...');
  await prisma.aboutPage.create({
    data: {
      title: 'Крупнейший девелопер Красноярска',
      subtitle:
        'ДЕЛЬТАСТРОЙ — эксперт в области создания качественной городской среды',
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
