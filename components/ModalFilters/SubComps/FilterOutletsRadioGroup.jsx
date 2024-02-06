import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon, CheckIcon } from "@heroicons/react/24/solid";

const plans = [
  {
    name: "Startup",
    ram: "12GB",
    cpus: "6 CPUs",
    disk: "160 GB SSD disk",
  },
  {
    name: "Business",
    ram: "16GB",
    cpus: "8 CPUs",
    disk: "512 GB SSD disk",
  },
  {
    name: "Enterprise",
    ram: "32GB",
    cpus: "12 CPUs",
    disk: "1024 GB SSD disk",
  },
  {
    name: "Faltu 1",
    ram: "32GB",
    cpus: "12 CPUs",
    disk: "1024 GB SSD disk",
  },
  {
    name: "Faltu 2",
    ram: "32GB",
    cpus: "12 CPUs",
    disk: "1024 GB SSD disk",
  },
  {
    name: "Faltu 3",
    ram: "32GB",
    cpus: "12 CPUs",
    disk: "1024 GB SSD disk",
  },
];

const FilterOutletsRadioGroup = ({
  outletList,
  activeOutlet,
  callback_OutletChanged,
}) => {
  //const [selected, setSelected] = useState(plans[0]);
  const [selected, setSelected] = useState(activeOutlet);
  console.log("Outlet List Recieved -> " + JSON.stringify(outletList));
  console.log("Active Outlet Recieved -> " + JSON.stringify(activeOutlet));

  function OnOutletChange(newActiveOutlet) {
    setSelected(newActiveOutlet);
    callback_OutletChanged(newActiveOutlet);
  }

  return (
    <div className="w-full max-h-72 overflow-auto">
      <div className="mx-auto w-full">
        <RadioGroup value={selected} onChange={OnOutletChange}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-1">
            {outletList.map((outlet, index) => (
              <RadioGroup.Option
                key={outlet.id + outlet.name + index}
                value={outlet.id}
                className={({ active, checked }) =>
                  `${checked ? "bg-tif-blue text-white" : "bg-white"}
                    relative flex cursor-pointer px-5 py-2 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {outlet.name}
                          </RadioGroup.Label>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckCircleIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default FilterOutletsRadioGroup;
