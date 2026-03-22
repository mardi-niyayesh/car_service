import React from 'react';

const Comment = () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8  mt-10">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-6 text-center">
        دیدگاهتان را بنویسید
      </h1>
      <form className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
        <p className="text-gray-600 mb-4 text-sm sm:text-base">نشانی ایمیل شما منتشر نخواهد شد</p>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            دیدگاه
          </label>
          <textarea
            id="comment"
            name="comment"
            rows="6"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-y"
            placeholder="نظر خود را اینجا بنویسید..."
          ></textarea>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="mb-4 sm:mb-0">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              نام
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="نام شما"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              ایمیل
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="test@example.com"
            />
          </div>
        </div>

        <div className="mt-6 flex items-start">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <div className="ml-2 flex items-center h-5">
            <label htmlFor="remember-me" className="text-sm text-gray-600">
              ذخیره نام، ایمیل در مرورگر برای زمانی که دوباره دیدگاهی می‌نویسم.
            </label>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 "
          >
            فرستادن دیدگاه
          </button>
        </div>
      </form>
    </div>
  );
};

export default Comment;
