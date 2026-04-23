import axiosClient from "../../services/axiosClient";
//hooks
import { useState, useEffect } from "react";
type RoleType = {
  id: string;
  name: string;
  descriptions: string;
  permissions: string[] | null;
};
const RolesPage = () => {
  const [Roles, setRoles] = useState<RoleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const fetchGetRoles = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/roles?order=desc&limit=10&page=${page}`,
      );
      console.log("response to request :", response);
      const getAllRoles = response.data.response.data.roles;
      console.log("response get alll roles :", getAllRoles);
      const getCount = response.data.response.data.count;
      console.log("get count all roles :", getCount);
      const tota = Math.ceil(getCount / 10);

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
                    توضیحات
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
                          {(page - 1) * 10 + index + 1}
                        </td>
                        <td className="px-4 py-3 text-green-600 sm:table-cell">
                          {rol.name}
                        </td>
                        <td className="px-4 py-3 text-blue-400">
                          {Array.isArray(rol.permissions)
                            ? rol.permissions.join("  , ")
                            : rol.permissions}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default RolesPage;
