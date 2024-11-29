import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select"; // Import react-select

import { findCategoryAttributesAndValues } from "@/app/actions/attributes";
import { RootState } from "@/app/store/store";
import { updateAttributes, prevStep } from "@/app/store/slices/productSlice";

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
        if (response?.length > 0) {
          const formattedAttributes = response[0].groupedAttributes
            ?.filter((group: any) => group.groupName !== "General")
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
    selectedValues: string[] | null
  ) => {
    dispatch(
      updateAttributes({
        groupName,
        attrName,
        selectedValues: selectedValues || [],
      })
    );
  };

  const handleBack = () => {
    dispatch(prevStep()); // Navigate back to the previous step
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "transparent", // Change the input background
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#f0f9ff", // Change the dropdown menu background
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#e0f2fe" // Background when option is focused
        : "#f0f9ff", // Default background
    }),
  };

  return (
    <div className="p-6 rounded-lg shadow-md">
      {attributes.length > 0 && (
        <>
          {attributes.map((group) => (
            <div key={group.groupName} className="mb-6">
              <h3 className="text-lg font-semibold capitalize mb-4">
                {group.groupName}
              </h3>
              {group.attributes.map((attribute) => (
                <div key={attribute.attrName} className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    {attribute.attrName}
                  </label>
                  <Select
                    options={attribute.attrValue.map((value) => ({
                      label: value,
                      value,
                    }))}
                    isMulti
                    styles={customStyles}
                    className="basic-multi-select bg-none text-sec border-gray-100"
                    classNamePrefix="select"
                    onChange={(selected) =>
                      handleAttributeChange(
                        group.groupName,
                        attribute.attrName,
                        selected?.map((option) => option.value) || null
                      )
                    }
                    placeholder={`Select ${attribute.attrName}`}
                  />
                </div>
              ))}
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
              aria-label="Go back to the previous step"
            >
              Back
            </button>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
              aria-label="Submit the product"
            >
              Submit Product
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Details;
