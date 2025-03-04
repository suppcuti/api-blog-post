import { gql, useQuery } from "@apollo/client";
import Link from "next/link";

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

export default function Home() {
  const { loading, error, data } = useQuery(GET_PRODUCT_DAILY_SALES, {
    variables: {
      filter: { sale_type: { eq: "thuong-hieu" } },
      pageSize: 10,
      currentPage: 1,
    },
  });

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error.message}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-black">Sản phẩm giảm giá</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 bg-[#FFFBE6] p-5">
        {data.DailySales.items.map((sale: any) =>
          sale.items.map((item: any) => {
            // Tính % giảm giá
            const discountPercent = Math.round(
              ((item.price_original - item.sale_price) / item.price_original) * 100
            );

            return (
              <div key={item.product.sku} className="relative border rounded-lg shadow-lg p-2 bg-white group">
                {/* Nhãn giảm giá */}
                {discountPercent > 0 && (
                  <div className="absolute z-10 top-2 left-2 bg-white border border-red-500 text-red-500 px-2 py-1 text-sm font-bold rounded-md">
                    -{discountPercent}%
                  </div>
                )}

                {/* Hình ảnh với hiệu ứng hover */}
                <Link href={`https://bachlongmobile.com/products/${item.product.url_key}`} className="text-blue-500 mt-2 inline-block">
                  <img
                    src={item.product.image.url}
                    alt={item.product.name}
                    className="w-full h-70 object-cover transition-transform duration-300 group-hover:-translate-y-2"
                  />
                </Link>

                <h3 className="font-semibold text-black text-sm line-clamp-2">{item.product.name}</h3>
                <div className="inline-block mb-auto mt-4">
                  <p className="text-red-500 font-bold">Giá giảm: {item.sale_price}₫</p>
                  <p className="text-gray-500 line-through">Giá gốc: {item.price_original}₫</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
