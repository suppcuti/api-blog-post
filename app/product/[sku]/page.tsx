import { gql } from "@apollo/client";
import { getClient } from "@/lib/apolloClient";

const GET_PRODUCT_DAILY_SALES = gql`
  query getProductDailySales(
    $filter: DailySaleFilterInput
    $pageSize: Int
    $currentPage: Int
  ) {
    DailySales(filter: $filter, pageSize: $pageSize, currentPage: $currentPage) {
      items {
        items {
          product {
            sku
            name
            url_key
            image {
              url
            }
          }
          sale_price
          price_original
        }
      }
      total_count
    }
  }
`;

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ sku: string }>; // Define params as a Promise
}) {
  // Await the params to resolve it into an object
  const resolvedParams = await params;
  const sku = resolvedParams.sku; // Safely extract sku after awaiting

  // Perform the asynchronous data fetch
  const client = getClient();
  const { data, error } = await client.query({
    query: GET_PRODUCT_DAILY_SALES,
    variables: {
      filter: { sale_type: { eq: "thuong-hieu" } },
      pageSize: 50,
      currentPage: 1,
    },
  });

  // Handle errors or missing data
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!data?.DailySales) return <p className="text-gray-500">Product not found</p>;

  // Find the product using the extracted sku
  const allItems = data.DailySales.items.flatMap((sale: any) => sale.items);
  const product = allItems.find((item: any) => item.product.sku === sku);

  if (!product) return <p className="text-gray-500">Product not found</p>;

  // Render the product details
  return (
    <div className="container mx-auto p-6 bg-white rounded-2xl shadow-lg max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        {product.product.name}
      </h2>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <img
          src={product.product.image?.url || "/placeholder.jpg"}
          alt={product.product.name || "Unnamed product"}
          className="w-full md:w-80 h-auto object-cover rounded-xl shadow-md"
        />
        <div className="text-center md:text-left">
          <p className="text-red-600 font-bold text-2xl">
            🔥 Giá sale: {product.sale_price}₫
          </p>
          <p className="text-gray-500 line-through text-lg">
            Giá gốc: {product.price_original}₫
          </p>
          <button className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}