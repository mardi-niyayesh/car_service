import axiosClient from "../../services/axiosClient";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

const ComponentTableUser = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axiosClient.get(
          "users?order=desc&limit=5&page=1",
        );
        console.log("Response:", response.data);

        const usersData = response.data.response.data.users;

        setUsers(usersData);
        console.log("userdata :", usersData);
      } catch (err) {
        console.log("Error in get users :", err);
      }
    };
    fetchAllUsers();
  }, []);

  return (
    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
      <table className="min-w-full  text-right text-sm text-gray-700">
        <thead className="bg-gray-100 text-gray-700 ">
          <tr>
            <th className="w-12 px-4 py-3 font-medium hidden sm:table-cell">
              ردیف
            </th>
            <th className="w-12 px-4 py-3 font-medium hidden  sm:table-cell">
              کاربر
            </th>
            <th className="w-12 px-4 py-3 font-medium  sm:table-cell">ایمیل</th>
            <th className="w-12 px-4 py-3 font-medium  sm:table-cell">نقش</th>
            <th className="w-12 px-4 py-3 font-medium  sm:table-cell">
              جزعیات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user, index) => (
            <tr className="hover:bg-gray-300 transition-colors  active:bg-gray-400">
              <td className="px-4 py-3 hidden sm:table-cell">{index + 1}</td>
              <td className="px-4 py-3 hidden sm:table-cell">
                {user.display_name}
              </td>
              <td className="px-4 py-3 ">{user.email}</td>
              <td className="px-4 py-3 text-green-600 font-medium">
                {Array.isArray(user.roles) ? user.roles.join(", ") : user.roles}
              </td>
                 <td className="font-bold text-blue-600"> 
                <Link to={`detail/${user.id}`}>
                  جزئیات 
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComponentTableUser;
