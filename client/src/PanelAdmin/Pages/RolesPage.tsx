import axiosClient from "../../services/axiosClient";
import { RiDeleteBinLine } from 'react-icons/ri'
//hooks
import { useState, useEffect } from "react";
type RoleType = {
  id: string;
  name: string;
  permissions: string[] | null;
};
const RolesPage = () => {
  const [Roles, setRoles] = useState<RoleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(5);
  const fetchGetRoles = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/roles?order=desc&limit=5&page=${page}`,
      );
      console.log("response to request :", response);
      const getAllRoles = response.data.response.data.roles;
      console.log("response get alll roles :", getAllRoles);
      const getCount = response.data.response.data.count;
      console.log("get count all roles :", getCount);
      const tota = Math.ceil(getCount / 5);

      setTotalPage(tota);
      setRoles(getAllRoles);
    } catch (err) {
      console.log("Error in get all roles :", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGetRoles();
  }, [page]);
  const handleChangePage = (selected: number) => {
    if (selected >= 1 && selected <= totalPage) {
      setPage(selected);
    }
  };
  const renderPagination = () => {
    const pageButtons = [];
    for (let i = 1; i <= totalPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handleChangePage(i)}
          disabled={page === i}
          className={`
            px-3 py-1 border rounded font-medium transition-colors
            ${
              page === i
                ? "bg-blue-500 text-white cursor-not-allowed"
                : "hover:bg-gray-100 hover:text-blue-600"
            }
          `}
        >
          {i}
        </button>,
      );
    }

    return (
      <div className="flex gap-2 items-center justify-center mt-6">
        <button
          onClick={() => handleChangePage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          قبلی
        </button>
        {pageButtons}
        <button
          onClick={() => handleChangePage(page + 1)}
          disabled={page === totalPage}
          className="px-3 py-1 border rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          بعدی
        </button>
      </div>
    );
  };
  return (
    <div>
      {loading ? (
        <div> در حال گرفتن همه ی نقش ها ...</div>
      ) : (
        <>
          <div className="rounded-lg shadow-sm border border-gray-200 bg-white">
            <table className="min-w-full text-right text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">
                    ردیف
                  </th>
                  <th className="px-4 py-3 font-medium sm:table-cell">
                    اسم نقش
                  </th>
                  <th className="px-4 py-3 font-medium sm:table-cell">
                    مجوز ها
                  </th>
                   <th className="px-4 py-3 font-medium sm:table-cell">
                     حذف 
                  </th>
                </tr>
              </thead>

              <tbody>
                {Roles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-center">
                      هیچ نقشی یافت نشد.
                    </td>
                  </tr>
                ) : (
                  Roles.map((rol, index) => {
                    return (
                      <tr
                        key={rol.id}
                        className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {(page - 1) * 5 + index + 1}
                        </td>
                        <td className="px-4 py-3 text-green-600 sm:table-cell">
                          {rol.name}
                        </td>
                        <td className="px-4 py-3 text-blue-400">
                          {Array.isArray(rol.permissions)
                            ? rol.permissions.join("  , ")
                            : rol.permissions}
                        </td>
                        <td>{<RiDeleteBinLine size={20} color="red" className="cursor-pointer"/>}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {totalPage > 1 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default RolesPage;
