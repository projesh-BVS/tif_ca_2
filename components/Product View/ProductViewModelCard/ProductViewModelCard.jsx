import {
  CubeTransparentIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

const ProductViewModelCard = ({
  productInfo,
  analyticsOnVariantChanged,
  analyticsOnARView,
  analyticsOnLoad360,
}) => {
  const [showDimensions, setShowDimensions] = useState(true);
  const [showDepth, setShowDepth] = useState(false);
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [showARButton, setShowARButton] = useState(false);
  const [hasARFailed, setHasARFailed] = useState(false);
  const [modelViewerMode, setModelViewerMode] = useState(
    "webxr scene-viewer quick-look"
  );
  const [isARInPresentMode, setIsARInPresentMode] = useState(false);

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

    if (event.detail.status == "session-started") {
      setIsARInPresentMode(true);
    } else if (event.detail.status == "not-presenting") {
      setIsARInPresentMode(false);
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

      VariantDropdown.addEventListener("input", (event) => {
        if (analyticsOnVariantChanged) analyticsOnVariantChanged();
        modelViewerVariants.variantName =
          event.target.value === "default" ? null : event.target.value;
      });
    }
  }, [showVariantSelector]);

  useEffect(() => {
    console.log(
      "State Changed | Dimensions: " + showDimensions + " | Depth: " + showDepth
    );
    if (showDepth) setModelViewerMode("scene-viewer quick-look");
    else setModelViewerMode("webxr scene-viewer quick-look");
  }, [showDepth, showDimensions]);

  function HandleClick_ARbutton() {
    console.log("AR button clicked");
    if (analyticsOnARView) analyticsOnARView();
  }

  /* Depth */
  function HandleDepthToggle() {
    if (!showDepth) {
      setShowDimensions(false);
      setDimensionVisibility(false);
    }
    setShowDepth((prev) => !prev);
  }
  /* End Depth */

  /* Dimensions */
  const dimElements = currViewer
    ? [
        ...currViewer.querySelectorAll("#dimID"),
        currViewer.querySelector("#dimLines"),
      ]
    : null;

  function HandleDimesionToggle() {
    if (!showDimensions) setShowDepth(false);
    setDimensionVisibility(!showDimensions);
    setShowDimensions((prev) => !prev);
  }

  function setDimensionVisibility(visible) {
    console.log("Setting Dim Visibility - " + visible);
    dimElements.forEach((element) => {
      if (visible) {
        element.classList.remove("hide");
      } else {
        element.classList.add("hide");
      }
    });
  }

  function drawLine(svgLine, dotHotspot1, dotHotspot2, dimensionHotspot) {
    if (dotHotspot1 && dotHotspot2) {
      svgLine.setAttribute("x1", dotHotspot1.canvasPosition.x);
      svgLine.setAttribute("y1", dotHotspot1.canvasPosition.y);
      svgLine.setAttribute("x2", dotHotspot2.canvasPosition.x);
      svgLine.setAttribute("y2", dotHotspot2.canvasPosition.y);

      if (dimensionHotspot && !dimensionHotspot.facingCamera) {
        svgLine.classList.add("hide");
      } else {
        svgLine.classList.remove("hide");
      }
    }
  }

  const dimLines = currViewer?.querySelectorAll("line");

  const renderSVG = () => {
    drawLine(
      dimLines[0],
      currViewer.queryHotspot("hotspot-dot+X-Y+Z"),
      currViewer.queryHotspot("hotspot-dot+X-Y-Z"),
      currViewer.queryHotspot("hotspot-dim+X-Y")
    );
    drawLine(
      dimLines[1],
      currViewer.queryHotspot("hotspot-dot+X-Y-Z"),
      currViewer.queryHotspot("hotspot-dot+X+Y-Z"),
      currViewer.queryHotspot("hotspot-dim+X-Z")
    );
    drawLine(
      dimLines[2],
      currViewer.queryHotspot("hotspot-dot+X+Y-Z"),
      currViewer.queryHotspot("hotspot-dot-X+Y-Z")
    ); // always visible
    drawLine(
      dimLines[3],
      currViewer.queryHotspot("hotspot-dot-X+Y-Z"),
      currViewer.queryHotspot("hotspot-dot-X-Y-Z"),
      currViewer.queryHotspot("hotspot-dim-X-Z")
    );
    drawLine(
      dimLines[4],
      currViewer.queryHotspot("hotspot-dot-X-Y-Z"),
      currViewer.queryHotspot("hotspot-dot-X-Y+Z"),
      currViewer.queryHotspot("hotspot-dim-X-Y")
    );
  };

  currViewer?.addEventListener("load", () => {
    const center = currViewer.getBoundingBoxCenter();
    const size = currViewer.getDimensions();
    const x2 = size.x / 2;
    const y2 = size.y / 2;
    const z2 = size.z / 2;

    currViewer.updateHotspot({
      name: "hotspot-dot+X-Y+Z",
      position: `${center.x + x2} ${center.y - y2} ${center.z + z2}`,
    });

    currViewer.updateHotspot({
      name: "hotspot-dim+X-Y",
      position: `${center.x + x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`,
    });
    currViewer.querySelector(
      'button[slot="hotspot-dim+X-Y"]'
    ).textContent = `${(size.z * 100).toFixed(0)} cm`;

    currViewer.updateHotspot({
      name: "hotspot-dot+X-Y-Z",
      position: `${center.x + x2} ${center.y - y2} ${center.z - z2}`,
    });

    currViewer.updateHotspot({
      name: "hotspot-dim+X-Z",
      position: `${center.x + x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`,
    });
    currViewer.querySelector(
      'button[slot="hotspot-dim+X-Z"]'
    ).textContent = `${(size.y * 100).toFixed(0)} cm`;

    currViewer.updateHotspot({
      name: "hotspot-dot+X+Y-Z",
      position: `${center.x + x2} ${center.y + y2} ${center.z - z2}`,
    });

    currViewer.updateHotspot({
      name: "hotspot-dim+Y-Z",
      position: `${center.x} ${center.y + y2 * 1.1} ${center.z - z2 * 1.1}`,
    });
    currViewer.querySelector(
      'button[slot="hotspot-dim+Y-Z"]'
    ).textContent = `${(size.x * 100).toFixed(0)} cm`;

    currViewer.updateHotspot({
      name: "hotspot-dot-X+Y-Z",
      position: `${center.x - x2} ${center.y + y2} ${center.z - z2}`,
    });

    currViewer.updateHotspot({
      name: "hotspot-dim-X-Z",
      position: `${center.x - x2 * 1.2} ${center.y} ${center.z - z2 * 1.2}`,
    });
    currViewer.querySelector(
      'button[slot="hotspot-dim-X-Z"]'
    ).textContent = `${(size.y * 100).toFixed(0)} cm`;

    currViewer.updateHotspot({
      name: "hotspot-dot-X-Y-Z",
      position: `${center.x - x2} ${center.y - y2} ${center.z - z2}`,
    });

    currViewer.updateHotspot({
      name: "hotspot-dim-X-Y",
      position: `${center.x - x2 * 1.2} ${center.y - y2 * 1.1} ${center.z}`,
    });
    currViewer.querySelector(
      'button[slot="hotspot-dim-X-Y"]'
    ).textContent = `${(size.z * 100).toFixed(0)} cm`;

    currViewer.updateHotspot({
      name: "hotspot-dot-X-Y+Z",
      position: `${center.x - x2} ${center.y - y2} ${center.z + z2}`,
    });

    renderSVG();

    currViewer.addEventListener("camera-change", renderSVG);
  });
  /* End Dimensions */

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
        camera-orbit="-30deg auto auto"
        max-camera-orbit="auto 100deg auto"
        camera-controls
        touch-action="pan-y"
        //auto-rotate
        autoplay
        ar
        //ar-modes="webxr scene-viewer quick-look"
        ar-modes={modelViewerMode}
        ar-scale="fixed"
      >
        <button
          slot="hotspot-dot+X-Y+Z"
          id="dimID"
          class="dot"
          data-position="1 -1 1"
          data-normal="1 0 0"
        ></button>
        <button
          slot="hotspot-dim+X-Y"
          id="dimID"
          class="dim"
          data-position="1 -1 0"
          data-normal="1 0 0"
        ></button>
        <button
          slot="hotspot-dot+X-Y-Z"
          id="dimID"
          class="dot"
          data-position="1 -1 -1"
          data-normal="1 0 0"
        ></button>
        <button
          slot="hotspot-dim+X-Z"
          id="dimID"
          class="dim"
          data-position="1 0 -1"
          data-normal="1 0 0"
        ></button>
        <button
          slot="hotspot-dot+X+Y-Z"
          id="dimID"
          class="dot"
          data-position="1 1 -1"
          data-normal="0 1 0"
        ></button>
        <button
          slot="hotspot-dim+Y-Z"
          id="dimID"
          class="dim"
          data-position="0 -1 -1"
          data-normal="0 1 0"
        ></button>
        <button
          slot="hotspot-dot-X+Y-Z"
          id="dimID"
          class="dot"
          data-position="-1 1 -1"
          data-normal="0 1 0"
        ></button>
        <button
          slot="hotspot-dim-X-Z"
          id="dimID"
          class="dim"
          data-position="-1 0 -1"
          data-normal="-1 0 0"
        ></button>
        <button
          slot="hotspot-dot-X-Y-Z"
          id="dimID"
          class="dot"
          data-position="-1 -1 -1"
          data-normal="-1 0 0"
        ></button>
        <button
          slot="hotspot-dim-X-Y"
          id="dimID"
          class="dim"
          data-position="-1 -1 0"
          data-normal="-1 0 0"
        ></button>
        <button
          slot="hotspot-dot-X-Y+Z"
          id="dimID"
          class="dot"
          data-position="-1 -1 1"
          data-normal="-1 0 0"
        ></button>
        <svg
          id="dimLines"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          class="dimensionLineContainer"
        >
          <line class="dimensionLine"></line>
          <line class="dimensionLine"></line>
          <line class="dimensionLine"></line>
          <line class="dimensionLine"></line>
          <line class="dimensionLine"></line>
        </svg>

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

        <div className="absolute bottom-0 flex flex-col items-center justify-center gap-2 w-full p-2 z-50">
          <div className="flex items-center justify-center w-fit gap-2">
            <button
              class="nonDim"
              className={`flex items-center justify-center py-2 px-4 gap-2 w-full text-white rounded-full shadow-md ${
                showDimensions ? "bg-green-500 " : "bg-red-500 "
              }`}
              onClick={() => HandleDimesionToggle()}
            >
              <h1>Dimensions</h1>
              {showDimensions && <EyeIcon className="w-5 h-5" />}
              {!showDimensions && <EyeSlashIcon className="w-5 h-5" />}
            </button>

            {!isARInPresentMode && (
              <button
                class="nonDim"
                className={`flex items-center justify-center py-2 px-4 gap-2 w-full text-white rounded-full shadow-md ${
                  showDepth ? "bg-green-500 " : "bg-red-500 "
                }`}
                onClick={() => HandleDepthToggle()}
              >
                <h1>Depth</h1>
                {showDepth && <EyeIcon className="w-5 h-5" />}
                {!showDepth && <EyeSlashIcon className="w-5 h-5" />}
              </button>
            )}
          </div>

          {showVariantSelector && (
            <select
              id="VariantDropdown"
              className="w-full p-2.5 bg-tif-blue text-white rounded-full shadow-md"
            ></select>
          )}
        </div>
      </model-viewer>
    </section>
  );
};

export default ProductViewModelCard;
