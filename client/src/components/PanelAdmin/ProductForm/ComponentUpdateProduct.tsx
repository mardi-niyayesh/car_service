import { useParams } from "react-router-dom";
const ComponentUpdateProduct = () => {
  const { id } = useParams<{ id: string }>();
  console.log("Id for a car :", id);

  return <div>teeeeeeeest</div>;
};

export default ComponentUpdateProduct;
