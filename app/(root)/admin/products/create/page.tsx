import ProductForm from "@/components/admin/product-form";

const CreateProduct = () => {
  return (
    <div className="wrapper">
      <p className="text-xl font-semibold my-5">Create Product</p>
      <ProductForm type="create" />
    </div>
  );
};
export default CreateProduct;
