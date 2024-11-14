import { Category, Product } from "@/constant/types";
import { getCategoryEdit } from "@/fetch/category";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const HandleAttributtes = ({
  product,
  attributes,
  setAttributes,
}: {
  product: Product;
  attributes: { attributes?: Record<string, string | string[]> };
  setAttributes: (arg: {
    attributes?: Record<string, string | string[]>;
  }) => void;
}) => {
  const { data: parentCategory, isLoading: loadingCategory } =
    useQuery<Category>({
      queryKey: ["category", product?.category_id],
      queryFn: () => getCategoryEdit(product?.category_id),
      enabled: !!product?.category_id, // Ensure query runs only if categoryId is available
    });
  return (
    <div className="p-2 bg-pri dark:bg-pri-dark rounded-xl mb-2">
      <h2 className="font-semibold text-xl m-2 mt-5">Product Attributes</h2>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 p-2">
        {parentCategory?.attributes?.map((p) => (
          <div key={p.attrName}>
            <label>
              {p.attrName[0].toUpperCase() + p.attrName?.substring(1)}
            </label>
            <select
              title="select attribute"
              name={p.attrName}
              onChange={(e) =>
                setAttributes({
                  ...attributes,
                  attributes: {
                    ...attributes.attributes,
                    [p.attrName]: e.target.value,
                  },
                })
              }
              className="p-2 rounded-lg bg-[#eee] dark:bg-sec-dark"
            >
              <option value="">Select {p.attrName}</option>
              {p?.attrValue?.map((v: string) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HandleAttributtes;
