const coulmn = [
  {
    to: "users/detail",
    number: "1",
    nameUser: "niya",
    EmailUser: "niya@gmail.com",
    role:"کاربر",
    more: " بیش تر...",
  },
  {
    to: "users/detail",
    number: "2",
    nameUser: "niya",
    EmailUser: "niya@gmail.com",
     role:"کاربر",
    more: " بیش تر...",
  },
  {
    to: "users/detail",
    number: "3",
    nameUser: "niya",
    EmailUser: "niya@gmail.com",
     role:"کاربر",
    more: " بیش تر...",
  },
  {
    to: "users/detail",
    number: "4",
    nameUser: "niya",
    EmailUser: "niya@gmail.com",
    role: "ادمین",
    more: " بیش تر...",
  },
];
import { Link } from "react-router-dom";

const ComponentTableUser = () => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
      <table className="min-w-full  text-right text-sm text-gray-700">
        <thead className="bg-gray-100 text-gray-700 ">
          <tr>
            <th  className="w-12 px-4 py-3 font-medium hidden sm:table-cell">ردیف</th>
            <th  className="w-12 px-4 py-3 font-medium hidden  sm:table-cell">کاربر</th>
            <th className="w-12 px-4 py-3 font-medium  sm:table-cell">ایمیل</th>
            <th  className="w-12 px-4 py-3 font-medium  sm:table-cell">نقش</th>
            <th  className="w-12 px-4 py-3 font-medium  sm:table-cell">جزعیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {coulmn.map((item) => (
            <tr className="hover:bg-gray-300 transition-colors  active:bg-gray-400">
              <td className="px-4 py-3 hidden sm:table-cell">{item.number}</td>
              <td className="px-4 py-3 hidden sm:table-cell">{item.nameUser}</td>
              <td className="px-4 py-3 ">{item.EmailUser}</td>
              <td className="px-4 py-3 text-green-600 font-medium">
                {item.role}
              </td>
              <Link to={item.to}>
                <td className="px-3 py-1 bg-blue-400 rounded-2xl text-amber-50 m-auto">
                  {item.more}
                </td>
              </Link>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComponentTableUser;
