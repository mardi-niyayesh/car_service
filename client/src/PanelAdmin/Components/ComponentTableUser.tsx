import axiosClient from "../../services/axiosClient";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

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

  const fetchUsers = async () => {
    try {
      const response = await axiosClient.get(
        `users?order=desc&limit=5&page=${page}`,
      );

      const data = response.data.response.data;
      console.log("data", data);

      console.log("all users:", data.users);

      setUsers(data.users);

      //All pages=5
      setTotalPages(5);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handlePageClick = (selectedPage: number) => {
    if (page !== selectedPage) {
      setPage(selectedPage);
    }
  };

  const renderPagination = () => {
    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          disabled={page === i}
          className={`
            px-3 py-1 border rounded font-medium transition-colors
            ${
              page === i
                ? "bg-blue-500 text-white cursor-not-allowed"
                : "hover:bg-gray-100 hover:text-blue-600"
            }
            ${i < 1 || i > totalPages ? "hidden" : ""}
          `}
        >
          {i}
        </button>,
      );
    }

    return (
      <div className="flex gap-2 items-center justify-center mt-6">
        <button
          onClick={() => page > 1 && handlePageClick(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          قبلی
        </button>

        {pageButtons}

        <button
          onClick={() => page < totalPages && handlePageClick(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          بعدی
        </button>
      </div>
    );
  };

  return (
    <div className="rounded-lg shadow-sm border border-gray-200 bg-white p-4">
      <table className="min-w-full text-right text-sm text-gray-700">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 font-medium hidden sm:table-cell">ردیف</th>
            <th className="px-4 py-3 font-medium hidden sm:table-cell">
              کاربر
            </th>
            <th className="px-4 py-3 font-medium sm:table-cell">ایمیل</th>
            <th className="px-4 py-3 font-medium sm:table-cell">نقش</th>
            <th className="px-4 py-3 font-medium sm:table-cell">جزئیات</th>
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
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 hidden sm:table-cell">
                  {(page - 1) * 10 + index + 1}
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

      {totalPages > 1 && renderPagination()}
    </div>
  );
};

export default ComponentTableUser;
