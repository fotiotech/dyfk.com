export type Users = {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Category = {
  _id: string;
  parent_id: number;
  url_slug?: string;
  categoryName: string;
  description: string;
  imageUrl?: string;
  seo_title?: string;
  seo_desc?: string;
  keywords?: string;
  sort_order?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export type Brands = {
  id_brands: number;
  name: string;
  imageUrl: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  _id: string;
  id_subcategory?: number;
  department: string;
  dsin?: string;
  sku?: string;
  Barcode?: string;
  url_slug?: string;
  product_id?: number;
  brand_id?: number;
  imageUrl?: string;
  product_name: string;
  price: number;
  color?: string;
  discount?: number;
  created_at?: string;
  updated_at?: string;
  description: string;
  status?: string;
};

export type Smartphones = {
  ModelName: string;
  SerialNumber: string;
  OperatingSystem: string;
  RAmMemory: number;
  InternalStorage: number;
  ExpandableStorage: string;
  RearCamera: string;
  FrontCamera: string;
  BatteryCapacity: number;
  ChargingType: string;
  Sensors: string;
  ScreenSize: number;
  CellularTechnology: string;
  WirelessCarrier: string;
  ConnectivityTechnology: string;
  RefreshRate: number;
  Weight: number;
  Warranty: string;
  Resolution: string;
  processor: number;
  BuildMaterial: string;
  WaterDustResistance: string;
  BoxContents: string;
  OtherFeature: string;
  Details: string;
};

export type SmartphonesVariants = {
  VariantID: number;
  id_product: number;
  variantSku: string;
  VariantName: string;
  variantPrice: number;
  variantSize: number;
  variantWeight: number;
  variantColor: string;
  StorageCapacity: string;
  RAM: number;
  StockLevel: number;
  Barcode: string;
  Dimensions: string;
  Weight: number;
  BatteryCapacity: number;
  ScreenSize: number;
  CameraSpecifications: string;
  OperatingSystem: string;
  Connectivity: string;
  Warranty: number;
  ReleaseDate: string;
  Discounts: string;
  VariantImageUrl: string;
  Features: string;
  ShippingWeight: number;
  Supplier: string;
  Popularity: string;
};

export type Shipping = {
  ShippingCost: number;
  orderId: number;
  customerId: number;
  ShippingAddress: string;
  ShippingMethod: string;
  Carrier: string;
  TrackingNumber: number;
  ShipmentDate: string;
  ExpectedDeliveryDate: string;
  ActualDeliveryDate: string;
  Weight: number;
  Dimensions: string;
  ShippingInstructions: string;
  InsuranceAmount: number;
  SignatureRequired: string;
  ReturnTrackingNumber: string;
  CustomsInformation: string;
  PackageContents: string;
  DeliveryConfirmation: string;
  ReturnStatus: string;
  PackagingType: string;
};

export type Offer = {
  starDate: string;
  endDate: string;
  OfferName: string;
  Description: string;
  DiscountType: string;
  DiscountValue: string;
  MinimumPurchaseAmount: number;
  MaximumDiscountAmount: number;
  ApplicableProducts: string;
  ApplicableCategories: string;
  UsageLimitPerCustomer: string;
  TotalUsageLimit: number;
  CouponCode: string;
  CustomerEligibility: string;
  Status: string;
  CreatedBy: string;
  TermsAndConditions: string;
  Exclusions: string;
  Priority: string;
  PromoBanner: string;
  RedemptionCount: string;
  Created_at: string;
  Updated_at: string;
};

export type Inventory = {
  id_product: number;
  sku: string;
  stockQuantity: number;
  stockAvailability: number;
  product_name: string;
  minimumStockLevel: number;
  reorderQuantity: number;
  supplierId: number | string;
  warehouseLocation: string;
  batchNumber: number;
  expiryDate: string;
  dateReceived: string;
  dateLastSold: string;
  costPrice: number;
  sellingPrice: number;
  stockStatus: number;
  reservedStock: number;
  damagedStock: number;
  stockValue: number;
  stockTurnOverRate: number;
  lastCheckDate: string;
};

export type Order = {
  OrderID: number;
  CustomerID: number;
  OrderStatus: string;
  PaymentMethod: string;
  PaymentStatus: string;
  ShippingAddress: string;
  BillingAddress: string;
  TotalAmount: number;
  Subtotal: number;
  TaxAmount: number;
  ShippingCost: number;
  DiscountsApplied: string;
  OrderItems: string;
  OrderTrackingNumberID: string;
  ShippingMethod: string;
  EstimatedDeliveryDate: string;
  ActualDeliveryDate: string;
  CustomerNotes: number;
  InternalNotes: number;
  ReturnStatus: string;
  RefundAmount: number;
  GiftWrap: string;
  GiftMessage: string;
  CouponCodeUsed: string;
  OrderSource: string;
  OrderPriority: string;
  InvoiceNumber: number;
  SalesRepresentative: string;
  CustomerIPAddress: string;
  OrderDate: string;
};

export type ProductsFiles = {
  files_id: number;
  productId: number;
  filesUrl: string;
  originalname: string;
  mimetype: string;
  size: string;
};

export type HeroSection = {
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  created_at: string;
};
