import { useState, useEffect } from "react";
import ContainerHeader from "./ContainerHeader";

function HeaderSite() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100;
      if (window.scrollY > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerClasses = `
    ${isScrolled ? "fixed top-0 left-0 right-0 z-50 w-full" : "relative"}
    bg-white shadow-md 
  `;

  return (
    <div className="relative  bg-gray-100">
      <header className={headerClasses}>
        <ContainerHeader />
      </header>
    </div>
  );
}

export default HeaderSite;
