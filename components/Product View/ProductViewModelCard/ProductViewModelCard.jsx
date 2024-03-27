import {
  CubeTransparentIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

const ProductViewModelCard = ({
  productInfo,
  analyticsOnVariantChanged,
  analyticsOnARView,
  analyticsOnLoad360,
}) => {
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [showARButton, setShowARButton] = useState(false);
  const [hasARFailed, setHasARFailed] = useState(false);

  let modelViewerVariants = null;
  let modelVariantNames = null;
  let select = null;

  useEffect(() => {
    // This is where we will initialize Model Viewer.
    // We'll do this asynchronously because it's a heavy operation.
    import("@google/model-viewer")
      .then(({ ModelViewerElement }) => {
        // Here, ModelViewerElement is now available and can be used.
        customElements.get("model-viewer") ||
          customElements.define("model-viewer", ModelViewerElement);
      })
      .catch((error) => {
        console.error("Error loading Model Viewer", error);
      });
  }, []); // We pass an empty dependency array so this runs once on mount.

  var currViewer = document.querySelector("#CurrProductViewer");
  currViewer?.addEventListener("ar-status", (event) => {
    console.log("AR Button Clicked");
    console.log(event);

    if (event.detail.status === "failed" && hasARFailed == false) {
      setHasARFailed(true);
      console.log("Failed to view AR");
    }
  });

  currViewer?.addEventListener("load", () => {
    console.log("Can activate AR: " + currViewer.canActivateAR);
    setShowARButton(currViewer.canActivateAR);
  });

  useEffect(() => {
    //console.log("PRODUCT DATA UPDATED");
    modelViewerVariants = document.querySelector("#CurrProductViewer");
    //console.log("Model Viewer Element - " + modelViewerVariants);

    if (modelViewerVariants != null) {
      modelViewerVariants.addEventListener("load", () => {
        modelVariantNames = modelViewerVariants.availableVariants;

        if (analyticsOnLoad360) {
          analyticsOnLoad360();
          console.log("Loaded 360");
        }

        if (modelVariantNames.length > 0) {
          setShowVariantSelector(true);
        } else setShowVariantSelector(false);
      });
    }
  }, [productInfo]);

  useEffect(() => {
    if (showVariantSelector) {
      modelViewerVariants = document.querySelector("#CurrProductViewer");
      modelVariantNames = modelViewerVariants.availableVariants;
      select = document.querySelector("#VariantDropdown");
      select.length = 0;

      for (const name of modelVariantNames) {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = "Style - " + name;
        select.appendChild(option);
      }

      /*const option = document.createElement("option");
      option.value = "default";
      option.textContent = "default";
      select.appendChild(option);*/

      VariantDropdown.addEventListener("input", (event) => {
        if (analyticsOnVariantChanged) analyticsOnVariantChanged();
        modelViewerVariants.variantName =
          event.target.value === "default" ? null : event.target.value;
      });
    }
  }, [showVariantSelector]);

  function HandleClick_ARbutton() {
    console.log("AR button clicked");
    if (analyticsOnARView) analyticsOnARView();
  }

  return (
    <section className="flex items-center justify-center w-full h-full">
      <model-viewer
        id="CurrProductViewer"
        src={productInfo.data.glb}
        //ios-src={productInfo.data.usdz}
        poster={productInfo.data.poster}
        alt={"3D model of " + productInfo.data.productName}
        shadow-intensity="1"
        tone-mapping="commerce"
        camera-controls
        touch-action="pan-y"
        auto-rotate
        autoplay
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="fixed"
      >
        <div
          slot="ar-button"
          id="ARbutton"
          className={`${showARButton ? "" : "hidden"} ${
            hasARFailed ? "hidden" : ""
          } absolute right-0 flex items-center justify-end px-2 py-4 w-fit h-auto`}
          onClick={() => HandleClick_ARbutton()}
        >
          <button className="flex items-center justify-center px-4 py-2 gap-2 bg-tif-blue text-white rounded-full shadow-xl">
            <CubeTransparentIcon className="w-5 h-5" />
            <h1 className="text-xs">View in AR</h1>
          </button>
        </div>

        {hasARFailed && (
          <div className="absolute right-0 flex items-center justify-end px-2 py-4 w-fit h-auto">
            <div className="flex items-center justify-center px-4 py-2 gap-2 border-2 border-tif-blue text-tif-blue rounded-full">
              <ExclamationTriangleIcon className="w-5 h-5" />
              <h1 className="text-xs">Sorry, your device doesn't support AR</h1>
            </div>
          </div>
        )}

        {showVariantSelector && (
          <div className="absolute bottom-0 flex items-center justify-center gap-4 w-full p-2 font-medium">
            <select
              id="VariantDropdown"
              className="w-full p-2 bg-tif-blue text-white rounded-full shadow-md"
            ></select>
          </div>
        )}
      </model-viewer>
    </section>
  );
};

export default ProductViewModelCard;
