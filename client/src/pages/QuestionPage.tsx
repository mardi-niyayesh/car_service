import ComponentQuestion from "../components/Main/Question/ComponentQuestion";
import CarParts from "../components/Main/CarParts";
const QuestionPage = () => {
  return (
    <>
      <div className="bg-[url('../../assets/question.png')] bg-cover bg-center bg-no-repeat w-full min-h-[250px] md:min-h-[400px] lg:min-h-[550px] xl:h-[683px] relative"></div>
      <ComponentQuestion />
      <CarParts />
    </>
  );
};

export default QuestionPage;
