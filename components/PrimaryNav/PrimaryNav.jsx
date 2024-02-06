import Image from "next/image";
import PN_SearchBar from "./SubComps/PN_SearchBar";
import CategorySlider from "../CategorySlider/CategorySlider";
import { FunnelIcon } from "@heroicons/react/24/solid";

const PrimaryNav = ({
  companyInfo,
  activeCategory,
  activeCategoryCallback,
  openAboutUsModalCallback,
  openFiltersModalCallback,
}) => {
  function categoryChangedCallback(categoryName) {
    activeCategoryCallback(categoryName);
  }

  function requestOpenAboutUsModalCallback() {
    openAboutUsModalCallback();
  }

  return (
    <>
      <section className="sticky top-0 flex flex-col justify-center items-center w-full gap-4 py-4 pb-4 bg-gradient-to-b from-white from-95% rounded-b-xl z-40">
        <div className="flex flex-col md:flex-row justify-center items-cemter w-full max-w-full gap-4">
          {/* Brand Section */}
          <section className="flex px-4 gap-4 w-full md:w-[80%] items-center">
            {/* Logo Div */}
            <div className="rounded-2xl overflow-clip aspect-square h-14 relative shadow-inner">
              <Image
                src={companyInfo.companyLogo}
                blurDataURL={companyInfo.companyLogo}
                alt="Company Logo"
                quality={100}
                fill
                style={{ objectFit: "cover" }}
                placeholder="blur"
              />
            </div>

            {/* Name & About Div */}
            <div>
              <h1 className="font-medium text-lg">{companyInfo.companyName}</h1>
              <button
                className="px-2 py-[4px] bg-gray-200 text-gray-600 font-normal text-xs rounded-md"
                onClick={() => requestOpenAboutUsModalCallback()}
              >
                About Us
              </button>
            </div>
          </section>

          {/* Search Section */}
          {/*
            <section className="w-full md:w-1/3 px-4">
              <PN_SearchBar />
            </section>
          */}

          {/* Filter Section */}
          <section className="flex items-center justify-center w-full md:w-[20%] px-4 gap-2">
            {/*<PN_SearchBar />*/}
            <button
              className="flex items-center justify-center px-4 py-2 gap-4 font-medium text-white bg-tif-blue rounded-full shadow-lg w-full"
              onClick={() => openFiltersModalCallback()}
            >
              <FunnelIcon className="w-5 h-5" />
              <h1>Filters</h1>
            </button>
          </section>
        </div>

        <CategorySlider
          categoryItems={companyInfo.categories}
          id="PrimaryCatSlider"
          currActiveCategory={activeCategory}
          activeCategoryCallback={categoryChangedCallback}
        />
      </section>

      {/* About Us Modal */}
      {/*
        <section className="absolute flex flex-col m-auto top-0 bottom-0 left-0 right-0 pt-20 p-4 bg-gradient-to-t from-[rgb(0,0,0,0.7)] from-60% bg-opacity-70 z-50">
          <div className="h-4 w-4 ml-20 -mb-2 rotate-45 bg-white"></div>
          <div className="flex flex-col shrink-0 justify-between items-center p-6 w-full bg-white rounded-2xl shadow-xl">
            <div className="rounded-full overflow-clip aspect-square w-[50%] relative border-2 border-black shadow-inner">
              <Image
                src={companyInfo.companyLogo}
                alt="Company Logo"
                quality={100}
                fill
                style={{ objectFit: "cover" }}
                placeholder="blur"
                blurDataURL={companyInfo.companyLogo}
              />
            </div>
          </div>
        </section>
      */}
    </>
  );
};

export default PrimaryNav;
