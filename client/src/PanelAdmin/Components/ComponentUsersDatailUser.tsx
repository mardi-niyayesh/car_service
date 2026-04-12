import { FaUser } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";

type User = {
  id: number;
  display_name: string;
  email: string;
  roles: string[] | string;
  age: number;
};

const ComponentCategoryDatailUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const { userId } = useParams();

  const fetchUser = async () => {
    if (!userId) {
      console.log("userId  missing.");
      setUser(null);
      return;
    }

    try {
      const response = await axiosClient.get(`/users/find?id=${userId}`);
      console.log("Response:", response.data);

      const userData = response.data.response.data.user;
      setUser(userData);
      console.log("userdata :", userData);
    } catch (err) {
      console.log("Error in get users :", err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return (
    <>
      {!user ? (
        <p className="text-center py-8 text-gray-500">
          در حال گرفتن اطلاعات کاربر...
        </p>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <FaUser size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {user.display_name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">ایمیل</p>
              <p className="text-base text-gray-700">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">اسم</p>
              <p className="text-base text-gray-600 font-medium">
                {user.display_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">سن</p>
              <p className="text-base text-gray-700">{user.age}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">نقش‌ها</p>
              <p className="text-base text-green-600 font-medium">
                {Array.isArray(user.roles) ? user.roles.join(", ") : user.roles}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ComponentCategoryDatailUser;
