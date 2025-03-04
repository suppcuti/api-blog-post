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
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        {data.DailySales.items.map((sale: any) =>
          sale.items.map((item: any) => (
            <div key={item.product.sku} className="border rounded-lg shadow-lg p-4">
              <img src={item.product.image.url} alt={item.product.name} className="w-full h-70 object-cover" />
              <h3 className="text-lg font-semibold text-black">{item.product.name}</h3>
              <p className="text-red-500 font-bold">Giá giảm: {item.sale_price}₫</p>
              <p className="text-gray-500 line-through">Giá gốc: {item.price_original}₫</p>
              <Link href={`/product/${item.product.sku}`} className="text-blue-500 mt-2 inline-block">
                Xem chi tiết
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
