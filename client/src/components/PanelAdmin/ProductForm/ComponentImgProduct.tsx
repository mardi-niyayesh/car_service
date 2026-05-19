import { useParams } from "react-router-dom";
const ComponentImgProduct = () => {
  const { id } = useParams();
  console.log(id);
  
  return <div>hhhhhhhhhhhhi</div>;
};

export default ComponentImgProduct;
