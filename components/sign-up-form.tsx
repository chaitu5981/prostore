"use client";
import { signUpUser } from "@/lib/actions/user.actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { FormEvent, useState } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const res = await signUpUser(formData);
      console.log(res);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    } catch (e) {
      if (isRedirectError(e)) {
        toast.success("Account created successfully");
        throw e;
      }
      toast.error("Internal Error Occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex-col-center gap-6 w-full">
        <div className="w-full space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input name="name" type="name" id="name" placeholder="Xyz" />
        </div>
        <div className="w-full space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            id="email"
            placeholder="abc@gmail.com"
          />
        </div>
        <div className="w-full space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            type="password"
            id="password"
            placeholder="********"
          />
        </div>
        <div className="w-full space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            name="confirmPassword"
            type="password"
            id="confirmPassword"
            placeholder="********"
          />
        </div>
        <Button className="w-full" disabled={loading}>
          {loading ? "Signing Up" : "Sign Up"}
        </Button>
      </div>
    </form>
  );
};
export default SignUpForm;
