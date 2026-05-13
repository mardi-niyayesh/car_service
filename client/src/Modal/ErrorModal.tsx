import Modal from "react-modal";

Modal.setAppElement("#root");

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
}

const ErrorModal = ({
  isOpen,
  onClose,
  message,
  title = "خطا!",
}: ErrorModalProps) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "12px",
      padding: "2rem",
      maxWidth: "400px",
      width: "90%",
      direction: "rtl" as const,
      textAlign: "center" as const,
      border: "1px solid #fecaca",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel={title}
      closeTimeoutMS={300}
    >
      <div className="text-center">
        <div className="mb-4 text-red-500">
          {/* آیکون خطا */}
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-red-600">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <button
          onClick={onClose}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    </Modal>
  );
};

export default ErrorModal;
