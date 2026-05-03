import axiosClient from "../../services/axiosClient";
import { RiDeleteBinLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import SuccessModal from "../../components/common/SuccessModal";
import WarningModal from "../../components/common/WarningModal ";
import ComponentPaginat from "../../ComponentPublic/ComponentPaginat";
type RoleType = {
  id: string;
  name: string;
  permissions: Permissions[] | null;
};
const RolesPage = () => {
  const [Roles, setRoles] = useState<RoleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(5);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [WarningMessage, setWarningMessage] = useState("");

  const fetchGetRoles = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/roles?order=desc&limit=5&page=${page}`,
      );
      console.log("response to request :", response);
      const getAllRoles = response.data.response.data.roles;
      console.log("response get alll roles :", getAllRoles);

      console.log("permessions role :", getAllRoles.name);

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

  const handelDleatRole = async (roleId: string) => {
    try {
      const res = await axiosClient.delete(`/roles/${roleId}`);
      console.log("response to deleat role :", res);
      const status = res.status;
      if (status === 200) {
        setIsSuccessOpen(true);
        setSuccessMessage("نقش با موفقیت حذف شد.");

        setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleId));
        fetchGetRoles();
      }
    } catch (err) {
      console.error("خطا در حذف نقش:", err.message);

      if (err.response) {
        if (err.response.status === 404) {
          setIsWarningOpen(true);
          setWarningMessage(`رول با این اسم پیدا نشد ${roleId}`);
        } else if (err.response.status === 403 || err.response.status === 401) {
          setIsWarningOpen(true);
          setWarningMessage(" شما مجوز حذف این نقش را ندارید.");
        }
      } else if (err.request) {
        setIsWarningOpen(true);
        setWarningMessage(" مشکلی در ارتباط با سرور وجود دارد.");
      }
    }
  };

  useEffect(() => {
    fetchGetRoles();
  }, [page]);
  return (
    <>
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
                    <th className="px-4 py-3 font-medium sm:table-cell">حذف</th>
                  </tr>
                </thead>

                <tbody>
                  {Roles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center">
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
                          <td className="px-4 py-3">
                            {rol.permissions && rol.permissions.length > 0 && (
                              <div className="max-h-20">
                                {rol.permissions.map((perm) => (
                                  <span
                                    key={perm.id}
                                    className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded m-0.5"
                                  >
                                    {perm.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td>
                            <RiDeleteBinLine
                              size={20}
                              color="red"
                              className="cursor-pointer"
                              onClick={() => {
                                const confirmDelete = window.confirm(
                                  `آیا مطمئن هستید که می‌خواهید نقش "${rol.name}" را حذف کنید؟`,
                                );
                                if (confirmDelete) {
                                  handelDleatRole(rol.id);
                                }
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <ComponentPaginat
              currentPage={page}
              totalPages={totalPage}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        message={successMessage}
      />

      <WarningModal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        message={WarningMessage}
      />
    </>
  );
};

export default RolesPage;
