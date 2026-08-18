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
        name: 'پژو ۲۰۶',
        slug: 'peugeot-206',
        company: 'پژو',
        price_per_day: 350000,
        tags: ['اقتصادی', 'دنده‌ای', 'بنزینی'],
        description: 'خودروی جمع‌وجور و کم‌مصرف، عالی برای رانندگی در شهر تهران.',
        rate: 4.5,
        can_rent: true,
        category_id: categories[0].id,
        creator_id: null,
        image: null
      },
      {
        name: 'پراید ۱۳۱',
        slug: 'pride-131',
        company: 'سایپا',
        price_per_day: 250000,
        tags: ['اقتصادی', 'دنده‌ای', 'بنزینی'],
        description: 'مقرون‌به‌صرفه و در دسترس، گزینه‌ای عالی برای مسافران با بودجه محدود.',
        rate: 3.8,
        can_rent: true,
        category_id: categories[1].id,
        creator_id: null,
        image: null
      },
      {
        image: null,
        name: 'تویوتا کمری',
        slug: 'toyota-camry',
        company: 'تویوتا',
        price_per_day: 1200000,
        tags: ['لوکس', 'اتوماتیک', 'بنزینی'],
        description: 'سدان راحت با امکانات پیشرفته، ایده‌آل برای سفرهای کاری.',
        rate: 4.9,
        can_rent: true,
        category_id: categories[2].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'رنو تندر',
        slug: 'renault-tondar',
        company: 'رنو',
        price_per_day: 450000,
        tags: ['سدان', 'دنده‌ای', 'بنزینی'],
        description: 'سدان قابل اعتماد با مصرف سوخت مناسب، عالی برای گشت‌وگذار در اصفهان.',
        rate: 4.3,
        can_rent: true,
        category_id: categories[3].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'کیا سراتو',
        slug: 'kia-cerato',
        company: 'کیا',
        price_per_day: 700000,
        tags: ['سدان', 'اتوماتیک', 'بنزینی'],
        description: 'شیک و راحت، عالی برای سفرهای خانوادگی.',
        rate: 4.6,
        can_rent: true,
        category_id: categories[4].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'هیوندای توسان',
        slug: 'hyundai-tucson',
        company: 'هیوندای',
        price_per_day: 850000,
        tags: ['شاسی‌بلند', 'اتوماتیک', 'بنزینی'],
        description: 'شاسی‌بلند جادار با راحتی عالی، ایده‌آل برای سفرهای خانوادگی به مشهد.',
        rate: 4.7,
        can_rent: true,
        category_id: categories[5].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'سمند',
        slug: 'ik-samand',
        company: 'ایران خودرو',
        price_per_day: 400000,
        tags: ['سدان', 'دنده‌ای', 'بنزینی'],
        description: 'سدان ملی با فضای پای خوب و صندوق بزرگ.',
        rate: 4.0,
        can_rent: true,
        category_id: categories[6].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'میتسوبیشی لنسر',
        slug: 'mitsubishi-lancer',
        company: 'میتسوبیشی',
        price_per_day: 750000,
        tags: ['اسپرت', 'اتوماتیک', 'بنزینی'],
        description: 'سدان اسپرت با هندلینگ عالی، رانندگی با آن در شیراز لذت‌بخش است.',
        rate: 4.4,
        can_rent: true,
        category_id: categories[7].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'سوزوکی سوئیفت',
        slug: 'suzuki-swift',
        company: 'سوزوکی',
        price_per_day: 500000,
        tags: ['هاچ‌بک', 'دنده‌ای', 'بنزینی'],
        description: 'جمع‌وجور و چابک، عالی برای خیابان‌های باریک.',
        rate: 4.2,
        can_rent: true,
        category_id: categories[8].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'دنا پلاس',
        slug: 'dena-plus',
        company: 'ایران خودرو',
        price_per_day: 550000,
        tags: ['سدان', 'دنده‌ای', 'بنزینی'],
        description: 'سدان مدرن ایرانی با امکانات و طراحی خوب.',
        rate: 4.1,
        can_rent: true,
        category_id: categories[9].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'شورولت آویو',
        slug: 'chevrolet-aveo',
        company: 'شورولت',
        price_per_day: 480000,
        tags: ['اقتصادی', 'اتوماتیک', 'بنزینی'],
        description: 'هاچ‌بک آمریکایی مقرون‌به‌صرفه، ارزش عالی در برابر هزینه.',
        rate: 3.9,
        can_rent: true,
        category_id: categories[0].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'تویوتا لندکروزر',
        slug: 'toyota-land-cruiser',
        company: 'تویوتا',
        price_per_day: 2000000,
        tags: ['آفرود', 'شاسی‌بلند', 'اتوماتیک', 'دیزلی'],
        description: 'خودروی آفرود افسانه‌ای، عالی برای ماجراجویی‌های قشم.',
        rate: 5.0,
        can_rent: true,
        category_id: categories[0].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'بی‌ام‌و ایکس ۵',
        slug: 'bmw-x5',
        company: 'بی‌ام‌و',
        price_per_day: 2500000,
        tags: ['لوکس', 'شاسی‌بلند', 'اتوماتیک', 'بنزینی'],
        description: 'شاسی‌بلند آلمانی ممتاز با امکانات پیشرفته و راحتی بی‌نظیر.',
        rate: 5.0,
        can_rent: true,
        category_id: categories[0].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'مرسدس اس۵۰۰',
        slug: 'mercedes-s500',
        company: 'مرسدس-بنز',
        price_per_day: 3000000,
        tags: ['لوکس', 'سدان', 'اتوماتیک', 'بنزینی'],
        description: 'سدان لوکس نهایی با عملکرد و راحتی درجه یک.',
        rate: 5.0,
        can_rent: true,
        category_id: categories[1].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'نیسان قشقایی',
        slug: 'nissan-qashqai',
        company: 'نیسان',
        price_per_day: 950000,
        tags: ['کراس‌اوور', 'شاسی‌بلند', 'اتوماتیک', 'بنزینی'],
        description: 'کراس‌اوور شیک با ارتفاع مناسب از سطح زمین برای جاده‌های خیس.',
        rate: 4.6,
        can_rent: true,
        category_id: categories[2].id,
        creator_id: null,
      },
      {
        image: null,
        name: 'فورد رنجر',
        slug: 'ford-ranger',
        company: 'فورد',
        price_per_day: 1100000,
        tags: ['وانت', 'آفرود', 'اتوماتیک', 'دیزلی'],
        description: 'وانت مقاوم با موتور قدرتمند و کولر، عالی برای اهواز.',
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
