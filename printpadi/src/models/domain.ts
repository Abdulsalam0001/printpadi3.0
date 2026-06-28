// ============================================================
// PrintPadi – Domain types
// Exact port of shared/contracts/domain.ts from Next.js project
// ============================================================

export type Money = {
  amount:   number;
  currency: 'NGN';
};

export type Product = {
  id:               string;
  rating:           number;
  images:           string[];
  name:             string;
  badges:           string[];
  orders:           number;
  type:             'bulk' | 'retail';
  moq?:             number;
  stock?:           number;
  totalStockCount?: number;
  price:            number[];
  basePrice?:       number;
  priceTiers?: Array<{
    label:    string;
    minQty?:  number;
    maxQty?:  number;
    price:    number;
  }>;
  category:         string;
  tagNames?:        string[];
  /** slug-based tags used for filtering */
  tags?:            string[];
  origin?:          string;
  description?:     string;
  isCustomizable?:  boolean;
  availabilityLabel?: string;
  sizeScaleName?:   string;
  defaultColorId?:  string;
  colors?: Array<{
    id:               string;
    name:             string;
    hexValue:         string;
    stockCount?:      number;
    primaryImageUrl?: string;
    availability?: {
      status:     'IN_STOCK' | 'OUT_OF_STOCK';
      label:      string;
      stockCount: number;
    };
  }>;
  bulkDetails?: {
    productionTime?: string | null;
    deliveryTime?:   string | null;
    supportsSample?: boolean;
    samplePrice?:    number | null;
    designerFee?:    number | null;
  };
  sizeScale?: {
    id:              string;
    name:            string;
    defaultOptionId?: string;
    options: Array<{
      id:        string;
      label:     string;
      position?: number;
    }>;
  };
  optionGroups?: {
    customizations: Array<{
      id:         string;
      name:       string;
      isRequired: boolean;
      choices: Array<{
        id:                   string;
        label:                string;
        priceAdjustment?:     number;
        displayPriceAdjustment?: string;
        position?:            number;
      }>;
    }>;
    designOptions: Array<{
      id:         string;
      name:       string;
      isRequired: boolean;
      choices: Array<{
        id:                   string;
        label:                string;
        priceAdjustment?:     number;
        displayPriceAdjustment?: string;
        position?:            number;
      }>;
    }>;
  };
};

export type CartItemOption = {
  color?:          string;
  size?:           string;
  colorId?:        string;
  colorHex?:       string;
  sizeOptionId?:   string;
  /** option group id → choice id */
  choiceSelections?: Record<string, string>;
  designMethod?:     string;
  designFileUrl?:    string;
  designFilePublicId?: string;
  designFileName?:   string;
};

export type CartItem = {
  id:            string;
  productId:     string;
  name:          string;
  image:         string;
  unitPrice:     Money;
  quantity:      number;
  minQuantity?:  number;
  maxQuantity?:  number;
  options?:      CartItemOption;
};

export type Cart = {
  items:    CartItem[];
  currency: Money['currency'];
};
