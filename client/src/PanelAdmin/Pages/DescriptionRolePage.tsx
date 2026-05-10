import axiosClient from "../../services/axiosClient";
import { useState, useEffect } from "react";
import ComponentPaginat from "../../ComponentPublic/ComponentPaginat";

type PermissionType  = {
  id: string;
  name: string;
  description: string;
};

const DescriptionRole = () => {
  const [roles, setRoles] = useState<PermissionType []>([]);
  //now page
  const [page, setPage] = useState(1);
  //All page
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/permissions?order=desc&limit=10&page=${page}`,
      );

      const getRoles = response.data.response.data.permissions;

      setRoles(getRoles);

      const totalpermession = response.data.response.data.count;
      const TotalPages = Math.ceil(totalpermession / 10);

      setTotalPages(TotalPages);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setRoles([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [page]);

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <p className="text-center text-gray-500 py-8">در حال بارگذاری...</p>
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
              <tbody className="divide-y divide-gray-100">
                {roles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-center">
                      هیچ نقشی یافت نشد.
                    </td>
                  </tr>
                ) : (
                  roles.map((rol, index) => (
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
                        {rol.description}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <ComponentPaginat
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default DescriptionRole;
