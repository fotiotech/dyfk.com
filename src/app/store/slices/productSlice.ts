import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  sku: string;
  product_name: string;
  brandId: string;
  department: string;
  description: string;
  price: number;
  imageUrls: string[];
  categoryId: string;
  attributes: { [key: string]: { [key: string]: string[] } };
  step?: number;
}

const initialState: ProductState = {
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

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductData(state, action: PayloadAction<ProductState>) {
      return action.payload;
    },
    updateProduct: (
      state,
      action: PayloadAction<{
        field: keyof ProductState;
        value: string | string[] | number;
      }>
    ) => {
      const { field, value } = action.payload;

      // Safely update state[field] only if it exists in ProductState
      if (field in state) {
        (state[field] as typeof value) = value;
      }
    },
    updateCategoryId(state, action: PayloadAction<string>) {
      state.categoryId = action.payload;
    },
    updateAttributes: (
      state,
      action: PayloadAction<{
        groupName: string;
        attrName: string;
        selectedValues: string[];
      }>
    ) => {
      const { groupName, attrName, selectedValues } = action.payload;
      if (!state.attributes[groupName]) {
        state.attributes[groupName] = {};
      }
      state.attributes[groupName][attrName] = selectedValues;
    },
    nextStep(state) {
      if (state) {
        state.step! += 1;
      }
    },
    prevStep(state) {
      state.step! -= 1;
    },
    resetProduct() {
      return initialState;
    },
  },
});

export const {
  setProductData,
  updateProduct,
  updateCategoryId,
  updateAttributes,
  nextStep,
  prevStep,
  resetProduct,
} = productSlice.actions;

export default productSlice.reducer;
