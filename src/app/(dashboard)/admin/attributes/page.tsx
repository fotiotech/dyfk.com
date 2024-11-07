"use client";

import { getCategory, postAttribute } from "@/app/actions/category";
import { Category } from "@/constant/types";
import { useMutation } from "@tanstack/react-query";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

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

  const handleAttrNameChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => {
      const updatedAttributes = [...prev];
      updatedAttributes[index].attrName = event.target.value;
      return updatedAttributes;
    });
  };

  const handleAttrValueChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => {
      const updatedAttributes = [...prev];
      updatedAttributes[index].attrValue = event.target.value.split(",");
      return updatedAttributes;
    });
  };

  const handleSubmitAttribute = async (ev: FormEvent) => {
    ev.preventDefault();
    if (catId) {
      const data = formData.map((p) => ({
        attrName: p.attrName,
        attrValue: p.attrValue,
      }));
      await postAttribute({ formData: data, id: catId });
      setCatId("");
    }
  };

  function addAttributes() {
    setFormData((prev) => [
      ...prev,
      { attrName: "", attrValue: [""] },
    ]);
  }

  return (
    <>
      <h2 className="font-bold text-xl my-2">Attributes</h2>
      <form onSubmit={handleSubmitAttribute}>
        <select
          title="Parent Category"
          name="catId"
          onChange={(e) => setCatId(e.target.value)}
          value={catId}
          className="w-3/4 p-2 rounded-lg bg-[#eee] dark:bg-sec-dark"
        >
          <option value="" className="text-gray-700">Select category</option>
          {category?.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
          ))}
        </select>

        {formData.map((attr, index) => (
          <div key={index} className="flex gap-2">
            <div>
              <label htmlFor={`attrName-${index}`}>Attribute Name:</label>
              <input
                id={`attrName-${index}`}
                type="text"
                name="attrName"
                value={attr.attrName}
                onChange={(e) => handleAttrNameChange(index, e)}
                className="p-2 rounded-lg bg-[#eee] dark:bg-sec-dark"
              />
            </div>
            <div>
              <label htmlFor={`attrValue-${index}`}>Attribute Value:</label>
              <input
                id={`attrValue-${index}`}
                type="text"
                name="attrValue"
                value={attr.attrValue.join(",")}
                placeholder="Words, separated by commas"
                onChange={(e) => handleAttrValueChange(index, e)}
                className="p-2 rounded-lg bg-[#eee] dark:bg-sec-dark"
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end items-center gap-2">
          <button
            onClick={addAttributes}
            type="button"
            className="btn text-sm"
          >
            Add new property
          </button>
          <button type="submit" className="btn my-2">Save</button>
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