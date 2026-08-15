import caratoo from "../../../assets/imges/ceratoo.png";
import hunda from "../../../assets/imges/hunda.png";
import sorena from "../../../assets/imges/sorentoo.png";
import tigoo from "../../../assets/imges/tigoo.png";

import carshiraz from "../../../assets/imges/carshiraz.png";
import caresfahan from "../../../assets/imges/caresfahan.png";
import cartehran from "../../../assets/imges/cartehran.png";
import carmashhad from "../../../assets/imges/carmashhad.png";

import { motion } from "framer-motion";

const Listcar = [
  {
    id: 1,
    title: "اجاره اکسنت",
    namecar: "خودرو سدان نیمه لوکس",
    imgcar: caratoo,
  },
  {
    id: 2,
    title: "اجاره سراتو",
    namecar: "خودرو سدان نیمه لوکس",
    imgcar: hunda,
  },
  {
    id: 3,
    title: "اجاره سورنتو",
    namecar: "خودرو شاسی بلند لوکس",
    imgcar: sorena,
  },
  {
    id: 4,
    title: "اجاره تیگو پرو",
    namecar: "خودرو شاسی بلند لوکس",
    imgcar: tigoo,
  },
];

const Description1 = [
  {
    id: 1,
    title: "اجاره خودرو بدون راننده",
    text: `اجاره خودرو بدون راننده یکی از پرطرفدارترین خدمات کارسرویس است که با شرایط آسان و تخفیف‌های ویژه برای مشتریان فراهم شده است. با اجاره ماشین بدون راننده شما دیگر نیازی به پرداخت هزینه‌های نگهداری، تعمیرات، تعویض لاستیک و بیمه خودرو نخواهید داشت.`,
  },
  {
    id: 2,
    title: "اجاره خودرو در تهران",
    text: `اگر اهل تهران هستید یا قصد سفر به تهران را دارید، بنا به دلایل مختلف ممکن است نیاز به اجاره ماشین در تهران داشته باشید. شرکت کارسرویس برای اجاره انواع ماشین بدون راننده در کنار شما خواهد بود تا تجربه‌ای کم‌نظیر از اجاره خودرو در تهران داشته باشید.

علاوه بر خدمات ویژه برای رزرو خودرو بدون راننده در تهران، سرویس‌های کامل و برتر شرکت، نظیر اجاره خودرو لوکس، اجاره روزانه خودرو در تهران و عدم محدودیت در مدت زمان اجاره همراهتان خواهد بود.

در فرودگاه‌های امام خمینی و مهرآباد، هتل محل اقامت یا هر نقطه دلخواه دیگری در تهران، خودرو را تحویل بگیرید و در تهران یا هر شهر دیگر ایران، در ساعت و روز دلخواهتان ماشین را عودت دهید. به همین سادگی.`,
  },
];

const Description2 = [
  {
    id: 1,
    title: "پشتیبانی ۲۴ ساعته کارسرویس",
    text: `در کنار خدمات ویژه کارسرویس، در زمان اجاره خودرو، تیم پشتیبانی کارسرویس با خدمات پشتیبانی شبانه‌روزی همراه شما خواهد بود.

در صورت بروز هرگونه مشکل احتمالی نظیر نقص فنی و تصادفات احتمالی، در کوتاه‌ترین زمان ممکن و در هر نقطه از ایران امدادرسانی انجام خواهد شد. همچنین در صورت لزوم خودرویی دیگر در اختیار شما قرار خواهیم داد.`,
  },
  {
    id: 2,
    title: "قیمت اجاره خودرو",
    text: `هنگام اجاره خودرو بدون راننده، قیمت اجاره ماشین یکی از مهم‌ترین نکات می‌باشد. تمام خودروهای شرکت کارسرویس تحت مالکیت رسمی این شرکت بوده و تحویل خودرو بدون واسطه صورت می‌پذیرد.

عدم وجود واسطه سبب ارائه مناسب‌ترین لیست قیمت و کیفیت در اجاره خودرو می‌گردد. همچنین می‌توانید بدون محدودیت زمانی، خودرو مورد نظرتان را از یک روز تا هر تعداد بازه زمانی که نیاز دارید اجاره کنید.

رویکرد و خدمات مشتری‌محور کارسرویس، سبب تضمین ارائه مناسب‌ترین قیمت کرایه ماشین برای متقاضیان خدمات اجاره خودرو در ایران شده است.`,
  },
];

