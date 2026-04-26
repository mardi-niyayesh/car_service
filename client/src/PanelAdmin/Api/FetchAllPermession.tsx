import axiosClient from "../../services/axiosClient";

// function for get All permession and save to state permession
const FetchAllPermession = async () => {
  try {
    const response = await axiosClient.get(
      "/permissions?order=desc&limit=17&page=1",
    );
    console.log("response for get permessions  :", response);

    const getpermession = response.data.response.data.permissions;
    console.log("get All permessions:", getpermession);
  } catch (err) {
    console.error("Error in get list permessions :", err);
  }
};
export default FetchAllPermession;
