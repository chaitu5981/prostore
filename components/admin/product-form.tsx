"use client";
import { newProductDefaultValues } from "@/lib/constants";
import { UploadButton } from "@/lib/uploadthing";
import { insertProductSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import slugify from "slugify";
import { Card, CardContent } from "../ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { useTransition } from "react";
import { createProduct, updateProduct } from "@/lib/actions/products.actions";
import { useRouter } from "next/navigation";
import Loader from "../Loader";
import { Product } from "@/types";
const ProductForm = ({
  type,
  product,
}: {
  type: string;
  product?: Product;
}) => {
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: type == "create" ? newProductDefaultValues : product,
  });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const generateSlug = () => {
    const name = form.getValues("name");
    if (name) form.setValue("slug", slugify(name, { lower: true }));
  };
  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = (
    values
  ) => {
    startTransition(async () => {
      let res;
      if (type == "create") res = await createProduct(values);
      else if (product)
        res = await updateProduct({ id: product.id, ...values });
      if (res && !res.success) toast.error(res.message);
      else {
        toast.success(res?.message);
        router.back();
      }
    });
  };
  const isFeatured = form.watch("isFeatured");
  return (
    <div>
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex gap-5 flex-col md:flex-row">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-1">
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter Product Name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="flex-1">
              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="slug">Slug</FieldLabel>
                    <Input {...field} id="slug" autoComplete="off" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button onClick={generateSlug} type="button" className="my-3">
                Generate
              </Button>
            </div>
          </div>
          <div className="flex gap-5 flex-col md:flex-row">
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-1">
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <Input
                    {...field}
                    id="category"
                    placeholder="Enter Product Category"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="brand"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-1">
                  <FieldLabel htmlFor="brand">Brand</FieldLabel>
                  <Input
                    {...field}
                    id="brand"
                    autoComplete="off"
                    placeholder="Enter Product brand"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="flex gap-5 flex-col md:flex-row">
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-1">
                  <FieldLabel htmlFor="price">Price</FieldLabel>
                  <Input
                    {...field}
                    id="price"
                    placeholder="Enter Product Price"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="stock"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-1">
                  <FieldLabel htmlFor="stock">Stock</FieldLabel>
                  <Input
                    {...field}
                    id="stock"
                    autoComplete="off"
                    placeholder="Enter Product stock"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Controller
            name="images"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-1">
                <FieldLabel htmlFor="images">Images</FieldLabel>
                <Card>
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex gap-4 flex-wrap">
                      {field.value.map((image) => (
                        <Image
                          key={image}
                          src={image}
                          alt="Product Image"
                          width={100}
                          height={100}
                          className="object-cover object-center w-15 h-15"
                        />
                      ))}
                    </div>
                    <UploadButton
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange([...field.value, res[0].ufsUrl]);
                        toast.success("Image uploaded successfully");
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(error.message);
                      }}
                    />
                  </CardContent>
                </Card>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Card>
            <CardContent>
              <Controller
                name="isFeatured"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="checkbox"
                        onCheckedChange={field.onChange}
                        checked={field.value}
                        className="border border-gray-500"
                      />
                      <FieldLabel htmlFor="checkbox">Is Featured?</FieldLabel>
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {isFeatured && (
                <Controller
                  name="banner"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex-1">
                      {field.value && (
                        <Image
                          src={field.value}
                          alt="Banner Image"
                          className="w-full h-100"
                          width={1200}
                          height={800}
                        />
                      )}
                      {!field.value && (
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            field.onChange(res[0].ufsUrl);
                            toast.success("Image uploaded successfully");
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(error.message);
                          }}
                        />
                      )}
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}
            </CardContent>
          </Card>
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-1">
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Enter Product Description"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Button className="my-5 w-full">
          {isPending ? (
            <Loader size={20} />
          ) : (
            `${type == "create" ? "Create" : "Update"} Product`
          )}
        </Button>
      </form>
    </div>
  );
};
export default ProductForm;
