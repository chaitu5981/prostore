export const checkoutSteps = [
  "User Login",
  "Shipping Address",
  "Payment Method",
  "Place Order",
];
export const newProductDefaultValues = {
  name: "",
  slug: "",
  category: "",
  brand: "",
  description: "",
  stock: "0",
  images: [],
  isFeatured: false,
  banner: "",
  price: "0",
};
export const PAYMENT_METHODS = ["PayPal", "Stripe", "Cash On Delivery"];
export const DEFAULT_PAYMENT_METHOD = "PayPal";

export const ROLES = ["user", "admin"];

export const prices = [
  {
    label: "$1 to $50",
    value: "1-50",
  },
  {
    label: "$51 to $100",
    value: "51-100",
  },
  {
    label: "$101 to $200",
    value: "101-200",
  },
  {
    label: "$201 to $500",
    value: "201-500",
  },
  {
    label: "$501 to $1000",
    value: "501-1000",
  },
];
