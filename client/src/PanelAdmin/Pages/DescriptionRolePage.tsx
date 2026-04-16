import axiosClient from "../../services/axiosClient";
//hooks
import { useState, useEffect } from "react";

type RoleType = {
  id: string;
  name: string;
  description: string;
};

const DescriptionRole = () => {
  const [roles, setRoles] = useState<RoleType[]>([]);

  const fetchRoles = async () => {
    try {
      const response = await axiosClient.get(
        `/permissions?order=desc&limit=10&page=1`,
      );

      const getRoles = response.data.response.data.permissions;
      console.log(getRoles);

      if (Array.isArray(getRoles)) {
        setRoles(getRoles);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {roles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((rol) => (
            <div
              key={rol.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <p className="text-lg font-semibold text-gray-800 mb-2">
                اسم نقش:
              </p>
              <span className="text-green-700 block mb-4">{rol.name}</span>
              <p className="text-lg font-semibold text-gray-800 mb-2">
                توضیحات نقش:
              </p>
              <span className="text-blue-400 block">{rol.description}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">
          در حال بارگیری نقش‌ها...
        </p>
      )}
    </div>
  );
};

export default DescriptionRole;
