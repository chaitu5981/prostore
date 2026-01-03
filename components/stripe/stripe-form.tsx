"use client";
import { Button } from "../ui/button";
import { FormEvent, useState } from "react";
import axios from "axios";
import Loader from "../Loader";
const StripeForm = ({ price, orderId }: { price: number; orderId: string }) => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { data } = await axios.post("/api/checkout_sessions", {
      price,
      orderId,
    });
    console.log(data);
    if (data.url) window.location.href = data.url;
    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <section>
        <Button type="submit" role="link" className="w-28">
          {loading ? <Loader size={15} /> : "Make Payment"}
        </Button>
      </section>
    </form>
  );
};
export default StripeForm;
