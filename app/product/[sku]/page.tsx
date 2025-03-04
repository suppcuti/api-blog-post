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
        <div className="w-full md:w-80">
          <img
            src={product.product.image?.url || "/placeholder.jpg"}
            alt={product.product.name || "Unnamed product"}
            className="w-full h-auto object-cover rounded-xl shadow-md"
          />
          {/* Color options (simplified as buttons for now; you'd need real data from variants) */}
          <div className="mt-4 flex gap-2 justify-center">
            {["Black", "White", "Red"].map((color) => (
              <button
                key={color}
                className={`w-12 h-12 rounded-full border-2 ${
                  color === "Black" ? "border-yellow-500 bg-gray-800" : "border-gray-300"
                }`}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>
        </div>
        <div className="text-center md:text-left flex-1">
          <p className="text-red-600 font-bold text-2xl">
            🔥 Giá sale: {product.sale_price}₫
          </p>

          <p className="text-gray-500 line-through text-lg">
            Giá gốc: {product.price_original}₫
          </p>
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <button className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition">
              Mua ngay
            </button>
            <button className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition">
              giỏ hàng
            </button>
            <button className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition">
              Yêu thích
            </button>
          </div>
          <div className="mt-4">
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
              Trả góp 0% - Duyệt nhanh trong 5 phút
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Thanh toán qua: Visa, MasterCard, JCB, AMEX
            </p>
          </div>
          <button className="mt-4 px-6 py-3 bg-yellow-500 text-gray-800 font-semibold rounded-xl hover:bg-yellow-600 transition flex items-center gap-2">
            <span>Chat Zalo</span>
            <span className="text-xl">💬</span>
          </button>
          <button className="mt-2 px-6 py-3 bg-yellow-500 text-gray-800 font-semibold rounded-xl hover:bg-yellow-600 transition flex items-center gap-2">
            <span>Gọi Ngay Gía Tốt</span>
            <span className="text-xl">📞</span>
          </button>
        </div>
      </div>
      {/* Hot Deal Section */}
      <div className="mt-6 p-4 bg-orange-500 text-white rounded-xl">
        <h3 className="text-xl font-bold mb-2">KHUYẾN MÃI HOT</h3>
        <p>
          1️⃣ Tặng 3; Phụ kiện mua 1 tặng 1 - Combo phụ kiện siêu tiết kiệm...
        </p>
      </div>
    </div>
  );
}