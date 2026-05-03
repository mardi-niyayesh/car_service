import axios from "axios";
import axiosClient from "../../services/axiosClient";
import { useEffect } from "react";

const ComponentTableCategory = () => {
  const GetAllCategory = async () => {
    try {
      const resCat = await axiosClient .get(`/categories?page=1&limit=10&order=desc`);
     const getcat= resCat.data.response.data.categories
      console.log("response to grt all category :",resCat.data);
    } catch (err) {
      console.log("Error in fetch All category :", err);
    }
  };
  useEffect(()=>{
    GetAllCategory()
  },[])

  return (
    <div>
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
        <table className="min-w-full  text-right text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-700 ">
            <tr>
              <th className="w-12 px-4 py-3 font-medium">ردیف</th>
              <th className="w-32 px-4 py-3 font-medium"> دسته بندی </th>
              <th className="w-56 px-4 py-3 font-medium">لینک</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-300 transition-colors">
              <td className="px-4 py-3">1</td>
              <td className="px-4 py-3">دسته بندی 1</td>
              <td className="px-4 py-3 text-blue-400 font-medium">/carr </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComponentTableCategory;
