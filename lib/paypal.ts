const { PAYPAL_API, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

export const paypal = {
  createOrder: async (price: string) => {
    const accessToken = await generateAccessToken();
    const response = await fetch(
      `${process.env.PAYPAL_API}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: parseFloat(price).toFixed(2),
              },
            },
          ],
        }),
      }
    );
    if (response.ok) return await response.json();
    else {
      const error = await response.text();
      throw new Error(error);
    }
  },

  captureOrder: async (orderID: string) => {
    const accessToken = await generateAccessToken();
    const response = await fetch(
      `${process.env.PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );
    if (response.ok) return await response.json();
    else throw new Error(await response.text());
  },
};

export const generateAccessToken = async () => {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (response.ok) {
    const jsonResponse = await response.json();
    return jsonResponse.access_token;
  } else {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
};
