import { getFormattedPrice } from "@/utils/productInfoUtils";
import { RemoveFromWishlist } from "@/utils/wishlistUtils";
import { TrashIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

const WishlistItemCard = ({
  productInfo,
  showSeperator = false,
  OnRemoveCallback,
}) => {
  return (
    <div
      className={`flex px-2 py-2 gap-4 items-center justify-center w-full hover:bg-gray-100 ${
        showSeperator ? "border-b-[1px] border-gray-400" : ""
      }`}
    >
      <Link
        className="flex items-center justify-between gap-2 w-full"
        href={"/view/" + productInfo.productID}
      >
        <div className="rounded-lg overflow-clip aspect-square w-[25%] relative shadow-inner">
          <Image
            src={productInfo.poster}
            alt="Product Image"
            quality={100}
            fill
            style={{ objectFit: "cover" }}
            placeholder="blur"
            blurDataURL={productInfo.poster}
          />
        </div>
        <div className="flex flex-col items-start justify-between w-full gap-2">
          <h1 className="font-bold text-sm text-tif-blue text-ellipsis line-clamp-2">
            {productInfo.productName}
          </h1>
          <h2 className="text-xs font-normal text-red-500">
            {getFormattedPrice(productInfo.currency, productInfo.price)}
          </h2>
        </div>
      </Link>

      <button
        className="flex items-center justify-center p-4 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md"
        onClick={() =>
          RemoveFromWishlist(
            productInfo.productID,
            productInfo.companyID,
            OnRemoveCallback
          )
        }
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default WishlistItemCard;
