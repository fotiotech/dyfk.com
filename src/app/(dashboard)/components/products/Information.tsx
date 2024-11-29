import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { RootState } from "@/app/store/store";
import {
  updateProduct,
  nextStep,
  prevStep,
} from "@/app/store/slices/productSlice";
import FilesUploader from "@/components/FilesUploader";
import { getBrands } from "@/app/actions/brand";
import { Brand } from "@/constant/types";

const BasicInformation = () => {
  const initialState = {
    sku: "",
    product_name: "",
    brandId: "",
    department: "",
    description: "",
    price: 0.0,
    imageUrls: [],
    categoryId: "",
    attributes: {},
    step: 1,
  };
  const dispatch = useDispatch();
  const {
    sku,
    product_name,
    brandId,
    department,
    description,
    price,
    imageUrls,
  } = useSelector((state: RootState) => state.product);

  const [files, setFiles] = useState<string[]>(imageUrls); // Store URLs of uploaded images
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<{
    value: string;
    label: string;
  } | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      const res = await getBrands();
      setBrands(res);
    };
    fetchBrands();
  }, []);

  // Handle file changes (i.e., image URLs)
  const handleFilesChange = (newFiles: string[]) => {
    setFiles(newFiles);
    dispatch(updateProduct({ field: "imageUrls", value: newFiles })); // Update the Redux state with the new image URLs
  };

  // Handle input changes (for text fields like sku, product_name, etc.)
  const handleChange =
    (field: keyof typeof initialState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      if (field === "price") {
        dispatch(updateProduct({ field, value: parseFloat(value) }));
      } else {
        dispatch(updateProduct({ field, value }));
      }
    };

  const handleBrandChange = (selectedOption: any) => {
    setSelectedBrand(selectedOption);
    dispatch(updateProduct({ field: "brandId", value: selectedOption.value }));
  };

  const handleNext = () => {
    dispatch(nextStep());
  };

  const brandOptions = brands.map((brand) => ({
    value: brand._id,
    label: brand.name,
  }));

  return (
    <div className="space-y-6">
      <FilesUploader files={files} setFiles={handleFilesChange} />{" "}
      {/* Pass handleFilesChange to update image URLs */}
      <h2 className="text-2xl font-semibold">Basic Information</h2>
      <div className="flex flex-col">
        <label htmlFor="sku" className="text-sm font-medium">
          SKU
        </label>
        <input
          id="sku"
          type="text"
          value={sku}
          placeholder="Enter SKU"
          onChange={handleChange("sku")}
          className="border rounded p-2 mt-1 bg-transparent"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="product_name" className="text-sm font-medium">
          Product Name
        </label>
        <input
          id="product_name"
          type="text"
          value={product_name}
          placeholder="Enter Product Name"
          onChange={handleChange("product_name")}
          className="border rounded p-2 mt-1 bg-transparent"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="brand" className="text-sm font-medium">
          Brand
        </label>
        <Select
          id="brand"
          value={selectedBrand}
          options={brandOptions as any}
          onChange={handleBrandChange}
          isClearable
          className="mt-1 bg-transparent text-sec"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="department" className="text-sm font-medium">
          Department
        </label>
        <input
          id="department"
          type="text"
          value={department}
          placeholder="Enter Department"
          onChange={handleChange("department")}
          className="border rounded p-2 mt-1 bg-transparent"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="description" className="text-sm font-medium">
          Product Description
        </label>
        <textarea
          id="description"
          value={description}
          placeholder="Enter product description"
          onChange={handleChange("description")}
          className="border rounded p-2 mt-1 bg-transparent"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="price" className="text-sm font-medium">
          Price
        </label>
        <input
          id="price"
          type="number"
          value={price}
          placeholder="Enter Price"
          onChange={handleChange("price")}
          className="border rounded p-2 mt-1 bg-transparent"
        />
      </div>
      <div className="flex justify-between items-center space-x-4 mt-6">
        <button
          onClick={() => dispatch(prevStep())}
          className="bg-gray-500 text-white py-2 px-4 rounded"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BasicInformation;
