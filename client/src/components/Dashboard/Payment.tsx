import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from "../../services/axiosClient";

interface Payment {
  id: string;
  created_at: string;
  status: "SUCCESS" | "FAILED";
  amount: number;
  transaction_id: string;
  car_rent_id: string;
}

const PaymentHistory = () => {
  const location = useLocation();
  const cartId = location.state?.cartId;

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!cartId) {
      setError(" شناسه سبد خرید یافت نشد. لطفاً از صفحه رزروها وارد شوید.");
      setLoading(false);
      return;
    }

    const fetchPayments = async () => {
      try {
        const response = await axiosClient.get(
          `/payments/${cartId}?page=1&limit=10&order=desc`,
        );
        const paymentsData = response.data.response.data.payments;
        setPayments(paymentsData);
        console.log(" list Payments :", paymentsData);
      } catch (err) {
        setError("Error in get list Paymwents :");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [cartId]);

  if (loading)
    return <div className="text-center py-10">در حال بارگذاری...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!payments.length)
    return (
      <div className="text-center py-10">
        هیچ پرداختی برای این سبد یافت نشد.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-right">
        {" "}
        تاریخچه پرداخت‌های سبد
      </h2>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white shadow rounded-lg p-4 border-r-4 border-yellow-400"
          >
            <div className="grid grid-cols-2 gap-2 text-right">
              <div>
                <span className="font-semibold text-gray-600">مبلغ:</span>
                <span className="mr-2 text-gray-800">
                  {payment.amount.toLocaleString()} تومان
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">وضعیت:</span>
                <span
                  className={`mr-2 px-2 py-0.5 rounded text-sm ${
                    payment.status === "SUCCESS"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {payment.status === "SUCCESS" ? "✅ موفق" : "❌ ناموفق"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">کد رهگیری:</span>
                <span className="mr-2 text-gray-800">
                  {payment.transaction_id}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">تاریخ:</span>
                <span className="mr-2 text-gray-800">
                  {new Date(payment.created_at).toLocaleDateString("fa-IR")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;
