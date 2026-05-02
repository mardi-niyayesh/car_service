

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ">
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </div>

        <div className="border-b-2 border-gray-200 mb-4"></div>

        <div className="text-gray-700 text-base">{children}</div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
