import { CubeTransparentIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

const ProductViewModelCard = ({ productInfo }) => {
  const [showVariantSelector, setShowVariantSelector] = useState(false);

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

  useEffect(() => {
    //console.log("PRODUCT DATA UPDATED");
    modelViewerVariants = document.querySelector("#CurrProductViewer");
    //console.log("Model Viewer Element - " + modelViewerVariants);

    if (modelViewerVariants != null) {
      modelViewerVariants.addEventListener("load", () => {
        modelVariantNames = modelViewerVariants.availableVariants;

        //console.log("Variant Names - " + modelVariantNames);

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

      select.addEventListener("input", (event) => {
        modelViewerVariants.variantName =
          event.target.value === "default" ? null : event.target.value;
      });
    }
  }, [showVariantSelector]);

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
        ar-scale="fixed"
      >
        <div
          slot="ar-button"
          id="ar-button"
          className="absolute right-0 flex items-center justify-end px-2 py-4 w-fit h-auto"
        >
          <button className="flex items-center justify-center px-4 py-2 gap-2 bg-tif-blue text-white rounded-full shadow-xl">
            <CubeTransparentIcon className="w-5 h-5" />
            <h1 className="text-xs">View in AR</h1>
          </button>
        </div>

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
