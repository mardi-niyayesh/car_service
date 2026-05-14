import axiosClient from "../services/axiosClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiKey, FiCheckSquare } from "react-icons/fi";
import SuccessModal from "../Modal/SuccessModal";
import WarningModal from "../Modal/WarningModal ";
import { useUser } from "../hooks/useUser";
import { Link } from "react-router-dom";

type Permission = {
  id: string;
  name: string;
  description: string;
};
type RoleType = {
  id: string;
  name: string;
  description: string;
};

const CreateCustomRolePage = () => {
  const { user } = useUser();
  const IsUserOwner = user?.roles.includes("owner");
  //state for get all permesssions
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [loading, setloading] = useState(false);
  //state for get all roles
  const [allroles, setAllRoles] = useState<RoleType[]>([]);
  //show error
  const [nameError, setNameError] = useState<string | null>(null);
  //state for save form custom roles
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ownership: false,
    permissions: [],
  });

  const navigate = useNavigate();

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [WarningMessage, setWarningMessage] = useState("");

  // function for get All permession and save to state permession
  const fetchAllPermissions = async () => {
    setloading(true);
    try {
      const response = await axiosClient.get(
        "/permissions?order=desc&limit=17&page=1",
      );
      console.log("response for get permessions  :", response);

      const getpermession = response.data.response.data.permissions;
      console.log("get All permessions:", getpermession);

      setPermissions(getpermession);
    } catch (err) {
      console.error("Error in get list permessions :", err);
    } finally {
      setloading(false);
    }
  };

  // function for get All roles and save to state allroles
  const fetchAllRoles = async () => {
    setloading(true);
    try {
      const response = await axiosClient.get(
        `/roles?order=desc&limit=10&page=1`,
      );
      console.log("response to get all roles :", response);

      const getallrole = response.data.response.data.roles;
      console.log("response get role:", getallrole);

      setAllRoles(getallrole);
    } catch (err) {
      console.log("Error in get All Roles : ", err);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchAllPermissions();
    fetchAllRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("target :", e.target.value);

    if (name === "name") {
      const isDuplicate = allroles.some((role) => role.name === value);
      if (isDuplicate) {
        setNameError(`این نام قبلاً برای نقش "${value}" استفاده شده است.`);
      }
    } else {
      setNameError(null);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle for checkbox ownership
  const handleOwnershipChange = (e) => {
    setFormData((prev) => ({ ...prev, ownership: e.target.checked }));
    console.log(" e.target.checked ownership :", e.target.checked);
  };

  //handle for checkbox ownership
  const handlePermissionChange = (permId: string) => {
    setFormData((prev) => {
      const NowPerm = prev.permissions;
      // if permession is tick checkbox => not tick checkbox
      if (NowPerm.includes(permId)) {
        return {
          ...prev,
          permissions: NowPerm.filter((p) => p !== permId),
        };
      }
      // if permession is not tick checkbox =>  tick checkbox
      else {
        return { ...prev, permissions: [...NowPerm, permId] };
      }
    });
  };

  //send form to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nameError) {
      alert("لطفاً نام نقش را اصلاح کنید.");
      return;
    }
    try {
      if (!formData.ownership) {
        //find permessions to start with role or user
        const restartpermession = permissions.filter(
          (p) =>
            p.name.startsWith("role.") ||
            p.name.startsWith("user.") ||
            p.name === "owner.all",
        );

        const invalidPerms = restartpermession.filter((r) =>
          formData.permissions.includes(r.id),
        );

        if (invalidPerms.length > 0) {
          throw new Error(
            "شما مجوز انتخاب دسترسی‌های مدیریتی را ندارید. لطفاً ابتدا تیک 'نقش مالکیت' را فعال کنید.",
          );
        }
      }
      //request for creat custom role
      const customroles = await axiosClient.post("/roles", {
        name: formData.name,
        description: formData.description,
        ownership: formData.ownership,
        permissions: formData.permissions,
      });
      console.log("response creat custom role :", customroles);
      setIsSuccessOpen(true);
      setSuccessMessage("رول با موفقیت ساخته شد :)");
      setTimeout(() => {
        navigate("/panel/roles");
      }, 2000);
    } catch (err) {
      console.log("Error in response creat custom role", err);

      setIsWarningOpen(true);
      setSuccessMessage("خطا در ایجاد نقش جدید ");
    }
  };

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-xl font-bold mb-6">ساخت نقش سفارشی جدید</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">اطلاعات نقش</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                نام نقش
                <span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${nameError ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                placeholder="مثال: ادیتور"
                required
              />
              {nameError && (
                <p className="text-red-600 text-sm mt-1">{nameError}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                توضیحات
                <span className="text-gray-400">(اختیاری)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="توضیحی درباره این نقش..."
              />
            </div>

            <div className="flex items-center mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
              <input
                type="checkbox"
                checked={formData.ownership}
                onChange={handleOwnershipChange}
                className="w-5 h-5 text-yellow-600 rounded ml-2"
              />
              <label className="block text-sm font-medium text-gray-700">
                مالکیت (Ownership)
              </label>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">
              انتخاب دسترسی‌ها
              <span className="text-red-500"> *</span>
            </h2>

            {permissions.length === 0 ? (
              <p className="text-gray-500">در حال دریافت پرمشن ها...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className=" p-3 rounded bg-gray-50">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FiCheckSquare className="ml-2 text-green-600" size={23} />
                    دسترسی‌های عمومی
                  </h3>
                  <div className="space-y-2">
                    {permissions
                      .filter(
                        (p) =>
                          !p.name.startsWith("role.") &&
                          !p.name.startsWith("user.") &&
                          p.name !== "owner.all",
                      )
                      .map((perm) => (
                        <label
                          key={perm.id}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(perm.id)}
                            onChange={() => handlePermissionChange(perm.id)}
                            className="ml-2"
                          />
                          <span className="text-sm">{perm.name}</span>
                        </label>
                      ))}
                  </div>
                </div>

                {IsUserOwner && (
                  <div className=" p-3 rounded bg-gray-50">
                    <h3 className="font-medium mb-2 flex items-center">
                      <FiKey className="ml-2 text-red-500" size={23} />
                      دسترسی‌های مدیریتی (مخصوص Owner)
                    </h3>
                    <div className="space-y-2">
                      {permissions
                        .filter(
                          (p) =>
                            p.name.startsWith("role.") ||
                            p.name.startsWith("user.") ||
                            p.name === "owner.all",
                        )
                        .map((perm) => (
                          <label
                            key={perm.id}
                            className="flex items-center cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(perm.id)}
                              onChange={() => handlePermissionChange(perm.id)}
                              className="ml-2"
                            />
                            <span className="text-sm">{perm.name}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <Link to="description">
              <p className="text-blue-800 mt-3 hover:text-blue-600">
                قبل از دادن نقش. میتوانید برای خواندن توضیحات هر نقش کلیک کنید
              </p>
            </Link>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              لغو
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? "در حال ساخت..." : "ذخیره نقش"}
            </button>
          </div>
        </form>
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

export default CreateCustomRolePage;
