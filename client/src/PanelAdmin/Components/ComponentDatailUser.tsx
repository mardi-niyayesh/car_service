import axiosClient from "../../services/axiosClient";
//icon
import { FaUser } from "react-icons/fa";
//hooks
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//Modal
import SuccessModal from "../../components/common/SuccessModal";
import WarningModal from "../../components/common/WarningModal ";

type User = {
  id: number;
  display_name: string;
  email: string;
  roles: string[] | string;
  age: number;
};

type Role = {
  id: string;
  name: string;
  permissions: string[];
};

const ComponentCategoryDatailUser = () => {
  const { userId } = useParams();
  // console.log("userId:", userId);

  //success Modal
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  //Warning Modal
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [WarningMessage, setWarningMessage] = useState("");

  //get information user
  const [user, setUser] = useState<User | null>(null);

  //get all roles
  const [roles, setRoles] = useState<Role[]>([]);

  //get select rolesId
  const [selectedRoleId, setSelectedRoleId] = useState<string[]>([]);
  // console.log("selectedRoleId:", selectedRoleId);

  //for get initial Role
  const [initialRoles, setInitialRoles] = useState<string[]>([]);
  // console.log("initialRoles:", initialRoles);

  const fetchUser = async (allRoles: Role[]) => {
    if (!userId) {
      console.log("userId  missing.");
      setUser(null);
      return;
      alert();
    }
    try {
      const response = await axiosClient.get(`/users/find?id=${userId}`);
      const userData = response.data.response.data.user;
      setUser(userData);

      const userRoleNames = Array.isArray(userData.roles)
        ? userData.roles
        : [userData.roles];

      console.log("userRoleNames :", userRoleNames);

      //convert name roles to id Roles
      const userRoleIds = allRoles
        .filter((role) => userRoleNames.includes(role.name))
        .map((role) => role.id);

      setSelectedRoleId(userRoleIds);
      setInitialRoles(userRoleIds);
    } catch (err) {
      console.log("Error in get users :", err);
      setUser(null);
    }
  };

  const getRoles = async () => {
    const response = await axiosClient.get("/roles?order=desc&limit=10&page=1");
    const allRoles = response.data.response.data.roles;
    setRoles(allRoles);
    return allRoles;
  };

  useEffect(() => {
    const init = async () => {
      const allRoles = await getRoles();
      await fetchUser(allRoles);
    };
    init();
  }, [userId]);

  const handleSaveChanges = async () => {
    if (!user || !userId || !roles || roles.length === 0) return;

    // add roles => to selectedRoleId but not initialRoles
    const RolesToAdd = selectedRoleId.filter(
      (id) => !initialRoles.includes(id),
    );
    console.log("Roles To Add :", RolesToAdd);

    //remove rolse => to initialRoles but not selectedRoleId
    const RolesToRemove = initialRoles.filter(
      (id) => !selectedRoleId.includes(id),
    );
    console.log("Roles To Remove :", RolesToRemove);

    //get Id self role
    const selfroleId = roles.find((rol) => rol.name === "self")?.id;
    //get Id owner role
    const ownerroleId = roles.find((rol) => rol.name === "owner")?.id;

    const filterRolesToRemove = RolesToRemove.filter(
      (id) => id !== selfroleId && id !== ownerroleId,
    );
    console.log("filter Roles To Remove :", filterRolesToRemove);

    const filterRolesToAdd = RolesToAdd.filter(
      (id) => id !== selfroleId && id !== ownerroleId,
    );
    console.log("filter Roles To Add :", filterRolesToAdd);

    try {
      if (filterRolesToAdd.length > 0) {
        const responseAd = await axiosClient.post(`/users/${userId}/roles`, {
          rolesId: filterRolesToAdd,
        });
        console.log("response to add roles : ", responseAd);
        console.log("Add roles:", filterRolesToAdd);
        setSelectedRoleId(selectedRoleId);
        setInitialRoles(selectedRoleId);
      }
      if (filterRolesToRemove.length > 0) {
        const responseRemov = await axiosClient.delete(
          `/users/${userId}/roles`,
          {
            data: {
              rolesId: filterRolesToRemove,
            },
          },
        );
        console.log("response to remove roles : ", responseRemov);
        console.log("Removed roles:", filterRolesToRemove);
        setSelectedRoleId((prev) =>
          prev.filter((id) => !filterRolesToRemove.includes(id)),
        );
        setInitialRoles((prev) =>
          prev.filter((id) => !filterRolesToRemove.includes(id)),
        );
      }
      //for updat initialRole
      setInitialRoles((prev) => [...prev]);
      setIsSuccessOpen(true)
      setSuccessMessage("تغییرات با موفقیت انجامم شد:)");
    } catch (err) {
      console.log("Error in change roles:", err);
      setIsWarningOpen(true)
      setWarningMessage("خطا در انجام تغییرات :(");
    }
  };

  //roleId = role.id
  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId((prev) => {
      if (prev.includes(roleId)) {
        return prev.filter((id) => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };
  //roleName = role.name
  const isRoleDisabled = (roleName: string) => {
    if (["owner", "self"].includes(roleName)) {
      return true;
    }
    return false;
  };
  //roleId = role.id
  const isRoleChecked = (roleId: string) => {
    return selectedRoleId.includes(roleId);
  };

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
              <p className="text-sm text-gray-500 font-medium">ایمیل:</p>
              <p className="text-base text-gray-700">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">اسم:</p>
              <p className="text-base text-gray-600 font-medium">
                {user.display_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">سن :</p>
              <p className="text-base text-gray-700">{user.age}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                نقش های فعلی :
              </p>
              <p className="text-base text-green-600 font-medium">
                {Array.isArray(user.roles) ? user.roles.join(", ") : user.roles}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-white p-4 rounded-lg shadow border border-gray-200">
        <h3 className="font-bold mb-4 text-lg">نقش‌های قابل اختصاص:</h3>
        <div className="space-y-2">
          {roles.map((role) => {
            const isChecked = isRoleChecked(role.id);
            const isDisabled = isRoleDisabled(role.name);
            return (
              <label
                key={role.id}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => handleRoleChange(role.id)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="flex items-center gap-2">
                  <span className="font-medium">{role.name}</span>
                  {isDisabled && (
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      غیرقابل اختصاص
                    </span>
                  )}
                </span>
              </label>
            );
          })}
        </div>

        <button
          onClick={handleSaveChanges}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ثبت تغییرات
        </button>
        <Link to="description">
          <div className="hover:text-blue-600  mt-2">
            برای خواندن توضیحات هر نقش کلیک کنید
          </div>
        </Link>
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

export default ComponentCategoryDatailUser;
