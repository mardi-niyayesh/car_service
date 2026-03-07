import { Link } from "react-router-dom";
const ComponentTableUser = () => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
      <table className="min-w-full  text-right text-sm text-gray-700">
        <thead className="bg-gray-100 text-gray-700 ">
          <tr>
            <th className="w-12 px-4 py-3 font-medium">ردیف</th>
            <th className="w-32 px-4 py-3 font-medium">کاربر</th>
            <th className="w-56 px-4 py-3 font-medium">ایمیل</th>
            <th className="w-20 px-4 py-3 font-medium">نقش</th>
            <th className="w-20 px-4 py-3 font-medium">جزعیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr className="hover:bg-gray-300 transition-colors">
            <td className="px-4 py-3">1</td>
            <td className="px-4 py-3">niya</td>
            <td className="px-4 py-3">niya@gmail.com</td>
            <td className="px-4 py-3 text-green-600 font-medium">ادمین</td>
            <Link to="/panel/users/detail">
              <td className="px-3 py-1 bg-blue-400 rounded-2xl text-amber-50 m-auto">
                بیش تر...
              </td>
            </Link>
          </tr>
          <tr className="hover:bg-gray-300 transition-colors">
            <td className="px-4 py-3">2</td>
            <td className="px-4 py-3">maryam</td>
            <td className="px-4 py-3">maryam@gmail.com</td>
            <td className="px-4 py-3 text-blue-400 font-medium">کاربر</td>
            <Link to="">
              <td className="px-3 py-1 bg-blue-400 rounded-2xl text-amber-50">
                بیش تر...
              </td>
            </Link>
          </tr>
          <tr className="hover:bg-gray-300 transition-colors">
            <td className="px-4 py-3">3</td>
            <td className="px-4 py-3">zahra</td>
            <td className="px-4 py-3 truncate">zahra@gmail.com</td>
            <td className="px-4 py-3 text-green-600 font-medium">ادمین</td>
            <Link to="">
              <td className="px-3 py-1 bg-blue-400 rounded-2xl text-amber-50">
                بیش تر...
              </td>
            </Link>
          </tr>
          <tr className="hover:bg-gray-300 transition-colors">
            <td className="px-4 py-3">4</td>
            <td className="px-4 py-3">nimaa</td>
            <td className="px-4 py-3 truncate">nimaa@gmail.com</td>
            <td className="px-4 py-3 text-blue-600 font-medium">کاربر</td>
            <Link to="">
              <td className="px-3 py-1 bg-blue-400 rounded-2xl text-amber-50">
                بیش تر...
              </td>
            </Link>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ComponentTableUser;
