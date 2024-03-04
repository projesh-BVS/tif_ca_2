"use client";
import axios from "axios";
import LoadingIndicator from "@/components/Common/LoadingIndicator";
import ProductViewInfoCard from "@/components/Product View/ProductViewInfoCard/ProductViewInfoCard";
import ProductViewModelCard from "@/components/Product View/ProductViewModelCard/ProductViewModelCard";
import ProductViewNavBar from "@/components/Product View/ProductViewNavBar/ProductViewNavBar";
import useProduct from "@/hooks/useProduct";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

var pageStartTime;
var viewDuration360;

const ProductView = ({ params }) => {
  const { product, isProductLoading, isProductError } = useProduct(
    params.productID
  );

  const router = useRouter();

  /*useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      console.log(
        `App is changing to ${url} ${
          shallow ? "with" : "without"
        } shallow routing`
      );
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);*/

  /*const [analyticsViewsFields, setAnalyticsViewsFields] = useState({
    productID: 5,
    ARloadtime: 100,
    ARviews: 0,
    clicksToAddToCart: 2,
    clicksToWishlist: 0,
    clickToColorChange: 0,
    clickToTextureChange: 0,
    duration360: 6,
    durationAR: 7,
    Loadtime360: 0,
    productSKU: 0,
    screenshotsInAR: 8,
    videosInAR: 9,
    views360: 1,
  });*/

  /*
    productID: Real
    productSKU: Real
    clicksToWishlist: Real    
    views360: Real
    ARviews: Real
    clickToColorChange: Real
    clickToTextureChange: Real

    duration360: 6,
    ARloadtime: 100,
    durationAR: 7,

    clicksToAddToCart: -NO CART AVAILABLE-
    screenshotsInAR: -MAYBE NOT AVAILABLE-
    videosInAR: -MAYBE NOT AVAILABLE-
    
*/
  //const [pageStartTime, setPageStartTime] = useState(0);
  const [analyticsViewsFields, setAnalyticsViewsFields] = useState(null);
  const [loadTime360, setLoadTime360] = useState(0);
  //const [duration360, setDuration360] = useState(0);

  console.log("Product Data Fetched: ");
  console.log(product);

  useEffect(() => {
    if (product) {
      SetAnalyticsData(product);
      pageStartTime = new Date().getTime();
      //setPageStartTime(new Date().getTime());
      console.log(
        "Started Loading Page at " +
          pageStartTime +
          "ms at " +
          new Date().getTime()
      );
    }
  }, [product]);

  useEffect(() => {
    console.log(
      "Use Effect -> Analytics Views Fields -> " +
        JSON.stringify(analyticsViewsFields) +
        " | CALLED AT - " +
        new Date().getTime()
    );
  }, [analyticsViewsFields]);

  function SetAnalyticsData(productData) {
    console.log(
      "INITIAL ANALYTICS DATA SET CALLED AT - " + new Date().getTime()
    );
    console.log("Trying to set analytics- " + JSON.stringify(productData));
    var initial_anl_data = {
      productName: productData.data.productName,
      productID: productData.data.productID,
      ARloadtime: 100,
      ARviews: 0,
      clicksToAddToCart: 0,
      clicksToWishlist: 0,
      clickToColorChange: 0,
      clickToTextureChange: 0,
      duration360: 0,
      durationAR: 7,
      Loadtime360: 0,
      productSKU: productData.data.productID,
      screenshotsInAR: 8,
      videosInAR: 9,
      views360: 1,
    };

    setAnalyticsViewsFields(initial_anl_data);
    console.log("Analytics data set: " + JSON.stringify(initial_anl_data));
  }

  function UpdateAnalyticsData_WishlistClicked() {
    var anl_data = analyticsViewsFields;
    anl_data.clicksToWishlist += 1;

    console.log(
      "ANL UPDATE | Wishlist Clicks Changed | To: " + anl_data.clicksToWishlist
    );

    setAnalyticsViewsFields(anl_data);
    console.log("Updated data set: " + JSON.stringify(analyticsViewsFields));
  }

  function UpdateAnalyticsData_VariantChanged() {
    var anl_data = analyticsViewsFields;
    anl_data.clickToColorChange += 1;
    anl_data.clickToTextureChange += 1;

    console.log(
      "ANL UPDATE | Variant Changed | To: " + anl_data.clickToColorChange
    );

    setAnalyticsViewsFields(anl_data);
    console.log("Updated data set: " + JSON.stringify(analyticsViewsFields));
  }

  function UpdateAnalyticsData_ARViewActivated() {
    var anl_data = analyticsViewsFields;
    anl_data.ARviews += 1;

    console.log("ANL UPDATE | AR Views | To: " + anl_data.ARviews);

    setAnalyticsViewsFields(anl_data);
    console.log("Updated data set: " + JSON.stringify(analyticsViewsFields));
  }

  function UpdateAnalyticsData_LoadTime360() {
    // console.log("LoadTime360 UPDATE CALLED AT - " + new Date().getTime());
    // let loadTime = (new Date().getTime() - pageStartTime) / 1000;
    // var anl_data = analyticsViewsFields;
    // console.log("ANALYTICS VIEWS FIELDS -> " + analyticsViewsFields);
    // console.log("Copying analyticsViewFields: " + anl_data);

    // if (!anl_data) {
    //   return;
    // } else {
    //   anl_data.Loadtime360 = loadTime;

    //   console.log(
    //     "ANL UPDATE | 360 Load Time | To: " + anl_data.Loadtime360 + "s"
    //   );
    //   console.log(
    //     "Current Analytics Data -> " + JSON.stringify(analyticsViewsFields)
    //   );

    //   setAnalyticsViewsFields(anl_data);
    //   console.log("Updated data set: " + JSON.stringify(analyticsViewsFields));
    // }

    let loadTime = (new Date().getTime() - pageStartTime) / 1000;
    setLoadTime360(loadTime);
    console.log("pageStartTime " + pageStartTime);
    console.log(
      "Load Time -> In Const: " + loadTime360 + " | In Calc: " + loadTime
    );
  }

  const uploadAnalytics = async () => {
    var anl_data = analyticsViewsFields;
    anl_data.Loadtime360 = loadTime360;
    anl_data.duration360 = viewDuration360;
    setAnalyticsViewsFields(anl_data);

    console.log(
      "Uploading analytics - " + JSON.stringify(analyticsViewsFields)
    );
    try {
      const response = await axios.patch(
        "https://0zwhtezm4f.execute-api.ap-south-1.amazonaws.com/TryItFirst/analytics/views",
        analyticsViewsFields
      );

      if (response.status === 200) {
        console.log("Analytics data upload successful");
      } else {
        console.log("Analytics upload error 1");
      }
    } catch (err) {
      console.log("Analytics upload error 2");
    }
  };

  function Callback_OnBackButtonClicked() {
    console.log(
      "CALCULATING DURATION -> Curr Time: " +
        new Date().getTime() +
        " | Start Time: " +
        pageStartTime
    );
    let duration = (new Date().getTime() - pageStartTime) / 1000;
    //setDuration360(duration);
    viewDuration360 = duration;
    console.log(
      "Duration 360 -> In Const: " + viewDuration360 + " | In Calc: " + duration
    );

    uploadAnalytics();
    router.back();
  }

  return (
    <main className="flex md:flex-row flex-col items-center justify-center w-screen h-[100svh] bg-white">
      <ProductViewNavBar
        Callback_OnBackButtonClicked={Callback_OnBackButtonClicked}
      />
      {isProductLoading && (
        <section className="flex flex-col p-4 gap-2 items-center justify-between w-full text-gray-500">
          <LoadingIndicator />
          <span className="font-semibold lg:text-xl">Loading Product</span>
          <span className="font-light text-xs lg:text-sm">Please wait</span>
        </section>
      )}

      {product && product.data == null && !isProductLoading && (
        <section className="flex flex-col p-4 gap-2 items-center justify-between w-full text-red-500">
          <span className="font-semibold lg:text-xl">
            Sorry, there was an error while loading data
          </span>
          <span className="font-light text-xs lg:text-sm">
            Please refresh the page if you still see an error after 30 secs
          </span>
        </section>
      )}

      {isProductError && (
        <section className="flex flex-col p-4 gap-2 items-center justify-between w-full text-red-500">
          <span className="font-semibold lg:text-xl">
            Sorry, there was an error while loading data
          </span>
          <span className="font-light text-xs lg:text-sm">
            Please refresh the page if you still see an error after 30 secs
          </span>
        </section>
      )}

      {product && product.data != null && !isProductError && (
        <section className="flex md:flex-row flex-col md:items-center md:justify-center md:gap-6 md:p-6 w-full h-full">
          <section className="w-full md:h-2/3 h-1/3 bg-white">
            <ProductViewModelCard
              productInfo={product}
              analyticsOnVariantChanged={UpdateAnalyticsData_VariantChanged}
              analyticsOnARView={UpdateAnalyticsData_ARViewActivated}
              analyticsOnLoad360={UpdateAnalyticsData_LoadTime360}
            />
          </section>
          <section className="z-10 w-full h-2/3 bg-gray-100 md:rounded-3xl rounded-t-3xl shadow-[0_10px_25px_5px_rgba(0,0,0,0.25)] border-gray-300 border-t-2">
            <ProductViewInfoCard
              productInfo={product}
              analyticsOnWishlistClick={UpdateAnalyticsData_WishlistClicked}
            />
          </section>
        </section>
      )}
    </main>
  );
};

export default ProductView;

/*
    productID: Real
    productSKU: Real
    clicksToWishlist: Real
    Loadtime360: Real
    views360: Real
    ARviews: Real
    clickToColorChange: Real
    clickToTextureChange: Real
    duration360: Real
    
    ARloadtime: 100,
    durationAR: 7,

    clicksToAddToCart: -NO CART AVAILABLE-
    screenshotsInAR: -MAYBE NOT AVAILABLE-
    videosInAR: -MAYBE NOT AVAILABLE-
    
*/
