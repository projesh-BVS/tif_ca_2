import Link from "next/link";
import { getFormattedPrice } from "@/utils/productInfoUtils";
import { useEffect, useState } from "react";
import { DoesWishlistContain } from "@/utils/wishlistUtils";
import { HeartIcon } from "@heroicons/react/24/solid";

const PG_Card = ({ productInfo }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    setIsInWishlist(
      DoesWishlistContain(productInfo.productID, productInfo.companyID)
    );
  }, []);

  return (
    <Link
      className="relative flex flex-col bg-white rounded-xl shadow-[0_0px_15px_3px_rgba(0,0,0,0.10)]"
      href={"/view/" + productInfo.productID}
    >
      {isInWishlist && (
        <div className="absolute top-2 right-2 text-red-500">
          <HeartIcon className="w-5 h-5" />
        </div>
      )}

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
