import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-start">
      <div className="bg-[url('../../assets/imges/notfound.png')] bg-cover bg-center bg-no-repeat w-full min-h-[200px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] xl:h-[600px] 2xl:h-[683px] relative"></div>

      <p className="text-center font-bold text-blue-600 text-2xl mt-4">صفحه مورد نظر یافت نشد</p>
      
      <Link
        to="/"
        className="inline-block bg-blue-500 hover:bg-blue-600 mt-10 text-white 
                   text-sm sm:text-base md:text-lg
                   px-4 sm:px-6 md:px-8 
                   py-2 sm:py-3 
                   rounded-lg 
                   transition-all duration-300 
                   transform hover:scale-105
                   shadow-md hover:shadow-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        رفتن به صفحه اصلی
      </Link>
    </div>
  );
};

export default NotFoundPage;
