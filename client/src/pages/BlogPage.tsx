import blog1 from "../../assets/blog.png";
import blog2 from "../../assets/blog2.png";
import blog3 from "../../assets/blog3.png";
import blog4 from "../../assets/blog4.png";

import des1 from "../../assets/des1.png";
import des2 from "../../assets/des2.png";
import des3 from "../../assets/des3.png";
import des6 from "../../assets/des6.png";

const Description3 = [
  {
    id: 1,
    img: blog1,
    title: `سفر از سوئد به ایران با ویزا و مدارک
`,
  },
  { id: 2, img: blog2, title: `کسب درآمد از خودرو با معرفی بهترین روش‌ها` },
  { id: 3, img: blog3, title: `دبی از بهترین مقاصد جهان` },
  { id: 4, img: blog4, title: `هزینه سفر به استانبول در زمستان 1404` },
];
const newblog = [
  {
    id: 5,
    img: des1,
    des: "راهنمای سفر به دبی از ارزان تا لاکچری با هزینه‌های 2026",
  },
  { id: 6, img: des2, des: "سفر از سوئد به ایران با ویزا و مدارک" },
  {
    id: 7,
    img: des3,
    des: "اینترنت دبی | اینترنت در دبی برای سیم‌کارت و وای‌فای",
  },
  {
    id: 8,
    img: des6,
    des: "سالن ترانزیت فرودگاه | سالن ترانزیت در فرودگاه چیست؟",
  },
];
const BlogPage = () => {
  return (
    <>
      <div className="py-10">
        <h2 className="font-bold text-blue-800 text-2xl text-center">
          مقاله های شرکت کارسرویس
        </h2>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {Description3.map((item) => (
            <div
              key={item.id}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src={item.img}
                alt={`Luxury car: ${item.title}`}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />

              <div className="absolute bottom-0 left-1/2 cursor-pointer -translate-x-1/2 -translate-y-1/2 transform w-4/5 p-2 rounded-xl shadow-lg backdrop-blur-sm ring-1 ring-white/60 bg-white/20">
                <p className="font-bold text-white text-center text-lg sm:text-xl lg:text-xl">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h1 className="font-bold text-blue-800 text-2xl my-8 text-center">
          جدید ترین مطالب
        </h1>
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4">
          {newblog.map((blo) => (
            <div
              key={blo.id}
              className="bg-gray-500 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="overflow-hidden h-48">
                <img
                  src={blo.img}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <p className="text-gray-300 p-4 text-sm leading-6 group-hover:text-white transition-colors duration-300">
                {blo.des}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
