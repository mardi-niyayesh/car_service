import axiosClient from "../services/axiosClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiKey, FiCheckSquare } from "react-icons/fi";
import SuccessModal from "../Modal/SuccessModal";
import WarningModal from "../Modal/WarningModal ";
import { useUser } from "../hooks/useUser";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

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

type FormValues = {
  name: string;
  description?: string;
  ownership: boolean;
  permissions: string[];
};

const CreateCustomRolePage = () => {
  const { user } = useUser();
  const IsUserOwner = user?.roles?.includes("owner");
  const navigate = useNavigate();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [allroles, setAllRoles] = useState<RoleType[]>([]);
  const [loading, setLoading] = useState(false);

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      ownership: false,
      permissions: [],
    },
  });

  const fetchAllPermissions = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        "/permissions?order=desc&limit=17&page=1",
      );
      const getPermission = response.data.response.data.permissions;
      setPermissions(getPermission);
    } catch (err) {
      console.error("Error get list permissions :", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRoles = async () => {
    try {
      const response = await axiosClient.get(
        `/roles?order=desc&limit=10&page=1`,
      );
      const getallrole = response.data.response.data.roles;
      setAllRoles(getallrole);
    } catch (err) {
      console.log("Error in get All Roles : ", err);
    }
  };

  useEffect(() => {
    fetchAllPermissions();
    fetchAllRoles();
  }, []);

  const selectedPermissions = watch("permissions") || [];

  const handlePermissionChange = (permId: string) => {
    const newPermissions = selectedPermissions.includes(permId)
      ? selectedPermissions.filter((id) => id !== permId)
      : [...selectedPermissions, permId];
    setValue("permissions", newPermissions, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    const isDuplicate = allroles.some(
      (role) => role.name.toLowerCase() === data.name.trim().toLowerCase(),
    );
    if (isDuplicate) {
      setError("name", {
        message: `این نام قبلاً برای نقش "${data.name}" استفاده شده است.`,
      });
      return;
    }

    if (!data.permissions || data.permissions.length === 0) {
      setError("permissions", {
        message: "حداقل یک دسترسی باید انتخاب شود",
      });
      return;
    }

    try {
      const payload: any = {
        name: data.name.trim(),
        permissions: data.permissions,
      };
      if (data.description?.trim()) {
        payload.description = data.description.trim();
      }
      if (data.ownership) {
        payload.ownership = true;
      }

      const response = await axiosClient.post("/roles", payload);
      console.log("response create custom role :", response);
      setIsSuccessOpen(true);
      setSuccessMessage("رول با موفقیت ساخته شد :)");
      setTimeout(() => {
        navigate("/panel/roles");
      }, 2000);
    } catch (err: any) {
      console.log("Error in response create custom role", err);

      if (err.response?.status === 409) {
        setError("name", {
          message: "نام نقش تکراری است",
        });
      } else {
        setWarningMessage("خطا در ایجاد نقش جدید");
        setIsWarningOpen(true);
      }
    }
  };

  const generalPermissions = permissions.filter(
    (p) =>
      !p.name.startsWith("role.") &&
      !p.name.startsWith("user.") &&
      p.name !== "owner.all",
  );

  const adminPermissions = permissions.filter(
    (p) =>
      p.name.startsWith("role.") ||
      p.name.startsWith("user.") ||
      p.name === "owner.all",
  );

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-xl font-bold mb-6">ساخت نقش سفارشی جدید</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">اطلاعات نقش</h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                نام نقش
                <span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "نام نقش الزامی است",
                  minLength: {
                    value: 2,
                    message: "نام نقش باید حداقل ۲ کاراکتر باشد",
                  },
                  maxLength: {
                    value: 100,
                    message: "نام نقش حداکثر ۱۰۰ کاراکتر مجاز است",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: "فقط حروف انگلیسی، اعداد و زیرخط (_) مجاز است",
                  },
                })}
                className={`w-full p-2 border rounded ${
                  errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="مثال: admin"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                توضیحات
                <span className="text-gray-400">(اختیاری)</span>
              </label>
              <textarea
                {...register("description", {
                  minLength: {
                    value: 10,
                    message: "در صورت وارد کردن، حداقل ۱۰ کاراکتر",
                  },
                  maxLength: {
                    value: 500,
                    message: "حداکثر ۵۰۰ کاراکتر مجاز است",
                  },
                })}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="توضیح..."
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
              <Controller
                name="ownership"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-5 h-5 text-yellow-600 rounded ml-2"
                  />
                )}
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
              <p className="text-gray-500">در حال دریافت دسترسی‌ها...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 rounded bg-gray-50">
                  <h3 className="font-medium mb-2 flex items-center">
                    <FiCheckSquare className="ml-2 text-green-600" size={23} />
                    دسترسی‌های عمومی
                  </h3>
                  <div className="space-y-2">
                    {generalPermissions.map((perm) => (
                      <label
                        key={perm.id}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={() => handlePermissionChange(perm.id)}
                          className="ml-2"
                        />
                        <span className="text-sm">{perm.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {IsUserOwner && adminPermissions.length > 0 && (
                  <div className="p-3 rounded bg-gray-50">
                    <h3 className="font-medium mb-2 flex items-center">
                      <FiKey className="ml-2 text-red-500" size={23} />
                      دسترسی‌های مدیریتی (مخصوص Owner)
                    </h3>
                    <div className="space-y-2">
                      {adminPermissions
                        .filter(
                          (perm) =>
                            perm.name !== "user.self" &&
                            perm.name !== "owner.all",
                        )
                        .map((perm) => (
                          <label
                            key={perm.id}
                            className="flex items-center cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(perm.id)}
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
                قبل از دادن نقش، می‌توانید برای خواندن توضیحات هر نقش کلیک کنید
              </p>
            </Link>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/panel/roles")}
              className="px-6 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              لغو
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className={`px-6 py-2 rounded text-white ${
                isSubmitting || loading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "در حال ساخت..." : "ذخیره نقش"}
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
        message={warningMessage}
      />
    </>
  );
};

export default CreateCustomRolePage;
