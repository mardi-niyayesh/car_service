import axiosClient from "../../services/axiosClient";

//request for creat custom role
const CreatCustomRoles = () => {
  try {
    const customroles = await axiosClient.post("/roles", {
      name: formData.name,
      description: formData.description,
      ownership: formData.ownership,
      permissions: formData.permissions,
    });
    console.log("response creat custom role :", customroles);
  } catch (err: any) {
    console.error("Error in response create custom role:", err);
    if (err.response) {
      console.error("Error response data:", err.response.data);
      console.error("Error response status:", err.response.status);
    } else if (err.request) {
      console.error("Error request:", err.request);
    } else {
      console.error("Error message:", err.message);
    }
  }
};

export default CreatCustomRoles;
