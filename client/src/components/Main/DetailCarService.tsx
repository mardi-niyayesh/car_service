import detail from "./DataDetailCarService";
import { FaArrowLeft } from "react-icons/fa";
import Modal from "./Modal";
import { useState } from "react";

const DetailCarService = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savetitle, setSavetitle] = useState("");
  const [savetext, setSavetext] = useState("");

  const openModal = (item) => {
    setIsModalOpen(true);
    setSavetitle(item.title);
    setSavetext(item.text);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSavetitle("");
  };

  return (
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 mt-0 ">
      {detail.map((item, index) => (
        <div
          key={index}
          className="flex flex-col justify-between bg-white rounded-lg shadow-2xl p-4"
        >
          <div className="flex items-center mb-2">
            {item.icon}
            <div className="ml-2 text-gray-500 pr-2">{item.title}</div>
          </div>

          <div className="border-b-2 border-gray-300 my-3"></div>
          <div
            onClick={() => openModal(item)}
            className="flex font-medium items-center justify-between   hover:text-yellow-600 cursor-pointer"
          >
            <div className=" text-yellow-600 font-bold">جزئیات بیشتر</div>
            <FaArrowLeft size={24} opacity={0.5} />
          </div>
        </div>
      ))}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={savetitle}>
        <p className="text-gray-700">{savetext}</p>
      </Modal>
    </div>
  );
};

export default DetailCarService;
