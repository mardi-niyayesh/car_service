import axiosClient from "../../services/axiosClient";

// function for get All roles and save to state allroles
const FetchAllRoles = async () => {
  try {
    const response = await axiosClient.get(`/roles?order=desc&limit=10&page=1`);
    console.log("response to get all roles :", response);

    const getallrole = response.data.response.data.roles;
    console.log("response get role:", getallrole);
  } catch (err) {
    console.log("Error in get All Roles : ", err);
  }
};
export default FetchAllRoles;
