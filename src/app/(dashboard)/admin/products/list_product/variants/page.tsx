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
import Spinner from "@/components/Spinner";
// import { VariantState } from "../../../../../store/slices/productSlice";

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
    variants,
    basePrice,
    taxRate,
    stockQuantity,
    discount,
    currency,
    sku,
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
    variantIndex: number, // Add variantIndex as a parameter
    groupName: string,
    attrName: string,
    selectedValues: string[] | null
  ) => {
    dispatch(
      updateVariantAttributes({
        variantIndex, // Specify which variant to update
        groupName,
        attrName,
        selectedValues: selectedValues || [], // Default to an empty array if null
      })
    );

    // Optionally synchronize with parent
    dispatch(syncVariantWithParent());
  };

  function generateVariations(
    variantAttributesData: VariantState["variantAttributes"]
  ) {
    if (!variantAttributesData) return []; // Handle empty or undefined input gracefully

    // Flatten the attributes from all groups
    const flattenedAttributes: { [attrName: string]: string[] } =
      Object.entries(variantAttributesData).reduce((acc, [_, attributes]) => {
        Object.entries(attributes).forEach(([attrName, attrValues]) => {
          acc[attrName] = attrValues;
        });
        return acc;
      }, {} as { [attrName: string]: string[] });

    const keys = Object.keys(flattenedAttributes); // Attribute keys, e.g., ['Color', 'Size', 'Weight']
    const values = Object.values(flattenedAttributes); // Attribute values, e.g., [['Red', 'Blue'], ['M', 'L'], ['1kg', '2kg']]

    // Generate all combinations of attribute values
    const combine = (arr: string[][]) =>
      arr.reduce(
        (acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])),
        [[]] as string[][]
      );

    const combinations = combine(values);

    // Map each combination to an object with flattened attributes
    return combinations.map((combo) =>
      combo.reduce(
        (acc, val, idx) => ({
          ...acc,
          [keys[idx]]: val, // Map attribute keys to their respective values
          product_id: "", // Placeholder for product ID
          sku: "", // Placeholder for SKU
          basePrice: 0, // Default base price
          finalPrice: 0, // Default final price
          taxRate: 0, // Default tax rate
          discount: 0, // Default discount
          currency: "", // Default currency
          VProductCode: "", // Default UPC
          stockQuantity: 0, // Default stock quantity
          imageUrls: [], // Default image URLs
          offerId: "", // Placeholder for offer ID
          category_id: "", // Placeholder for category ID
          status: "active", // Default status
        }),
        {} as Omit<VariantState, "variantAttributes">
      )
    );
  }

  const AttributesVariants = useMemo(() => {
    if (variants.length > 0) {
      // Generate variations for each variant
      return variants.flatMap((variant) =>
        generateVariations(variant.variantAttributes || {})
      );
    }
    return [];
  }, [variants]);

  const handleRemoveVariant = (index: number) => {
    dispatch(removeVariant(index));
  };

  const handleVariantChange = (
    index: number,
    field: keyof VariantState,
    value: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Determine the final value
    const finalValue =
      typeof value === "string"
        ? value
        : (value.target as HTMLInputElement).value;

    // Dispatch the action with the appropriate payload
    dispatch(
      updateVariantField({
        index,
        field,
        value: finalValue,
      })
    );
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

  console.log(imageUrls, variants);

  const codeTypeOptions = [
    { value: "sku", label: "SKU" },
    { value: "upc", label: "UPC" },
    { value: "ean", label: "EAN" },
    { value: "gtin", label: "GTIN" },
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
                  .map((attribute, idx) => (
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
                            idx,
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

      <div className=" rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-pri capitalize mb-4">
          Variant Management
        </h3>

        {AttributesVariants.map((variation, index) => (
          <div key={index} className="variation-form">
            <h3>Variation {index + 1}</h3>
            {Object.entries(variation).map(([key, value]) => {
              // Skip the attributes that have default values (those are not for user input)
              if (
                [
                  "imageUrls",
                  "sku",
                  "basePrice",
                  "finalPrice",
                  "taxRate",
                  "discount",
                  "VProductCode",
                  "stockQuantity",
                  "status",
                ].includes(key)
              ) {
                if (key === "VProductCode") {
                  return (
                    <div key={key}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium">
                          Select Product Code Type
                        </label>
                        <Select
                          options={codeTypeOptions}
                          styles={customStyles}
                          name={key}
                          value={codeTypeOptions.find(
                            (option) => option.value === key
                          )}
                          onChange={(e) =>
                            handleVariantChange(index, key, e as any)
                          }
                          className="mt-1 bg-none text-sec border-gray-100"
                          placeholder="Select code type"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium">
                          Enter Product Code
                        </label>
                        <input
                          type="text"
                          name={key}
                          value={key}
                          onChange={(e) => handleVariantChange(index, key, e)}
                          className="mt-1 block w-full border-gray-300 
                          bg-transparent rounded-md shadow-sm"
                          placeholder={`Enter ${key.toUpperCase()} code`}
                        />
                      </div>
                    </div>
                  );
                }

                if (key === "imageUrls") {
                  return (
                    <div key={key}>
                      <FilesUploader files={files} addFiles={addFiles} />
                    </div>
                  );
                }
                return (
                  <div key={key}>
                    <label>{key}:</label>
                    <input
                      title={key}
                      type="text"
                      name={key}
                      value={variants[index]?.[key] || value}
                      onChange={(e) => handleVariantChange(index, key, e)}
                      className="bg-transparent "
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        {/* Back Button */}
        <Link
          href={variants ? "/admin/products/list_product/details" : ""}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Back
        </Link>
        <Link
          href={variants ? "/admin/products/list_product/inventory" : ""}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default Variant;