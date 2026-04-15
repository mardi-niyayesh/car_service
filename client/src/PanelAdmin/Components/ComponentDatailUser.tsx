import axiosClient from "../../services/axiosClient";
//icon
import { FaUser } from "react-icons/fa";
//hooks
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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
  console.log("userId:", userId);

  //get information user
  const [user, setUser] = useState<User | null>(null);

  //get all roles
  const [roles, setRoles] = useState<Role[]>([]);

  //get select rolesId
  const [selectedRoleId, setSelectedRoleId] = useState<string[]>([]);
  console.log("selectedRoleId:", selectedRoleId);

  const fetchUser = async (allRoles: Role[]) => {
    if (!userId) {
      console.log("userId  missing.");
      setUser(null);
      return;
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

  const giveRolse = async () => {
    console.log("selectedRoleId:", selectedRoleId);
    try {
      //find Id role = self
      const selfRoleId = roles.find((r) => r.name === "self")?.id;
      // filter roles az self role
      const filteredRoleIds = selectedRoleId.filter((id) => id !== selfRoleId);
      const response = await axiosClient.post(`/users/${userId}/roles`, {
        rolesId: filteredRoleIds,
      });
      console.log("selectedRoleId  :", selectedRoleId);
      console.log("response  giveRoles", response);
      console.log("back  in filter :", selectedRoleId);
      console.log("Next in filter  :", filteredRoleIds);
    } catch (err) {
      console.log("Error  giveRoles :", err);
      console.log("selectedRoleId  :", selectedRoleId);
    }
  };

  useEffect(() => {
    const init = async () => {
      const allRoles = await getRoles();
      await fetchUser(allRoles);
    };
    init();
  }, [userId]);

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId((prev) => {
      if (prev.includes(roleId)) {
        return prev.filter((id) => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const isRoleDisabled = (roleName: string) => {
    if (["owner", "self"].includes(roleName)) {
      return true;
    }
    return false;
  };

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
              <p className="text-sm text-gray-500 font-medium">ایمیل</p>
              <p className="text-base text-gray-700">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">اسم</p>
              <p className="text-base text-gray-600 font-medium">
                {user.display_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">سن</p>
              <p className="text-base text-gray-700">{user.age}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">نقش های فعلی</p>
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
          onClick={giveRolse}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ثبت تغییرات
        </button>
      </div>
    </>
  );
};

export default ComponentCategoryDatailUser;
