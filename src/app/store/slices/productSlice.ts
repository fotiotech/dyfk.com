import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VariantState {
  [key: string]: any;
  product_id?: string;
  url_slug?: string;
  dsin?: string;
  sku?: string;
  productName?: string;
  brand_id?: string;
  department?: string;
  description?: string;
  basePrice?: number;
  finalPrice?: number;
  taxRate?: number;
  discount?: number;
  currency?: string;
  upc?: string;
  ean?: string;
  gtin?: string;
  stockQuantity?: number;
  imageUrls?: string[];
  offerId?: string;
  category_id?: string;
  variantAttributes?: { [key: string]: { [key: string]: string[] } };
  status?: string;
}

export interface ProductState {
  sku: string;
  product_name: string;
  brand_id: string;
  department: string;
  description: string;
  basePrice?: number;
  finalPrice?: number;
  taxRate?: number;
  discount?: number;
  currency?: string;
  upc?: string;
  ean?: string;
  gtin?: string;
  stockQuantity?: number;
  imageUrls: string[];
  category_id: string;
  getVariant?: boolean;
  attributes: { [key: string]: { [key: string]: string[] } };
  variants: VariantState[];
  status: "active" | "inactive";
}

export const initialState: ProductState = {
  sku: "",
  product_name: "",
  brand_id: "",
  department: "",
  description: "",
  basePrice: 0.0,
  finalPrice: 0.0,
  taxRate: 0,
  discount: 0,
  currency: "XAF",
  upc: "",
  ean: "",
  gtin: "",
  stockQuantity: 0,
  imageUrls: [],
  category_id: "",
  getVariant: false,
  attributes: {},
  variants: [
    {
      product_id: "",
      url_slug: "",
      dsin: "",
      sku: "",
      productName: "",
      brand_id: "",
      department: "",
      description: "",
      basePrice: 0,
      finalPrice: 0,
      taxRate: 0,
      discount: 0,
      currency: "",
      upc: "",
      ean: "",
      gtin: "",
      stockQuantity: 0,
      imageUrls: [],
      offerId: "",
      category_id: "",
      variantAttributes: {},
      status: "active",
    },
  ],
  status: "active",
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
      state.category_id = action.payload;
    },
    updateGetVariant: (state, action: PayloadAction<boolean>) => {
      state.getVariant = action.payload;
    },
    updateVariantAttributes: (
      state,
      action: PayloadAction<{
        variantIndex: number;
        groupName: string;
        attrName: string;
        selectedValues: string[];
      }>
    ) => {
      const { variantIndex, groupName, attrName, selectedValues } =
        action.payload;

      if (state.variants[variantIndex]) {
        const variant = state.variants[variantIndex];

        // Ensure variantAttributes initialization if needed
        if (!variant.variantAttributes) {
          variant.variantAttributes = {};
        }

        if (!variant.variantAttributes[groupName]) {
          variant.variantAttributes[groupName] = {};
        }

        variant.variantAttributes[groupName][attrName] = selectedValues;
      }
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
    updateVariantField: (
      state = initialState,
      action: PayloadAction<{
        index: number;
        field: keyof VariantState;
        value: any;
      }>
    ) => {
      const { index, field, value } = action.payload;

      // Make a copy of the variants array
      const updatedVariants = [...state.variants];

      // Ensure the specific variant exists
      if (!updatedVariants[index]) {
        updatedVariants[index] = {}; // Initialize the variant if it's not defined
      }

      // Update the specific field in the correct variant
      updatedVariants[index] = {
        ...updatedVariants[index], // Keep the existing fields
        [field]: value, // Update the specific field with the new value
      };

      // Return the new state with updated variants
      return {
        ...state,
        variants: updatedVariants, // Updated variants array
      };
    },

    addVariant: (state, action: PayloadAction<VariantState>) => {
      if (!state.variants) {
        state.variants = [];
      }
      state.variants.push(action.payload);
    },
    updateSpecificVariant: (
      state,
      action: PayloadAction<{
        index: number;
        field: keyof VariantState;
        value: any;
      }>
    ) => {
      const { index, field, value } = action.payload;
      if (state.variants && state.variants[index]) {
        (state.variants[index][field] as any) = value;
      }
    },
    syncVariantWithParent: (state) => {
      state.variants = state.variants.map((variant) => ({
        sku: variant.sku || "", // Ensure SKU is present or default to empty
        basePrice: variant.basePrice ?? state.basePrice ?? 0, // Use variant's basePrice or fallback to parent's basePrice, default to 0
        finalPrice:
          variant.finalPrice ?? variant.basePrice ?? state.basePrice ?? 0, // Use variant's finalPrice, otherwise fall back to basePrice
        taxRate: variant.taxRate ?? state.taxRate, // Sync tax rate, default to parent's taxRate if not provided
        discount: variant.discount ?? state.discount ?? 0, // Sync discount object, fall back to parent's discount
        upc: variant.upc || "", // Default empty if not provided
        ean: variant.ean || "", // Default empty if not provided
        gtin: variant.gtin || "", // Default empty if not provided
        stockQuantity: variant.stockQuantity ?? 0, // Default to 0 if not defined
        imageUrls:
          variant?.imageUrls?.length! > 0 ? variant.imageUrls : state.imageUrls, // Sync images, fallback to parent's images if none in variant
        category_id: variant.category_id || state.category_id, // Sync category ID, fall back to parent's category_id
        variantAttributes: {
          ...state.attributes,
          ...variant.variantAttributes, // Merge parent attributes and variant attributes
        },
        status: variant.status || "active", // Default to active if status is missing
      }));
    },

    removeVariant: (state, action) => {
      // Filters out the variant at the provided index
      state.variants = state.variants.filter(
        (_, idx) => idx !== action.payload
      );
    },
    resetProduct(state) {
      return initialState;
    },
    updateDiscount: (state, action: PayloadAction<number>) => {
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
  updateGetVariant,
  updateVariantAttributes,
  removeVariant,
  syncVariantWithParent,
  updateSpecificVariant,
  addVariant,
  updateVariantField,
  updateAttributes,
  resetProduct,
  updateDiscount,
  setProductPrice,
  updateStockQuantity,
  updateCurrency,
} = productSlice.actions;

export default productSlice.reducer;
