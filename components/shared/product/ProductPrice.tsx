const ProductPrice = ({ price }: { price: number }) => {
  const formattedPrice = price.toFixed(2);
  const [intVal, decVal] = formattedPrice.split(".");
  return (
    <div>
      <span className="text-sm align-super">$</span>
      <span className="text-lg font-bold">{intVal}</span>
      <span className="text-sm align-super">.{decVal}</span>
    </div>
  );
};
export default ProductPrice;
