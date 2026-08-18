import * as dotenv from "dotenv";

dotenv.config();

import {CliModule} from "@/modules";
import {NestFactory} from "@nestjs/core";
import {INestApplicationContext} from "@nestjs/common";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {Car, Category} from "@/modules/prisma/generated/client";

// Categories data
const categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'تهران',
    slug: 'tehran',
    description: 'پایتخت با بالاترین تقاضا برای اجاره خودرو، شامل گزینه‌های لوکس و اقتصادی.',
    creator_id: null,
  },
  {
    name: 'اصفهان',
    slug: 'isfahan',
    description: 'شهر تاریخی با گردشگری بالا، مناسب برای اجاره سدان و شاسی‌بلند.',
    creator_id: null,
  },
  {
    name: 'مشهد',
    slug: 'mashhad',
    description: 'قطب گردشگری مذهبی، تقاضای بالا برای خودروهای خانوادگی و ون.',
    creator_id: null,
  },
  {
    name: 'شیراز',
    slug: 'shiraz',
    description: 'شهر فرهنگی و تاریخی، محبوب برای اجاره خودروهای اقتصادی و سایز متوسط.',
    creator_id: null,
  },
  {
    name: 'تبریز',
    slug: 'tabriz',
    description: 'شهر صنعتی در شمال غرب، تقاضا برای خودروهای اقتصادی و شاسی‌بلند.',
    creator_id: null,
  },
  {
    name: 'قشم',
    slug: 'qeshm',
    description: 'جزیره منطقه آزاد، تقاضای بالا برای خودروهای آفرود و شاسی‌بلند.',
    creator_id: null,
  },
  {
    name: 'کیش',
    slug: 'kish',
    description: 'جزیره گردشگری با تقاضای بالا برای اجاره خودروهای لوکس و ممتاز.',
    creator_id: null,
  },
  {
    name: 'رشت',
    slug: 'rasht',
    description: 'شهر شمالی با آب و هوای مرطوب، تقاضا برای سدان‌های استاندارد.',
    creator_id: null,
  },
  {
    name: 'اهواز',
    slug: 'ahvaz',
    description: 'شهر نفت‌خیز جنوبی، تقاضا برای شاسی‌بلند و وانت.',
    creator_id: null,
  },
  {
    name: 'کرج',
    slug: 'karaj',
    description: 'نزدیک به تهران، شهر صنعتی با تقاضای بالای اجاره.',
    creator_id: null,
  },
  {
    name: 'بندرعباس',
    slug: 'bandar-abbas',
    description: 'شهر بندری با تقاضای بالا برای کامیون و خودروهای تجاری.',
    creator_id: null,
  },
  {
    name: 'همدان',
    slug: 'hamedan',
    description: 'شهر تاریخی با تقاضای متوسط برای خودروهای اقتصادی.',
    creator_id: null,
  },
];

