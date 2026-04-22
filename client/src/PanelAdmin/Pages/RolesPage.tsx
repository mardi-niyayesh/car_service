import axiosClient from "../../services/axiosClient";
//hooks
import { useState, useEffect } from "react";
const RolesPage = () => {
  const [Roles, setRoles] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const fetchGetRoles = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(
        `/roles?order=desc&limit=10&page=${page}`,
      );
      console.log("response to Roles :", response);
      const getAllRoles = response.data.response.data.roles;
      const getCount = response.data.response.data.count;
      const tota = Math.ceil(getCount / 10);
      console.log("response get alll roles :", getAllRoles);
      console.log("get count all roles :", getCount);
      setTotalPage(tota);
      setRoles(getAllRoles);
    } catch (err) {
      console.log("Error in get all roles :", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGetRoles();
  }, []);
  return (
    <>
      {loading ? (
        <div> در حال دریافت همه رول ها ...</div>
      ) : (
        
          {Roles.map((rol) => {
            <div key={rol.id}>{rol.name }</div>;
          })}
       
      )}
    </>
  );
};

export default RolesPage;
