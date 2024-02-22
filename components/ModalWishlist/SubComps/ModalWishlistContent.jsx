import { Dialog, Transition } from "@headlessui/react";
import { ExclamationCircleIcon, HeartIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";
import WishlistItemCard from "./WishlistItemCard";

const ModalWishlistContent = ({
  wishlistItems,
  onCloseCallback,
  onRemoveCallback,
}) => {
  console.log("Modal -> Wishlist Data recieved -> ");
  console.log(wishlistItems);

  return (
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className="flex flex-col w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-2xl transition-all">
            <div className="flex flex-col justify-between p-4 bg-gradient-to-br from-tif-blue to-tif-pink">
              <Dialog.Title
                as="div"
                className="flex items-center justify-start gap-4 text-lg font-medium text-white"
              >
                <HeartIcon className="h-8 w-8" />
                <h1>My Wishlist</h1>
              </Dialog.Title>
            </div>

            {/*<div
              className={`flex px-2 py-6 gap-4 items-center justify-center w-full bg-red-500`}
            >
              <div className="rounded-lg overflow-clip aspect-square w-[40%] relative shadow-inner">
                Image was here
              </div>
              <div className="flex flex-col w-full gap-2">
                <h1 className="font-bold text-xl text-tif-blue">companyName</h1>
                <h2 className="font-medium italic text-sm">companyAddress</h2>
              </div>
            </div>*/}

            <section className="flex flex-col mb-6 w-full max-h-[30rem] overflow-y-scroll">
              {wishlistItems &&
                wishlistItems.length > 0 &&
                wishlistItems.map((item, index) => (
                  <div key={item + "-" + index} className="w-full">
                    <WishlistItemCard
                      productInfo={item}
                      showSeperator={index != wishlistItems.length - 1}
                      OnRemoveCallback={onRemoveCallback}
                    />
                  </div>
                ))}

              {!wishlistItems && (
                <div className="flex px-2 py-6 gap-4 items-center justify-center w-full">
                  <ExclamationCircleIcon className="w-7 h-7 text-tif-pink" />
                  <h1 className="italic font-medium text-gray-500">
                    Your wishlist is empty
                  </h1>
                </div>
              )}

              {wishlistItems && wishlistItems.length == 0 && (
                <div className="flex px-2 py-6 gap-4 items-center justify-center w-full">
                  <ExclamationCircleIcon className="w-7 h-7 text-tif-pink" />
                  <h1 className="italic font-medium text-gray-500">
                    Your wishlist is empty
                  </h1>
                </div>
              )}
            </section>

            <div className="w-full p-2 pt-0">
              <button
                onClick={() => onCloseCallback()}
                className="flex p-2 items-center justify-center w-full font-semibold text-white bg-tif-blue hover:bg-tif-lavender hover:shadow-md rounded-lg transition-all"
              >
                <h1>Close</h1>
              </button>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </div>
  );
};

export default ModalWishlistContent;
