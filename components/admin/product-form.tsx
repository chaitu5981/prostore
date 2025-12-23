"use client";
import { newProductDefaultValues } from "@/lib/constants";
import { UploadButton } from "@/lib/uploadthing";
import { insertProductSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import slugify from "slugify";
const ProductForm = ({ type }: { type: string }) => {
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: newProductDefaultValues,
  });
  const generateSlug = () => {
    const name = form.getValues("name");
    if (name) form.setValue("slug", slugify(name, { lower: true }));
  };
  const onSubmit = () => {};
  return (
    <div>
      <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex gap-5 flex-col md:flex-row">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">Name</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    placeholder="Enter Product Name"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div>
              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-slug">Slug</FieldLabel>
                    <Input {...field} id="form-rhf-slug" autoComplete="off" />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button onClick={generateSlug} className="my-3">
                Generate
              </Button>
            </div>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
};
export default ProductForm;
