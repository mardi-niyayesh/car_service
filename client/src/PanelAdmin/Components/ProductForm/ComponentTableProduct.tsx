const ComponentTableProduct = () => {
  return (
    <div>
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
        <table className="min-w-full  text-right text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-700 ">
            <tr>
              <th className="w-12 px-4 py-3 font-medium">ردیف</th>
              <th className="w-32 px-4 py-3 font-medium">عنوان </th>
              <th className="w-56 px-4 py-3 font-medium">قیمت</th>
              <th className="w-20 px-4 py-3 font-medium">دسته بندی</th>
             
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-300 transition-colors">
              <td className="px-4 py-3">1</td>
              <td className="px-4 py-3">محصول 1</td>
              <td className="px-4 py-3">240000</td>
              <td className="px-4 py-3 text-blue-400 font-medium">
                دسته بندی
              </td>
            </tr>
            <tr className="hover:bg-gray-300 transition-colors">
              <td className="px-4 py-3">2</td>
              <td className="px-4 py-3">محصول 2</td>
              <td className="px-4 py-3">50000</td>
              <td className="px-4 py-3 text-blue-400 font-medium">دسته بندی</td>
            </tr>
            <tr className="hover:bg-gray-300 transition-colors">
              <td className="px-4 py-3">3</td>
              <td className="px-4 py-3">محصول 3</td>
              <td className="px-4 py-3">5026000</td>
              <td className="px-4 py-3 text-blue-400 font-medium">دسته بندی</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComponentTableProduct;
