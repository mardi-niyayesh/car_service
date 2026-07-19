import DesctiptionComponent from "../components/Main/DesctiptionComponent";
import ItemRoles from "./DataRolePage";
const RolsPage = () => {
  return (
    <>
      <div className="bg-[url('../../assets/imges/pagerole.png')] bg-cover bg-center bg-no-repeat w-full min-h-[250px] md:min-h-[400px] lg:min-h-[550px] xl:h-[683px] relative"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {ItemRoles.map((item) => (
            <DesctiptionComponent
              key={item.id}
              title={item.title}
              descriptions={item.descriptions}
              description={item.description}
              type={item.type}
            />
          ))}
        </div>
      </div>
    </>
  );
};
export default RolsPage;