async function bootstrap(): Promise<void> {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(CliModule);

  const prisma: PrismaService = app.get(PrismaService);

  await prisma.$transaction(async (tx) => {
    console.log("Running transaction for seed cars and categories in prisma");

    // Create categories and skip duplicates
    const categories = await tx.category.createManyAndReturn({
      data: categoryData,
      select: {
        id: true
      },
      skipDuplicates: true
    });

    // Cars data
    const carData: Omit<Car, 'id' | 'created_at' | 'updated_at'>[] = [
      {
        name: 'Peugeot 206',
        slug: 'peugeot-206',
        company: 'Peugeot',
        price_per_day: 350000,
        tags: ['economy', 'manual', 'petrol'],
        description: 'Compact and fuel-efficient car, perfect for city driving in Tehran.',
        rate: 4.5,
        can_rent: true,
        category_id: categories[0].id,
        creator_id: null,
        image: null
      },
      {
        name: 'Pride 131',
        slug: 'pride-131',
        company: 'Saipa',
        price_per_day: 250000,
        tags: ['economy', 'manual', 'petrol'],
        description: 'Affordable and widely available, great for budget travelers.',
        rate: 3.8,
        can_rent: true,
        category_id: categories[1].id,
        creator_id: null,
        image: null
      },
      {
        image: null,
        name: 'Toyota Camry',
        slug: 'toyota-camry',
        company: 'Toyota',
        price_per_day: 1200000,
        tags: ['luxury', 'automatic', 'petrol'],
        description: 'Comfortable sedan with premium features, ideal for business trips.',
        rate: 4.9,
        can_rent: true,
        category_id: categories[2].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'Renault Tondar',
        slug: 'renault-tondar',
        company: 'Renault',
        price_per_day: 450000,
        tags: ['sedan', 'manual', 'petrol'],
        description: 'Reliable sedan with good fuel economy, perfect for sightseeing in Isfahan.',
        rate: 4.3,
        can_rent: true,
        category_id: categories[3].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'Kia Cerato',
        slug: 'kia-cerato',
        company: 'Kia',
        price_per_day: 700000,
        tags: ['sedan', 'automatic', 'petrol'],
        description: 'Stylish and comfortable, great for family trips.',
        rate: 4.6,
        can_rent: true,
        category_id: categories[4].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'Hyundai Tucson',
        slug: 'hyundai-tucson',
        company: 'Hyundai',
        price_per_day: 850000,
        tags: ['suv', 'automatic', 'petrol'],
        description: 'Spacious SUV with excellent comfort, ideal for family trips to Mashhad.',
        rate: 4.7,
        can_rent: true,
        category_id: categories[5].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'Iran Khodro Samand',
        slug: 'ik-samand',
        company: 'Iran Khodro',
        price_per_day: 400000,
        tags: ['sedan', 'manual', 'petrol'],
        description: 'National sedan with good legroom and trunk space.',
        rate: 4.0,
        can_rent: true,
        category_id: categories[6].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'Mitsubishi Lancer',
        slug: 'mitsubishi-lancer',
        company: 'Mitsubishi',
        price_per_day: 750000,
        tags: ['sporty', 'automatic', 'petrol'],
        description: 'Sporty sedan with great handling, fun to drive in Shiraz.',
        rate: 4.4,
        can_rent: true,
        category_id: categories[7].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'Suzuki Swift',
        slug: 'suzuki-swift',
        company: 'Suzuki',
        price_per_day: 500000,
        tags: ['hatchback', 'manual', 'petrol'],
        description: 'Compact and zippy, perfect for narrow streets.',
        rate: 4.2,
        can_rent: true,
        category_id: categories[8].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'Dena Plus',
        slug: 'dena-plus',
        company: 'Iran Khodro',
        price_per_day: 550000,
        tags: ['sedan', 'manual', 'petrol'],
        description: 'Modern Iranian sedan with good features and design.',
        rate: 4.1,
        can_rent: true,
        category_id: categories[9].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'Chevrolet Aveo',
        slug: 'chevrolet-aveo',
        company: 'Chevrolet',
        price_per_day: 480000,
        tags: ['economy', 'automatic', 'petrol'],
        description: 'Affordable American hatchback, great value for money.',
        rate: 3.9,
        can_rent: true,
        category_id: categories[0].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'Toyota Land Cruiser',
        slug: 'toyota-land-cruiser',
        company: 'Toyota',
        price_per_day: 2000000,
        tags: ['offroad', 'suv', 'automatic', 'diesel'],
        description: 'Legendary off-road vehicle, perfect for Qeshm adventures.',
        rate: 5.0,
        can_rent: true,
        category_id: categories[0].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'BMW X5',
        slug: 'bmw-x5',
        company: 'BMW',
        price_per_day: 2500000,
        tags: ['luxury', 'suv', 'automatic', 'petrol'],
        description: 'Premium German SUV with advanced features and comfort.',
        rate: 5.0,
        can_rent: true,
        category_id: categories[0].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'Mercedes S500',
        slug: 'mercedes-s500',
        company: 'Mercedes-Benz',
        price_per_day: 3000000,
        tags: ['luxury', 'sedan', 'automatic', 'petrol'],
        description: 'Ultimate luxury sedan with top-tier performance and comfort.',
        rate: 5.0,
        can_rent: true,
        category_id: categories[1].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'Nissan Qashqai',
        slug: 'nissan-qashqai',
        company: 'Nissan',
        price_per_day: 950000,
        tags: ['crossover', 'suv', 'automatic', 'petrol'],
        description: 'Stylish crossover with good ground clearance for wet roads.',
        rate: 4.6,
        can_rent: true,
        category_id: categories[2].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'Ford Ranger',
        slug: 'ford-ranger',
        company: 'Ford',
        price_per_day: 1100000,
        tags: ['pickup', 'offroad', 'automatic', 'diesel'],
        description: 'Durable pickup truck with powerful engine and A/C, great for Ahvaz.',
        rate: 4.5,
        can_rent: true,
        category_id: categories[0].id,
        creator_id: null,
      },
    ];

    // Create cars and skip duplicates
    await tx.car.createMany({
      data: carData,
      skipDuplicates: true
    });

    // seed finished
    console.log(`Seed done — ${categories.length} categories and ${carData.length} cars inserted.`);
  });

  await app.close();
  process.exit(0);
}

bootstrap()
  .then(() => console.log("Running seed car and category script"))
  .catch(e => console.error(e));
