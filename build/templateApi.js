export function fetchProductList() {
  return new Promise(async (resolve) => {
    const response = await fetch(`http://localhost:8000/api/products`);
    const data = await response.json();
    resolve({ data });
  });
}
