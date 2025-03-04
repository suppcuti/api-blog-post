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

// ✅ Định nghĩa kiểu dữ liệu cho params
interface ProductDetailProps {
  params: { sku: string };
}

// ✅ Sử dụng `async` component để chờ params
export default async function ProductDetail({ params }: ProductDetailProps) {
  // Chờ Next.js xử lý params
  const { sku } = await Promise.resolve(params);

  const client = getClient();
  const { data, error } = await client.query({
    query: GET_PRODUCT_DAILY_SALES,
    variables: {
      filter: { sale_type: { eq: "thuong-hieu" } }, 
      pageSize: 50, 
      currentPage: 1,
    },
  });

  if (error) return <p className="text-red-500">Lỗi: {error.message}</p>;
  if (!data?.DailySales) return <p className="text-gray-500">Không tìm thấy sản phẩm</p>;

  // 🔍 Lọc sản phẩm theo SKU từ params
  const product = data.DailySales.items
    .flatMap((sale: any) => sale.items)
    .find((item: any) => item.product.sku === sku);

  if (!product) return <p className="text-gray-500">Không tìm thấy sản phẩm</p>;

  return (
    <div className="container mx-auto p-6 bg-white rounded-2xl shadow-lg max-w-4xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">{product.product.name}</h2>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Hình ảnh sản phẩm */}
        <img
          src={product.product.image?.url || "/placeholder.jpg"}
          alt={product.product.name || "Sản phẩm không có tên"}
          className="w-full md:w-80 h-auto object-cover rounded-xl shadow-md"
        />
        {/* Thông tin sản phẩm */}
        <div className="text-center md:text-left">
          <p className="text-red-600 font-bold text-2xl">🔥 Giá giảm: {product.sale_price}₫</p>
          <p className="text-gray-500 line-through text-lg">Giá gốc: {product.price_original}₫</p>
          <button className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}
