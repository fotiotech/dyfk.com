import React from "react";

type AttributeType = {
  attrName: string;
  attrValue: string[];
};

type FormDataType = {
  attributes: { [key: string]: string[] }; // Dictionary structure for dynamic access
};

interface AttributeProps {
  attributes: AttributeType[];
  formData: FormDataType;
  handleAttributeChange: (attrName: string, selectedValues: string[]) => void;
}

const EditAttribute: React.FC<AttributeProps> = ({
  attributes,
  formData,
  handleAttributeChange,
}) => {
  // Helper to handle multiple selections
  const onAttributeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    attrName: string
  ) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    handleAttributeChange(attrName, selectedValues); // Pass selected values to handler
  };


  return (
    <div className="flex-1">
      <div className="p-2 bg-pri dark:bg-pri-dark rounded-xl mb-2">
        <h2 className="font-semibold text-xl m-2 mt-5">Product Attributes</h2>
        <div className="flex flex-col lg:grid-cols-3 gap-2 p-2">
          {attributes?.length > 0 &&
            attributes.map((p) => (
              <div key={p.attrName}>
                <label>
                  {p.attrName[0].toUpperCase() + p.attrName.substring(1)}
                </label>
                <div>
                  <select
                    title="select attribute"
                    multiple
                    name={p.attrName}
                    value={formData.attributes[p.attrName] || []} // Ensure value is an array
                    onChange={(e) => onAttributeChange(e, p.attrName)} // Use helper to handle multiple selections
                    className="w-3/4 p-2 rounded-lg bg-[#eee] dark:bg-sec-dark scrollbar-none"
                  >
                    <option value="">Select {p.attrName}</option>
                    {p.attrValue.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EditAttribute;
