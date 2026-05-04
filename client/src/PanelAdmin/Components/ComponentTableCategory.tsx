import { useState, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import axiosClient from "../../services/axiosClient";
import ComponentPaginat from "../../ComponentPublic/ComponentPaginat";
type CategoryType = {
  id: string;
  name: string;
  description: string;
};

const ComponentTableCategory = (): React.ReactElement => {
  const [getcat, setGetcat] = useState<CategoryType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(5);
  const GetAllCategory = async () => {
    try {
      const resCat = await axiosClient.get(
        `/categories?page=${page}&limit=5&order=desc`,
      );
      const Allcat = resCat.data.response.data.categories;
      const count = resCat.data.response.data.count;

      const tota = Math.ceil(count / 5);
      setTotalPage(tota);
      console.log("response to grt all category :", Allcat);
      setGetcat(Allcat);
    } catch (err) {
      console.log("Error in fetch All category :", err);
    }
  };
  useEffect(() => {
    GetAllCategory();
  }, []);

  const handleDeleatCategory = () => {};
  const handleupdatCategory = () => {};

  return (
    <div>
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
        <table className="min-w-full  text-right text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-700 ">
            <tr>
              <th className="w-12 px-4 py-3 font-medium">ردیف</th>
              <th className="w-32 px-4 py-3 font-medium"> دسته بندی </th>
              <th className="w-56 px-4 py-3 font-medium">توضیحات</th>
              <th className="w-56 px-4 py-3 font-medium">آپدیت</th>
              <th className="w-56 px-4 py-3 font-medium">حذف</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {getcat.map((cat, index) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 text-green-500">{cat.name}</td>
                <td className="inline-block font-medium m-2  text-gray-700 text-xs px-2 py-1 rounded m-0.5">
                  {cat.description}
                </td>
                <td>
                  {
                    <FaPencilAlt
                      size={20}
                      color="blue"
                      opacity={0.5}
                      className="cursor-pointer"
                      onClick={() => {
                        handleDeleatCategory;
                      }}
                    />
                  }
                </td>
                <td>
                  {
                    <RiDeleteBinLine
                      size={20}
                      color="red"
                      opacity={0.8}
                      className="cursor-pointer"
                      onClick={() => {
                        handleupdatCategory;
                      }}
                    />
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ComponentPaginat
        currentPage={page}
        totalPages={totalPage}
        onPageChange={setPage}
      />
    </div>
  );
};

export default ComponentTableCategory;
