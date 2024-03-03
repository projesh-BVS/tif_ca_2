import { getFormattedPrice } from "@/utils/productInfoUtils";
import {
  AddToWishlist,
  DoesWishlistContain,
  RemoveFromWishlist,
} from "@/utils/wishlistUtils";
import { HeartIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

const ProductViewInfoCard = ({ productInfo, analyticsOnWishlistClick }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    setIsInWishlist(
      DoesWishlistContain(
        productInfo.data.productID,
        productInfo.data.companyID
      )
    );
    console.log("Is in wishlist - " + isInWishlist);
  }, []);

  function Callback_OnAddToWishlist() {
    setIsInWishlist(true);
    analyticsOnWishlistClick();
  }

  function Callback_OnRemoveFromWishlist() {
    setIsInWishlist(false);
  }

  function wishListAction() {
    if (isInWishlist) {
      console.log("Trying to remove from wishlist");
      RemoveFromWishlist(
        productInfo.data.productID,
        productInfo.data.companyID,
        Callback_OnRemoveFromWishlist
      );
    } else {
      console.log("Trying to add to wishlist");
      AddToWishlist(
        productInfo.data.productID,
        productInfo.data.companyID,
        Callback_OnAddToWishlist
      );
    }
  }

  return (
    <section className="flex flex-col items-center justify-between w-full h-full">
      <div className="flex flex-col p-4 gap-4 w-full overflow-y-auto">
        <h1 className="text-xl font-semibold">
          {productInfo.data.productName}
        </h1>
        <p className="text-sm font-light italic text-gray-600">
          {productInfo.data.description}
        </p>

        <hr />

        <div className="flex flex-col gap-2">
          <h1 className="text-base font-medium">
            Dimensions{" "}
            <span className="text-sm font-normal italic text-gray-600">
              {"( "}L x W x H{" )"}
            </span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-lg bg-gray-600 text-white">
              {productInfo.data.productLength +
                " " +
                productInfo.data.dimensionUnit}
            </div>
            <h1 className="font-semibold text-gray-400">x</h1>
            <div className="px-2 py-1 rounded-lg bg-gray-600 text-white">
              {productInfo.data.width + " " + productInfo.data.dimensionUnit}
            </div>
            <h1 className="font-semibold text-gray-400">x</h1>
            <div className="px-2 py-1 rounded-lg bg-gray-600 text-white">
              {productInfo.data.height + " " + productInfo.data.dimensionUnit}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-medium">Weight</h1>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-lg bg-gray-600 text-white">
              {productInfo.data.weight + " " + productInfo.data.weightUnit}
            </div>
          </div>
        </div>
        <hr />
      </div>

      <div className="flex flex-col p-4 w-full py-4 gap-2">
        <div className="flex flex-col gap-2 p-4 border-tif-blue border-2 rounded-2xl">
          <h2 className="text-lg font-medium">Price</h2>
          <div className="flex items-center gap-4">
            {productInfo.data.discountPercent > 0 && (
              <div className="flex items-center justify-center gap-2 p-4 text-2xl font-bold text-white bg-gradient-to-br from-tif-blue to-tif-pink rounded-xl">
                {productInfo.data.discountPercent + "%"}
                <h1>Off</h1>
              </div>
            )}

            <div className="flex flex-col">
              {productInfo.data.discountPercent > 0 && (
                <h2 className="line-through text-red-500/50">
                  {getFormattedPrice(
                    productInfo.data.currency,
                    productInfo.data.price
                  )}
                </h2>
              )}
              <h1 className="text-2xl font-bold">
                {getFormattedPrice(
                  productInfo.data.currency,
                  productInfo.data.discountPercent > 0
                    ? productInfo.data.discountedPrice
                    : productInfo.data.price
                )}
              </h1>
            </div>
          </div>
        </div>
        <button
          className={`flex gap-2 p-4 items-center justify-center text-white text-md rounded-2xl shadow-md hover:shadow-lg transition-all ${
            isInWishlist
              ? "bg-red-500 hover:bg-red-600"
              : "bg-tif-blue hover:bg-tif-lavender"
          }`}
          onClick={() => wishListAction()}
        >
          {!isInWishlist && <HeartIcon className="h-5 w-5" />}
          {isInWishlist && <TrashIcon className="h-5 w-5" />}
          <h1>{isInWishlist ? "Remove from wishlist" : "Add to wishlist"}</h1>
        </button>
      </div>
    </section>
  );
};

export default ProductViewInfoCard;
