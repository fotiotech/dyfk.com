import { findProducts } from "@/app/actions/products";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await findProducts(id); // Replace with your API endpoint
      if (!response) throw new Error("Failed to fetch product data");
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
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
  VProductCode?: string;
  stockQuantity?: number;
  imageUrls?: string[];
  offerId?: string;
  category_id?: string;
  variantAttributes?: { [key: string]: { [key: string]: string[] } };
  status?: string;
}

export interface ProductState {
  productId?: string;
  url_slug: string;
  sku: string;
  dsin: string;
  offerId: string;
  product_name: string;
  brand_id: string;
  department: string;
  description: string;
  basePrice?: number;
  finalPrice?: number;
  taxRate?: number;
  discount?: number;
  currency?: string;
  productCode?: string;
  stockQuantity?: number;
  imageUrls: string[];
  category_id: string;
  getVariant?: boolean;
  attributes: { [key: string]: { [key: string]: string[] } };
  variants: VariantState[];
  status: "active" | "inactive";
}

export const initialState: ProductState = {
  productId: "",
  url_slug: "",
  sku: "",
  dsin: "",
  product_name: "",
  brand_id: "",
  department: "",
  description: "",
  basePrice: 0.0,
  finalPrice: 0.0,
  taxRate: 0,
  discount: 0,
  currency: "XAF",
  productCode: "",
  stockQuantity: 0,
  imageUrls: [] as string[],
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
      VProductCode: "",
      stockQuantity: 0,
      imageUrls: [] as string[],
      offerId: "",
      category_id: "",
      variantAttributes: {},
      status: "active",
    },
  ],
  offerId: "",
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

      // Ensure `state.attributes` exists
      if (!state.attributes) {
        state.attributes = {};
      }

      // Ensure the groupName exists within attributes
      if (!state.attributes[groupName]) {
        state.attributes[groupName] = {};
      }

      // Update or set the attribute values
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
        // Sync product fields to variants, with variant-specific overrides
        product_id: state.productId || variant.product_id || "",
        sku: variant.sku || state.sku || "",
        productName: variant.productName || state.product_name || "",
        brand_id: variant.brand_id || state.brand_id || "",
        department: variant.department || state.department || "",
        description: variant.description || state.description || "",
        basePrice: variant.basePrice ?? state.basePrice ?? 0,
        finalPrice:
          variant.finalPrice ??
          variant.basePrice ??
          state.finalPrice ??
          state.basePrice ??
          0,
        taxRate: variant.taxRate ?? state.taxRate ?? 0,
        discount: variant.discount ?? state.discount ?? 0,
        currency: variant.currency || state.currency || "XAF",
        VProductCode: variant.VProductCode || state.productCode || "",
        stockQuantity: variant.stockQuantity ?? state.stockQuantity ?? 0,
        imageUrls:
          variant.imageUrls && variant.imageUrls.length > 0
            ? variant.imageUrls
            : state.imageUrls,
        category_id: variant.category_id || state.category_id || "",
        variantAttributes: {
          ...state.attributes,
          ...variant.variantAttributes, // Merge attributes from product and variant
        },
        status: variant.status || state.status || "active",
        offerId: variant.offerId || state.offerId,
        url_slug: variant.url_slug || state.url_slug,
        dsin: variant.dsin || state.dsin,
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

    setImageUrls: (state, action: PayloadAction<string[]>) => {
      state.imageUrls = action.payload;
    },
    addImageUrl: (state, action: PayloadAction<string>) => {
      state.imageUrls.push(action.payload);
    },
    removeImageUrl: (state, action: PayloadAction<number>) => {
      state.imageUrls.splice(action.payload, 1);
    },

    updateStockQuantity(state, action: PayloadAction<number>) {
      state.stockQuantity = action.payload;
    },
    updateCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<ProductState>) => {
          // Update state with the fetched product data
          return { ...state, ...action.payload };
        }
      )
      .addCase(fetchProductById.rejected, (state, action) => {
        console.error("Failed to fetch product:", action.payload);
      });
  },
});

export const {
  setProductData,
  updateProduct,
  updateCategoryId,
  removeImageUrl,
  setImageUrls,
  addImageUrl,
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
