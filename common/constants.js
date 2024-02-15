const discountedPrice = (product) => {
  return Math.round(product.price * (1 - product.discountPercentage / 100));
};
module.exports = discountedPrice;
