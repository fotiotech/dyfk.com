import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductState {
  sku: string;
  product_name: string;
  brandId: string;
  department: string;
  description: string;
  basePrice?: number;
  finalPrice: number;
  taxRate?: number;
  discount?: { type: string; value: number } | null;
  currency?: string;
  upc?: string;
  ean?: string;
  gtin?: string;
  stockQuantity?: number;
  imageUrls: string[];
  categoryId: string;
  attributes: { [key: string]: { [key: string]: string[] } };
  status: "active" | "inactive";
  step: number;
}

export const initialState: ProductState = {
  sku: "",
  product_name: "",
  brandId: "",
  department: "",
  description: "",
  basePrice: 0.0,
  finalPrice: 0.0,
  taxRate: 0,
  discount: null,
  currency: "XAF",
  upc: "",
  ean: "",
  gtin: "",
  stockQuantity: 0,
  imageUrls: [],
  categoryId: "",
  attributes: {},
  status: "active",
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
        value: string | string[] | number | null;
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
      state.step += 1;
    },
    prevStep(state) {
      state.step -= 1;
    },
    resetProduct(state) {
      return initialState;
    },
    updateDiscount: (
      state,
      action: PayloadAction<{ type: string; value: number }>
    ) => {
      state.discount = action.payload;
    },
    setProductPrice: (
      state,
      action: PayloadAction<{
        basePrice: number;
        taxRate: number;
        discount?: number;
      }>
    ) => {
      const { basePrice, taxRate, discount = 0 } = action.payload;
      state.basePrice = basePrice;
      state.taxRate = taxRate;

      // Calculate discount amount
      const discountAmount = (basePrice * discount) / 100;

      // Calculate final price
      state.finalPrice =
        basePrice + (basePrice * taxRate) / 100 - discountAmount;
    },

    updateStockQuantity(state, action: PayloadAction<number>) {
      state.stockQuantity = action.payload;
    },
    updateCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload;
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
  updateDiscount,
  setProductPrice,
  updateStockQuantity,
  updateCurrency,
} = productSlice.actions;

export default productSlice.reducer;