const Description3 = [
  {
    id: 1,
    img: carshiraz,
    title: "اجاره خودرو در شیراز",
  },
  {
    id: 2,
    img: caresfahan,
    title: "اجاره خودرو در اصفهان",
  },
  {
    id: 3,
    img: cartehran,
    title: "اجاره خودرو در تهران",
  },
  {
    id: 4,
    img: carmashhad,
    title: "اجاره خودرو در مشهد",
  },
];

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.8, 0.25, 1],
    },
  },
};

const cardAnimation = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: index * 0.08,
      ease: [0.25, 0.8, 0.25, 1],
    },
  }),
};

const Desctiption = () => {
  return (
    <main className="w-full bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {Description1.map((item, index) => (
          <motion.section
            key={item.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            className={`
              max-w-5xl
              mx-auto
              py-10
              sm:py-12
              md:py-14
              ${index === 0 ? "pt-8" : ""}
            `}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="h-7 w-1 rounded-full bg-[#FDB713]" />

              <h2
                className="
                  text-xl
                  sm:text-2xl
                  md:text-3xl
                  font-extrabold
                  leading-relaxed
                  text-gray-900
                "
              >
                {item.title}
              </h2>
            </div>

            <div
              className="
                rounded-2xl
                text-2xl
                font-medium
                border
                border-gray-200
                bg-gray-50/70
                p-5
                sm:p-6
                md:p-7
              "
            >
              <p
                className="
                  whitespace-pre-line
                  text-sm
                  sm:text-base
                  leading-8
                  sm:leading-9
                  text-gray-600
                  text-justify
                "
              >
                {item.text}
              </p>
            </div>
          </motion.section>
        ))}

        <section className="py-10 sm:py-14 md:py-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="mb-9 sm:mb-11 text-center"
          >
            <h2
              className="
                mt-3
                text-2xl
                sm:text-3xl
                md:text-4xl
                font-extrabold
                text-gray-900
              "
            >
              ماشین‌های لوکس و اقتصادی
            </h2>

            <p
              className="
                mx-auto
                mt-3
                max-w-xl
                text-sm
                sm:text-base
                leading-7
                text-gray-500
              "
            >
              مجموعه‌ای از خودروهای محبوب برای یک تجربه راحت و مطمئن
            </p>
          </motion.div>

          {/* Cars */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-5
              sm:gap-6
            "
          >
            {Listcar.map((item, index) => (
              <motion.article
                key={item.id}
                custom={index}
                variants={cardAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                whileHover={{
                  y: -5,
                  transition: {
                    duration: 0.3,
                  },
                }}
                whileTap={{
                  scale: 0.985,
                }}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  shadow-sm
                  transition-shadow
                  duration-300
                  hover:shadow-xl
                "
              >
                <div className="p-5 pb-2">
                  <h3
                    className="
                      text-lg
                      sm:text-xl
                      font-extrabold
                      text-center
                      text-gray-800
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-center
                      text-gray-500
                    "
                  >
                    {item.namecar}
                  </p>
                </div>

                <div className="relative px-4 pt-4 pb-5">
                  <div
                    className="
                      absolute
                      bottom-5
                      left-5
                      right-5
                      h-10
                      rounded-full
                      bg-gray-900/15
                      blur-md
                      transition-all
                      duration-500
                      group-hover:scale-110
                    "
                  />

                  <motion.img
                    src={item.imgcar}
                    alt={item.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="
                      relative
                      z-10
                      block
                      w-[88%]
                      h-auto
                      mx-auto
                      object-contain
                    "
                    whileHover={{
                      scale: 1.04,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.25, 0.8, 0.25, 1],
                    }}
                  />
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {Description2.map((item, index) => (
          <motion.section
            key={item.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.12,
            }}
            className="max-w-5xl mx-auto py-10 sm:py-12 md:py-14"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="h-7 w-1 rounded-full bg-[#FDB713]" />

              <h2
                className="
                  text-xl
                  sm:text-2xl
                  md:text-3xl
                  font-extrabold
                  leading-relaxed
                  text-gray-900
                "
              >
                {item.title}
              </h2>
            </div>

            <div
              className="
                rounded-2xl
                text-2xl
                font-medium
                border
                border-gray-200
                bg-gray-50/70
                p-5
                sm:p-6
                md:p-7
              "
            >
              <p
                className="
                  whitespace-pre-line
                  text-sm
                  sm:text-base
                  leading-8
                  sm:leading-9
                  text-gray-600
                  text-justify
                "
              >
                {item.text}
              </p>
            </div>
          </motion.section>
        ))}

        <section className="py-10 sm:py-14 md:py-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="mb-9 sm:mb-11 text-center"
          >
            <div className="mb-3 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#FDB713]" />

              <span
                className="
              text-xs
              sm:text-sm
              font-medium
              tracking-wide
              text-[#d99a00]
            "
              >
                خدمات در سراسر ایران
              </span>

              <span className="h-px w-8 bg-[#FDB713]" />
            </div>

            <h2
              className="
                mt-3
                text-2xl
                sm:text-3xl
                md:text-4xl
                font-extrabold
                text-gray-900
              "
            >
              اجاره ماشین در شهرهای ایران
            </h2>

            <div
              className="
                  flex
               items-center
               justify-center
                rounded-2xl
                text-2xl
                font-medium
    
             aligin-center
                bg-gray-50/70
                p-5
                sm:p-6
                md:p-7
              "
            >
              <p
                className="
                  whitespace-pre-line
                  text-sm
                  sm:text-base
                  leading-8
                  sm:leading-9
                  text-gray-600
                  text-justify
                "
              >
                خودرو مورد نظرتان را در شهر مقصد با خیال راحت رزرو کنید.
              </p>
            </div>
          </motion.div>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-5
              sm:gap-6
            "
          >
            {Description3.map((item, index) => (
              <motion.article
                key={item.id}
                custom={index}
                variants={cardAnimation}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                whileHover={{
                  y: -5,
                  transition: {
                    duration: 0.3,
                  },
                }}
                whileTap={{
                  scale: 0.985,
                }}
                className="
                  group
                  relative
                  h-64
                  sm:h-72
                  overflow-hidden
                  rounded-2xl
                  bg-gray-900
                  shadow-sm
                "
              >
                <motion.img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                  "
                  whileHover={{
                    scale: 1.06,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.8, 0.25, 1],
                  }}
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/75
                    via-black/20
                    to-transparent
                  "
                />

                <div
                  className="
                    absolute
                    bottom-4
                    left-4
                    right-4
                  "
                >
                  <div
                    className="
                      rounded-xl
                      border
                      border-white/20
                      bg-black/25
                      px-4
                      py-3
                      backdrop-blur-md
                    "
                  >
                    <p
                      className="
                        text-center
                        text-sm
                        sm:text-base
                        font-bold
                        text-white
                      "
                    >
                      {item.title}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="
            max-w-5xl
            mx-auto
            py-10
            sm:py-14
            md:py-16
          "
        >
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-[#FDB713]/20
              bg-gradient-to-br
              from-[#fffaf0]
              via-white
              to-gray-50
              p-5
              sm:p-7
              md:p-9
            "
          >
            <div
              className="
                absolute
                right-0
                top-0
                h-full
                w-1
                bg-[#FDB713]
              "
            />

            <div className="pr-3 sm:pr-4">
              <span
                className="
                  inline-flex
                  rounded-full
                  bg-[#FDB713]/10
                  px-3
                  py-1
                  text-xs
                  sm:text-sm
                  font-bold
                  text-[#a87500]
                "
              >
                پوشش ویژه کارسرویس
              </span>

              <h2
                className="
                  mt-4
                  text-xl
                  sm:text-2xl
                  md:text-3xl
                  font-extrabold
                  leading-relaxed
                  text-gray-900
                "
              >
                پوشش طلایی کارسرویس برای کاهش تعهد خسارات مشتری
              </h2>

              <div  
                className=" rounded-2xl text-2xl font-medium aligin-center
                bg-gray-50/70 p-5 sm:p-6 md:p-7 " >
                <p
                  className="
                    whitespace-pre-line
                  text-sm
                  sm:text-base
                  leading-8
                  sm:leading-9
                  text-gray-600
                  text-justify
                "
                >
                  یکی از مهمترین دغدغه‌های متقاضیان خدمات اجاره ماشین بدون
                  راننده، خسارات و تصادفات احتمالی در طول سفر است. گرچه همه‌ی
                  رانندگان سعی می‌کنند با احتیاط و با رعایت قوانین برای حفظ
                  ایمنی و سلامت جان خود و سایرین رانندگی کنند، اما برخی اوقات به
                  دلایلی اتفاقات نامطلوبی ممکن است برای آنها به وقوع بیاید.
                  {"\n\n"}
                  پوشش طلایی خودرو، خدمتی شبیه به بیمه خودرو است که از طرف شرکت
                  اجاره خودرو در اختیار مشتری قرار می‌گیرد. خرید پوشش طلایی باعث
                  کاهش تعهد مشتری در خسارات جزئی و تصادفات شده و همچنین باعث
                  کاهش تعهد مشتری در زمینه خواب خودرو و حذف تعهد مشتری از افت
                  خودرو در زمان تصادف می‌گردد.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default Desctiption;
