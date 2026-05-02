import axiosClient from "../../services/axiosClient";

 const UserService= {
  // fetch information user
  getUserById: async (userId: string) => {
    const response = await axiosClient.get(`/users/find?id=${userId}`);
    return response.data.response.data.user;
  },

  // get All roles
  getAllRoles: async () => {
    const response = await axiosClient.get("/roles?order=desc&limit=10&page=1");
    return response.data.response.data.roles;
  },

  // Add roles
  addRoles: async (userId: string, rolesId: string[]) => {
    return await axiosClient.post(`/users/${userId}/roles`, { rolesId });
  },

  // deleat role
  removeRoles: async (userId: string, rolesId: string[]) => {
    return await axiosClient.delete(`/users/${userId}/roles`, {
      data: { rolesId },
    });
  },
};
export default UserService