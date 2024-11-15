import React from "react";

type AttributeType = {
  groupName: string;
  attributes: {
    attrName: string;
    attrValue: string[];
  }[];
};

type FormDataType = {
  attributes: { [key: string]: { [key: string]: string[] } }; // Grouped attributes
};

interface AttributeProps {
  attributes: AttributeType[]; // Grouped attributes
  formData: FormDataType;
  handleAttributeChange: (
    groupName: string,
    attrName: string,
    selectedValues: string[]
  ) => void;
}

const Attribute: React.FC<AttributeProps> = ({
  attributes,
  formData,
  handleAttributeChange,
}) => {
  // Helper to handle multiple selections
  const onAttributeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    groupName: string,
    attrName: string
  ) => {
    const selectedValues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    handleAttributeChange(groupName, attrName, selectedValues); // Pass selected values to handler
  };

  return (
    <div className="flex-1">
      <div className="p-2 bg-pri dark:bg-pri-dark rounded-xl mb-2">
        <h2 className="font-semibold text-xl m-2 mt-5">Product Attributes</h2>
        <div className="flex flex-col lg:grid-cols-3 gap-2 p-2">
          {attributes?.length > 0 &&
            attributes.map((group) => (
              <div key={group.groupName} className="mb-4">
                <h3 className="font-semibold text-lg mb-2">
                  {group.groupName[0].toUpperCase() +
                    group.groupName.substring(1)}
                </h3>
                {group.attributes.map((attr) => (
                  <div key={attr.attrName}>
                    <label>
                      {attr.attrName[0].toUpperCase() +
                        attr.attrName.substring(1)}
                    </label>
                    <div>
                      <select
                        title={`Select ${attr.attrName}`}
                        multiple
                        name={attr.attrName}
                        value={
                          formData.attributes[group.groupName]?.[attr.attrName] ||
                          []
                        } // Ensure value is an array
                        onChange={(e) =>
                          onAttributeChange(e, group.groupName, attr.attrName)
                        } // Pass group and attrName
                        className="w-3/4 p-2 rounded-lg bg-[#eee] dark:bg-sec-dark scrollbar-none"
                      >
                        <option value="">
                          Select {attr.attrName}
                        </option>
                        {attr.attrValue.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Attribute;
