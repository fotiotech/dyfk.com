"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { findCategoryAttributesAndValues } from "@/app/actions/attributes";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  removeVariant,
  syncVariantWithParent,
  addVariant,
  updateVariantField,
  updateVariantAttributes,
  VariantState,
} from "@/app/store/slices/productSlice";
import Link from "next/link";
import FilesUploader from "@/components/FilesUploader";
import { useFileUploader } from "@/hooks/useFileUploader ";

type AttributeType = {
  groupName: string;
  attributes: {
    attrName: string;
    attrValue: string[];
  }[];
};

const Variant = () => {
  const { files, loading, addFiles, removeFile } = useFileUploader();
  const dispatch = useAppDispatch();
  const {
    category_id,
    variantAttributes,
    variants,
    basePrice,
    taxRate,
    stockQuantity,
    discount,
    currency,
    sku,
    upc,
    ean,
    gtin,
    imageUrls,
  } = useAppSelector((state) => state.product);
  const [attributes, setAttributes] = useState<AttributeType[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  useEffect(() => {
    dispatch(addVariant({ imageUrls: files }));
  }, []);

  useEffect(() => {
    const fetchAttributes = async () => {
      if (category_id !== "") {
        const response = await findCategoryAttributesAndValues(category_id);
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
    try {
      fetchAttributes();
    } catch (error) {
      console.error(error);
    }
  }, [category_id]);

  const handleAttributeChange = (
    groupName: string,
    attrName: string,
    selectedValues: string[] | null
  ) => {
    dispatch(
      updateVariantAttributes({
        groupName,
        attrName,
        selectedValues: selectedValues || [],
      })
    );
    dispatch(syncVariantWithParent());
  };

  function generateVariations(variantAttributesData: {
    [groupName: string]: { [attrName: string]: string[] };
  }) {
    // Flatten the attributes from all groups
    if (variantAttributesData) {
      const flattenedAttributes: { [attrName: string]: string[] } =
        Object.entries(variantAttributesData).reduce(
          (acc, [groupName, attributes]) => {
            Object.entries(attributes).forEach(([attrName, attrValues]) => {
              acc[attrName] = attrValues;
            });
            return acc;
          },
          {} as { [attrName: string]: string[] }
        );

      const keys = Object.keys(flattenedAttributes); // Attribute keys, e.g., ['Model', 'Weight']
      const values = Object.values(flattenedAttributes); // Attribute values, e.g., [['Galaxie S22', 'Galaxie A14'], ['1.5 kg', '250 g']]

      // Helper function to compute the cartesian product
      const cartesian = (arr: string[][]): string[][] =>
        arr.reduce<string[][]>(
          (acc, curr) => acc.flatMap((d) => curr.map((e) => [...d, e])),
          [[]] // Initial value is an array of empty arrays
        );

      // Generate combinations
      const combinations = cartesian(values);

      // Convert combinations into objects
      return combinations.map((combination) =>
        combination.reduce((obj, value, index) => {
          obj[keys[index]] = value;
          return obj;
        }, {} as Record<string, string>)
      );
    }
  }

  const AttributesVariants = useMemo(() => {
    if (variantAttributes) {
      return generateVariations(variantAttributes);
    }
    return [];
  }, [variantAttributes]);

  const handleRemoveVariant = (index: number) => {
    dispatch(removeVariant(index));
  };

  const handleVariantChange =
    (index: number, field: keyof VariantState) =>
    (
      value: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      // Check if the value is a string (from react-select) or an event (from input)
      const finalValue =
        typeof value === "string"
          ? value
          : (value.target as HTMLInputElement).value;

      dispatch(updateVariantField({ index, field, value: finalValue }));
    };

  const handleAttributeSelect = (attrName: string) => {
    setSelectedAttributes((prevSelected) => {
      if (prevSelected.includes(attrName)) {
        return prevSelected.filter((name) => name !== attrName); // Deselect
      } else {
        return [...prevSelected, attrName]; // Select
      }
    });
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "transparent",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#f0f9ff",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#e0f2fe" : "#f0f9ff",
    }),
  };

  // Local component state for product code type and value

  console.log(
    "variantAttributes:",
    variantAttributes,
    "AttributesVariants:",
    AttributesVariants
  );

  const [codeType, setCodeType] = useState(sku);
  const [codeValue, setCodeValue] = useState<string>(sku || "");

  const handleCodeTypeChange = (selectedOption: any) => {
    const newCodeType = selectedOption.value;
    setCodeType(newCodeType);
    setCodeValue(""); // Reset code value when the code type changes
  };

  // Options for react-select
  const codeTypeOptions = [
    { value: sku, label: "SKU" },
    { value: upc, label: "UPC" },
    { value: ean, label: "EAN" },
    { value: gtin, label: "GTIN" },
  ];

  return (
    <div className="p-3 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-pri capitalize mb-4">
        Variant
      </h3>
      <div>
        {AttributesVariants?.length! > 0 ? (
          <div>
            {AttributesVariants?.map((variant: any, idx: number) => (
              <div key={`variant-${idx}`} className="flex gap-10 pb-2 text-sm">
                <div>
                  {Object.entries(variant).map(
                    ([key, value]: any, index: number) => (
                      <div key={`${key}-${index + 1}`} className="flex gap-2">
                        <strong>
                          {index + 1} {key}:
                        </strong>{" "}
                        <span>{value}</span>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => handleAttributeSelect(key)}
                            className="ml-2 text-red-500 border"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
      <div>
        {attributes.length > 0 && (
          <>
            {attributes.map((group) => (
              <div key={group.groupName} className="flex flex-wrap gap-3 mb-6">
                {group.attributes.map((attribute) => (
                  <div key={attribute.attrName} className="mb-4">
                    <button
                      type="button"
                      onClick={() => handleAttributeSelect(attribute.attrName)}
                      className="p-2 rounded-lg border"
                    >
                      {attribute.attrName}
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      <div>
        {attributes.length > 0 && (
          <>
            {attributes.map((group) => (
              <div key={group.groupName} className="mb-6">
                {group.attributes
                  .filter((attribute) =>
                    selectedAttributes.includes(attribute.attrName)
                  )
                  .map((attribute) => (
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
                        className="bg-none text-sec border-gray-100"
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
          </>
        )}
      </div>

      <div className="p-3 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-pri capitalize mb-4">
          Variant Management
        </h3>

        {AttributesVariants?.map((variant, index) => (
          <div key={index} className="p-3 border rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold">Variant {index + 1}</h4>
            </div>
            {Object.entries(variant).map(([key, value], index: number) => (
              <div key={`${key}-${index + 1}`} className="flex flex-col gap-3">
                <div className="flex justify-between w-full">
                  <strong>
                    {key}: {value}
                  </strong>{" "}
                  <button
                    onClick={() => handleRemoveVariant(index)}
                    className="bg-red-500 text-white py-1 px-3 rounded"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="space-y-6 mb-10">
                    <div>
                      {files.length > 0 && (
                        <div className="flex flex-wrap">
                          <h4>Uploaded Images</h4>
                          {files.map((file, index) => (
                            <div key={index}>
                              <img
                                src={file}
                                alt={`Uploaded file ${index + 1}`}
                                width={100}
                              />
                              <button onClick={() => removeFile(index)}>
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <FilesUploader />
                    </div>
                    <div className="space-y-6 mb-10">
                      {/* Pass handleFilesChange to update image URLs */}
                      <h2 className="text-2xl font-semibold">
                        Variant Information
                      </h2>
                      <div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium">
                            Select Product Code Type
                          </label>
                          <Select
                            options={codeTypeOptions}
                            styles={customStyles}
                            value={codeTypeOptions.find(
                              (option) => option.value === codeType
                            )}
                            onChange={(selectedOption) =>
                              handleCodeTypeChange(selectedOption)
                            }
                            className="mt-1 bg-none text-sec border-gray-100"
                            placeholder="Select code type"
                          />
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium">
                            Enter {codeType?.toUpperCase()} Code
                          </label>
                          <input
                            type="text"
                            value={codeValue}
                            onChange={(event) =>
                              handleVariantChange(
                                index,
                                "codeValue" as keyof VariantState
                              )(event.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 bg-transparent rounded-md shadow-sm"
                            placeholder={`Enter ${codeType?.toUpperCase()} code`}
                          />
                        </div>
                      </div>

                      <h2 className="text-lg font-semibold mb-4">
                        Add Prices, Quantities, and Discount
                      </h2>

                      {/* Base Price */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium">
                          Base Price
                        </label>
                        <input
                          type="number"
                          value={variants[basePrice ?? 0]?.basePrice ?? 0}
                          onChange={handleVariantChange(index, "basePrice")}
                          className="mt-1 block w-full border-gray-300 
          rounded-md shadow-sm focus:border-indigo-500
          bg-transparent focus:ring-indigo-500"
                          placeholder="Enter base price"
                        />
                      </div>

                      {/* Tax Rate */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium">
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          value={variants[taxRate ?? 0]?.taxRate ?? 0}
                          onChange={handleVariantChange(index, "taxRate")}
                          className="mt-1 block w-full border-gray-300 
          rounded-md shadow-sm focus:border-indigo-500
          bg-transparent focus:ring-indigo-500"
                          placeholder="Enter tax rate"
                        />
                      </div>

                      {/* Stock Quantity */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          value={
                            variants[stockQuantity ?? 0]?.stockQuantity ?? 0
                          }
                          onChange={handleVariantChange(index, "stockQuantity")}
                          className="mt-1 block w-full border-gray-300 
          rounded-md shadow-sm focus:border-indigo-500
          bg-transparent focus:ring-indigo-500"
                          placeholder="Enter stock quantity"
                        />
                      </div>

                      {/* Discount */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium">
                          Discount (%)
                        </label>
                        <input
                          type="number"
                          value={discount?.value ?? 0}
                          onChange={handleVariantChange(index, "discount")}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 bg-transparent focus:ring-indigo-500"
                          placeholder="Enter discount percentage (0-100)"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Enter a value between 0 and 100 for the discount
                          percentage.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        {/* Back Button */}
        <Link
          href={variants ? "/admin/products/add_product/details" : ""}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Back
        </Link>
        <Link
          href={variants ? "/admin/products/add_product/inventory" : ""}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default Variant;
