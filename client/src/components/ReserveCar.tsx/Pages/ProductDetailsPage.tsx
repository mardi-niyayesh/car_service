//hooks
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//components
import DetailCarComponent from "../Details/DetailCarComponent";

//img car هایما
import tara from "../../../../assets/tara.png";
import dettara from "../../../../assets/dettara.jpg";
import sart3 from "../../../../assets/sari3.png";
//img car 207
import sari1 from "../../../../assets/sari1.png";
import det1207 from "../../../../assets/det1207.jpg";
import det2207 from "../../../../assets/det2207.jpg";
//img car 206
import sar206 from "../../../../assets/sari2.png";
import det206 from "../../../../assets/det206.jpg";
//img car هویندا النترا
import sart4 from "../../../../assets/sari4.png";
import dethunda from "../../../../assets/dethunda.jpg";
//img car راﻧﺎ پلاس
import rana from "../../../../assets/rana.png";
import detrana from "../../../../assets/detrana.jpg";
//img car پژو پرﺷﯿﺎ TU5
import pershia from "../../../../assets/PERSIA.png";
import Detper from "../../../../assets/detpershia.jpg";
import paneg from "../../../../assets/pngegg-1.png";

type CarDetail = {
  id: number;
  title: string;
  img: string[];
};

const allDetailCar: CarDetail[] = [
  { id: 3, title: "ﻫﺎﯾﻤﺎ S8 TURBO", img: [sart3, sart3, dettara] },
  { id: 2, title: "پژو ۲۰۶", img: [sar206, sar206, det206] },
  { id: 4, title: "هیوﻧﺪا اﻟﻨﺘﺮا ۲۰۱۷", img: [sart4, sart4, dethunda] },
  { id: 1, title: "پژو ۲۰۷ دنده‌ای", img: [sari1, sari1, det1207, det2207] },
  { id: 5, title: " راﻧﺎ پلاس", img: [rana, rana, detrana] },
  { id: 10, title: "  ﺗﺎرا اﺗﻮﻣﺎت", img: [tara,tara, dettara] },
  { id: 6, title: "پژو پرﺷﯿﺎ TU5", img: [pershia, pershia, Detper] },
  { id: 7, title: "هیوﻧﺪا اﻟﻨﺘﺮا ۲۰۱۷", img: [sart4, sart4, dethunda] },
  { id: 8, title: "پژو ۲۰۷ دنده‌ای", img: [sari1, sari1, det1207, det2207] },
  { id: 11, title: " کیا اسپورتیج ۲۰۱۸ ", img: [paneg] },
  { id: 12, title: " هیوﻧﺪای ﺳﺎﻧﺘﺎﻓﻪ", img: [tara,tara,dettara] },
]; 

const ProductDetailsPage = () => {
  const { carId } = useParams();
  const [carData, setCarData] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundCar = allDetailCar.find((car) => String(car.id) === carId);
    if (foundCar) {
      setCarData(foundCar);
    } else {
      setCarData(null);
      console.error("Car not found with ID:", carId);
    }
    setLoading(false);
  }, [carId]);

  if (loading) {
    return <div>در حال بارگذاری اطلاعات خودرو...</div>;
  }

  if (!carData) {
    return <div>خودرویی با این مشخصات یافت نشد.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <DetailCarComponent
        carTitle={carData.title}
        carImages={carData.img}
        id={carData.id}
      />
    </div>
  );
};

export default ProductDetailsPage;
