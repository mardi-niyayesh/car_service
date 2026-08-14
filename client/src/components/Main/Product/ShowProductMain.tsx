import ShowCategoryForm from "../ShowCategoryForm";
import AllProductMain from "./AllProductMain";

const ShowProductMain = () => {
  return (
    <section className="w-full bg-white py-10 sm:py-12 md:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-7 bg-[#FDB713] sm:w-10" />

            <span className="text-xs font-medium tracking-wide text-[#d99a00] sm:text-sm">
              خدمات رزرو
            </span>

            <span className="h-px w-7 bg-[#FDB713] sm:w-10" />
          </div>

          <h2
            className="
                text-xl
                font-extrabold
                leading-tight
                text-gray-900
                sm:text-2xl
                md:text-3xl
              "
          >
            رزرو خودرو در کارسرویس
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-xl
              text-sm
              leading-7
              text-gray-500
              sm:text-base
              sm:leading-8
              font-medium
            "
          >
            خودروی موردنظرتان را انتخاب کنید و به‌سادگی رزرو کنید.
          </p>
        </div>

        <ShowCategoryForm />


        <div className="mt-2 sm:mt-4">
          <AllProductMain />
        </div>
      </div>
    </section>
  );
};

export default ShowProductMain;
