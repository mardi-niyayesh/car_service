type description = {
  img: string;
  title: string;
  des: string;
};
const ComponentDetail = ({ img, title, des }: description) => {
  return (
    <div className="container mx-auto p-6">
      <img
        src={img}
        alt={title}
        className="w-full max-h-96 object-cover rounded-lg"
      />
      <h1 className="text-3xl font-bold my-4 text-blue-800">{title}</h1>
      <p className="text-gray-700 leading-8 text-lg">{des}</p>
    </div>
  );
};

export default ComponentDetail;
