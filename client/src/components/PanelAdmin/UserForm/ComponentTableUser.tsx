import axiosClient from "../../../services/axiosClient";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ComponentPaginat from "../../../Paginate/ComponentPaginat";
import { useCallback } from "react";

type User = {
  id: number;
  display_name: string;
  email: string;
  roles: string[] | string;
};

const ComponentTableUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  //now page
  const [page, setPage] = useState(1);
  //All page
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `users?order=desc&limit=5&page=${page}`,
      );
      const data = response.data.response.data;
      console.log("data", data);
      console.log("all users:", data.users);
      setUsers(data.users);

      // count all items
      const totalItems = response.data.response.data.count;
      //count items in page
      const calculatedTotalPages = Math.ceil(totalItems / 5);

      setTotalPages(calculatedTotalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [page, fetchUsers]);

  return (
    <>
      <div className="rounded-lg shadow-sm border border-gray-200 bg-white p-4">
        {loading ? (
          <p className="text-center text-gray-500 py-8">
            در حال گرفتن همه کاربران ...
          </p>
        ) : (
          <>
            <table className="min-w-full text-right text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">
                    ردیف
                  </th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">
                    کاربر
                  </th>
                  <th className="px-4 py-3 font-medium sm:table-cell">ایمیل</th>
                  <th className="px-4 py-3 font-medium sm:table-cell">نقش</th>
                  <th className="px-4 py-3 font-medium sm:table-cell">
                    جزئیات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center">
                      هیچ کاربری یافت نشد.
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {(page - 1) * 5 + index + 1}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {user.display_name}
                      </td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">
                        {Array.isArray(user.roles)
                          ? user.roles.join(", ")
                          : user.roles}
                      </td>
                      <td className="font-bold text-blue-600">
                        <Link to={`detail/${user.id}`}>مشاهده</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
      <ComponentPaginat
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
};

export default ComponentTableUser;
