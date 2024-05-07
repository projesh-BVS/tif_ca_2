export function DoesWishlistContain(productID, companyID) {
  var customerWishlist = null;

  customerWishlist = LoadWishlist(companyID);

  if (customerWishlist == null) return false;
  else {
    if (customerWishlist.includes(productID)) return true;
    else return false;
  }
}

export function AddToWishlist(productID, companyID, onAddCallback) {
  var customerWishlist = LoadWishlist(companyID);
  if (customerWishlist == null) customerWishlist = [];

  customerWishlist.push(productID);
  SaveWishlist(customerWishlist, companyID, onAddCallback);
}

export function RemoveFromWishlist(productID, companyID, onRemoveCallback) {
  var customerWishlist = LoadWishlist(companyID);

  customerWishlist.splice(customerWishlist.indexOf(productID), 1);

  SaveWishlist(customerWishlist, companyID, onRemoveCallback);
}

export function LoadWishlist(companyID) {
  var wishlist = null;

  if (typeof window !== "undefined") {
    wishlist = JSON.parse(
      window.localStorage.getItem("tif-wishlist-" + companyID)
    );
    return wishlist;
  } else {
    return wishlist;
  }
}

function SaveWishlist(updatedWishlist, companyID, onSaveCallback) {
  localStorage.setItem(
    "tif-wishlist-" + companyID,
    JSON.stringify(updatedWishlist)
  );
  onSaveCallback();
}
