"use client";
import { Button } from "../ui/button";
import { FormEvent } from "react";
import axios from "axios";
const StripeForm = ({ price, orderId }: { price: number; orderId: string }) => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await axios.post("/api/checkout_sessions", {
      price,
      orderId,
    });
    if (data.url) window.location.href = data.url;
  };
  return (
    <form onSubmit={handleSubmit}>
      <section>
        <Button type="submit" role="link">
          Checkout
        </Button>
      </section>
    </form>
  );
};
export default StripeForm;
