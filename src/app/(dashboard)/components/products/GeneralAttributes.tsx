import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Attribute from "./Attribute";
import { findCategoryAttributesAndValues } from "@/app/actions/attributes";
import { RootState } from "@/app/store/store";
import { nextStep, updateAttributes } from "@/app/store/slices/productSlice";
import { prevStep } from "@/app/store/slices/productSlice";

type AttributeType = {
  groupName: string;
  attributes: {
    attrName: string;
    attrValue: string[];
  }[];
};

type DetailsProps = {
  handleSubmit: () => void; // Function to handle submission
};

const Details: React.FC<DetailsProps> = ({ handleSubmit }) => {
  const dispatch = useDispatch();
  const { categoryId } = useSelector((state: RootState) => state.product);
  const [attributes, setAttributes] = useState<AttributeType[]>([]);

  useEffect(() => {
    const fetchAttributes = async () => {
      if (categoryId !== "") {
        const response = await findCategoryAttributesAndValues(categoryId);
        console.log(response);
        if (response?.length > 0) {
          const formattedAttributes = response[0].groupedAttributes
            ?.filter((group: any) => group.groupName === "General")
            ?.map((group: any) => ({
              groupName: group.groupName
                ? group.groupName.toLowerCase()
                : "additional details",
              attributes: group.attributes?.map((attr: any) => ({
                attrName: attr.attributeName,
                attrValue: attr.attributeValues?.map((val: any) => val.value),
              })),
            }));
          setAttributes(formattedAttributes);
        }
      }
    };

    fetchAttributes();
  }, [categoryId]);

  const handleAttributeChange = (
    groupName: string,
    attrName: string,
    selectedValues: string[]
  ) => {
    dispatch(updateAttributes({ groupName, attrName, selectedValues }));
  };

  const handleBack = () => {
    dispatch(prevStep()); // Navigate back to the previous step
  };

  const handleNext = () => {
    dispatch(nextStep());
  };

  return (
    <div>
      {attributes.length > 0 && (
        <>
          <Attribute
            attributes={attributes}
            handleAttributeChange={handleAttributeChange}
          />
          <div className="flex justify-between items-center space-x-4 mt-6">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className=" bg-gray-500 text-white py-2 px-4 rounded"
            >
              Back
            </button>

            {/* Submit Button */}
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Details;
