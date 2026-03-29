import { useUser } from "../../hooks/useUser";
//icon
import Editprofile from "../../../assets/edit-outline.png";
//link
import { Link } from "react-router-dom";
const Profile = () => {
  const { user } = useUser();

  return (
    <div className="w-full max-w-3xl m-auto  p-4 sm:p-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-200">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-700">
            اطلاعات پروفایل کاربر
          </h1>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام و نام خانوادگی
            </label>
            <input
              type="text"
              value={user?.display_name || ""}
              readOnly
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ایمیل کاربر
            </label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سن کاربر
            </label>
            <input
              type="text"
              value={user?.age ?? ""}
              readOnly
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          {/* Role User */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نقش کاربر
            </label>
            <input
              type="text"
              value={user?.roles ?? ""}
              readOnly
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              آدرس کاربر
            </label>
            <input
              type="text"
              placeholder="ادرس خود را وارد کنید"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/*  code post */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              کد پستی کاربر
            </label>
            <input
              type="number"
              placeholder="کد پستی خود را وارد کنید"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <Link to="updateUser">
            <div className="flex items-center justify-end gap-5 cursor-pointer">
              <img
                src={Editprofile}
                alt=""
                className="w-5 h-5 md:w-6 md:h-6"
              />

              <p className="text-gray-600">ویرایش اطلاعات پروفایل </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
