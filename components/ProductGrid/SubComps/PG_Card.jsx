import Link from "next/link";
import { getFormattedPrice } from "@/utils/productInfoUtils";

const PG_Card = ({ productInfo }) => {
  return (
    <Link
      className="flex flex-col bg-white rounded-xl shadow-[0_0px_15px_3px_rgba(0,0,0,0.10)]"
      href={"/view/" + productInfo.productID}
    >
      <div
        id="card"
        className="flex flex-col px-2 pt-2 pb-4 gap-4 w-full h-72 md:h-80 lg:h-96 justify-center items-center relative"
      >
        <model-viewer
          src={productInfo.glb}
          ios-src={productInfo.usdz}
          poster={productInfo.poster}
          alt="3D model of the product"
          shadow-intensity="1"
          camera-controls
          touch-action="pan-y"
          auto-rotate
          autoplay
          //ar-modes="webxr scene-viewer quick-look"
          //ar-modes="webxr"
        ></model-viewer>

        <div className="flex flex-col w-full">
          <h1 className="text-sm font-medium truncate">
            {productInfo.productName}
          </h1>
          <h2 className="text-xs font-normal text-red-500">
            {getFormattedPrice(productInfo.currency, productInfo.price)}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default PG_Card;
