"use client";

import { createAttribute } from "@/app/actions/attributes";
import { getCategory } from "@/app/actions/category";
import { Category } from "@/constant/types";
import React, { useEffect, useState } from "react";

type AttributeType = {
  attrName: string;
  attrValue: string[];
};

const Attributes = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [catId, setCatId] = useState<string>("");
  const [attributes, setAttributes] = useState<AttributeType[]>([]);
  const [formData, setFormData] = useState<AttributeType[]>([
    { attrName: "", attrValue: [""] },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (catId) {
        const res = await getCategory(catId);
        setAttributes(res.attributes || []);
      } else {
        const res = await getCategory();
        setCategory(res || []);
      }
    };

    fetchData();
  }, [catId]);

  function addAttributes() {
    setFormData((prev) => [...prev, { attrName: "", attrValue: [""] }]);
  }

  // Handle changes for both attrName and attrValue in formData
  const handleInputChange = (index: number, field: string, value: string) => {
    setFormData((prev) =>
      prev.map((attr, i) =>
        i === index
          ? {
              ...attr,
              [field]: field === "attrValue" ? value.split(",") : value,
            }
          : attr
      )
    );
  };

  return (
    <>
      <h2 className="font-bold text-xl my-2">Attributes</h2>
      <form action={createAttribute}>
        <select
          title="Parent Category"
          name="catId"
          onChange={(e) => setCatId(e.target.value)}
          value={catId}
          className="w-3/4 p-2 rounded-lg bg-[#eee] dark:bg-sec-dark"
        >
          <option value="" className="text-gray-700">
            Select category
          </option>
          {category?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.categoryName}
            </option>
          ))}
        </select>

        {formData.map((attr, index) => (
          <div key={index} className="flex gap-2">
            <div>
              <label htmlFor={`attrName-${index}`}>Attribute Name:</label>
              <input
                id={`attrName-${index}`}
                type="text"
                name={`attrName-${index}`}
                value={attr.attrName}
                onChange={(e) =>
                  handleInputChange(index, "attrName", e.target.value)
                }
                className="p-2 rounded-lg bg-[#eee] dark:bg-sec-dark"
              />
            </div>
            <div>
              <label htmlFor={`attrValue-${index}`}>Attribute Value:</label>
              <input
                id={`attrValue-${index}`}
                type="text"
                name={`attrValue-${index}`}
                value={attr.attrValue.join(",")}
                placeholder="Values separated by commas"
                onChange={(e) =>
                  handleInputChange(index, "attrValue", e.target.value)
                }
                className="p-2 rounded-lg bg-[#eee] dark:bg-sec-dark"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end items-center gap-2">
          <button onClick={addAttributes} type="button" className="btn text-sm">
            Add new property
          </button>
          <button type="submit" className="btn my-2">
            Save
          </button>
        </div>
      </form>

      <div>
        <h3 className="font-bold text-lg">Attributes</h3>
        <ul className="flex flex-col gap-1 max-h-96 overflow-hidden overflow-y-auto scrollbar-none">
          {attributes?.map((attr) => (
            <li
              key={attr.attrName}
              className="flex justify-between cursor-pointer font-bold hover:bg-pri-dark bg-opacity-5"
            >
              {attr.attrName}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Attributes;
