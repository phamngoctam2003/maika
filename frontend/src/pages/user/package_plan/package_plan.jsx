import { useEffect, useState } from "react";
import SuccessModal from "@/components/user/payment/success_modal";
import PackageService from "@/services/users/api-package";
import { message, notification } from "antd";
import { AntNotification } from "@/components/global/notification";
import { useAuth } from "@/contexts/authcontext";
import PaymentLoading from "@/components/payment/PaymentLoading";
import VnpayService from "@/services/vnpay/vnpay-service";
import { Loading } from "@components/loading/loading";

const PackagePlan = () => {
  const [packages, setPackages] = useState([]);
  const [showPaymentLoading, setShowPaymentLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, setActivePackage, hasMembership, getCurrentUser } =
    useAuth();
  const [isOpenModalPayment, setIsOpenModalPayment] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, [isAuthenticated]);

  const fetchPackages = async () => {
    try {
      const response = await PackageService.getPackage();
      setPackages(response.data || []);
      if (!response || response.data.length === 0) {
        return (
          <div className="flex items-center justify-center h-screen">
            <p className="text-gray-500">Không có gói hội viên nào.</p>
          </div>
        );
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    const paymentData = VnpayService.handlePaymentResult();

    if (paymentData?.vnp_TxnRef) {
      setLoading(true);
      VnpayService.vnpReturn(paymentData)
        .then(async (res) => {
          await new Promise((resolve) => setTimeout(resolve, 1500)); // Chờ để backend cập nhật trạng thái
          await fetchPackages();
          await getCurrentUser();
          setShowPaymentLoading(false);
          setLoading(false);
          setPaymentData(res.data);
          setIsOpenModalPayment(true);
        })
        .catch((err) => {
          console.error("VNPay return error:", err);
          setLoading(false);
          setShowPaymentLoading(false);
        });

      // Xóa các query params khỏi URL để tránh gọi lại khi reload
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    } else {
      setShowPaymentLoading(false);
    }
  }, []);

  const HandlePackage = (id) => {
    // Kiểm tra đăng nhập trước khi mua gói
    if (!isAuthenticated) {
      notification.warning({
        message: "Chưa đăng nhập",
        description: "Vui lòng đăng nhập để mua gói hội viên.",
        duration: 4,
      });
      return;
    }

    // Hiển thị loading
    setShowPaymentLoading(true);

    // Tạo thanh toán VNPay
    const currentUrl = window.location.origin;
    const returnUrl = `${currentUrl}/payment-result`;

    PackageService.createVnpayPayment(id, returnUrl)
      .then((response) => {
        // Kiểm tra response structure mới
        if (response.data && response.success) {
          // Lưu thông tin đơn hàng vào localStorage để tracking
          localStorage.setItem(
            "pending_order",
            JSON.stringify({
              order_id: id, // Sử dụng package_id làm order_id tạm thời
              package_id: id,
              amount: response.data.amount || 0,
              created_at: new Date().toISOString(),
            })
          );

          setTimeout(() => {
            // Tắt loading trước khi chuyển trang
            setShowPaymentLoading(false);
            // Hiển thị thông báo về thời gian hết hạn
            AntNotification.showNotification(
              "Đang chuyển đến trang thanh toán",
              "Vui lòng hoàn thành thanh toán trong thời gian cho phép. Không đóng trình duyệt trong quá trình thanh toán.",
              "info"
            );
            window.location.href = response.payment_url;
          }, 2000);
        } else {
          setShowPaymentLoading(false);
          message.error(
            response.data?.message ||
              "Không thể tạo thanh toán. Vui lòng thử lại sau."
          );
        }
      })
      .catch((error) => {
        setShowPaymentLoading(false);

        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
            AntNotification.showNotification(
              "Không thể mua gói",
              data?.message || "Có lỗi xảy ra khi tạo thanh toán.",
              "warning"
            );
          } else if (status === 422) {
            // Validation errors
            const errorMessage =
              data?.message || "Có lỗi xảy ra khi tạo thanh toán.";
            AntNotification.showNotification("Chú ý", errorMessage, "warning");
          } else if (status === 429) {
            AntNotification.showNotification(
              "Quá nhiều yêu cầu",
              "Vui lòng thử lại sau ít phút.",
              "error"
            );
          } else if (status === 500) {
            AntNotification.showNotification(
              "Lỗi server",
              "Server đang gặp sự cố. Vui lòng thử lại sau.",
              "error"
            );
          } else {
            AntNotification.showNotification(
              "Không thể mua gói",
              data?.message ||
                "Đã xảy ra lỗi khi tạo thanh toán. Vui lòng thử lại sau.",
              "warning"
            );
          }
        } else if (error.request) {
          AntNotification.showNotification(
            "Lỗi kết nối",
            "Không thể kết nối đến server. Vui lòng kiểm tra internet.",
            "error"
          );
        } else {
          AntNotification.showNotification(
            "Lỗi không xác định",
            error.message || "Đã xảy ra lỗi không xác định.",
            "error"
          );
        }
      });
  };

  return (
    <div className="bg-gradient-to-br w-full">
      <SuccessModal
        isOpen={isOpenModalPayment}
        onClose={() => setIsOpenModalPayment(false)}
        message="Cảm ơn bạn đã thanh toán! Gói hội viên đã được kích hoạt."
      />
      {/* Payment Loading Overlay */}
      {showPaymentLoading && <PaymentLoading />}

      <div className="lg:h-[259px] h-[200px] w-full bg-member-package-plan relative lg:text-left text-center">
        <div className="absolute inset-0 bg-dark-overlay z-1 h-[calc(100%+1px)]"></div>
        <div className="absolute bottom-0 left-0 z-[5] px-4 lg:px-12 w-full lg:py-10 py-6">
          <p className="font-bold text-4xl-50-55 text-white-50 text-2xl">
            {" "}
            Gói hội viên{" "}
          </p>
          <p className="mt-4 font-medium lg:text-[19px] text-white-50 text-sm">
            Nghe và đọc hơn 20,000 nội dung thuộc Kho sách Hội viên (Không bao
            gồm kho sách Hiệu Sồi, sách mua lẻ)
          </p>
        </div>
      </div>
      <div className="mx-auto px-4 lg:px-12 w-full lg:py-6 py-4 bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 min-h-screen">
        <div className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
            Thanh toán qua VNPay
          </h2>
          <p className="text-gray-300 text-sm md:text-base">
            Sử dụng tài khoản ngân hàng, ví điện tử hoặc thẻ thanh toán quốc tế
            (Visa, Master) thông qua VNPay
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {packages.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-gray-800 rounded-2xl p-6 md:p-8 border-2 transition-all duration-300 ${
                plan.is_best_offer
                  ? "border-green-400 shadow-xl shadow-green-400/20"
                  : "border-gray-700 hover:border-green-400"
              }`}
            >
              {/* Discount Badge */}
              <div
                className={`absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full`}
              >
                {plan.highlight_label}
              </div>

              {/* Plan Name */}
              <div className="text-center mb-6 mt-4">
                <h3 className="text-green-400 text-lg md:text-xl font-bold mb-4">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {new Intl.NumberFormat("vi-VN", {
                      currency: "VND",
                    }).format(plan.discounted_price)}
                    <span className="text-yellow-400">Đ</span>
                  </div>
                  <div className="text-gray-400 line-through text-sm">
                    {new Intl.NumberFormat("vi-VN", {
                      currency: "VND",
                    }).format(plan.original_price)}
                    đ
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => HandlePackage(plan.id)}
                  disabled={plan.is_purchased || showPaymentLoading}
                  className={`w-full font-bold py-3 px-6 rounded-xl transition-colors duration-300 text-sm md:text-base ${
                    plan.is_purchased
                      ? "bg-gray-600 cursor-not-allowed text-green-400"
                      : showPaymentLoading
                      ? "bg-gray-600 cursor-not-allowed text-gray-400"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {plan.is_purchased
                    ? "ĐÃ MUA GÓI"
                    : showPaymentLoading
                    ? "ĐANG XỬ LÝ..."
                    : "MUA GÓI VIA VNPAY"}
                </button>
              </div>

              {plan.is_best_offer === 1 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  HOT
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-8 md:mt-12 text-center">
          <p className="text-gray-400 text-xs md:text-sm mb-2">
            * Giá đã bao gồm VAT. Thanh toán an toàn qua VNPay - Bảo mật SSL
            256-bit
          </p>
          <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4 mt-4">
            <p className="text-yellow-400 text-xs md:text-sm font-medium mb-2">
              ⚠️ Lưu ý quan trọng về thời gian thanh toán:
            </p>
            <ul className="text-yellow-300 text-xs md:text-sm space-y-1 text-left">
              <li>
                • Bạn có <strong>60 phút</strong> để hoàn thành thanh toán sau
                khi nhấn "MUA GÓI"
              </li>
              <li>
                • Không đóng trình duyệt hoặc tab thanh toán trong quá trình
                giao dịch
              </li>
              <li>• Nếu quá thời gian, vui lòng thực hiện lại từ đầu</li>
              <li>• Giao dịch được bảo mật 100% qua VNPay</li>
            </ul>
          </div>
        </div>
      </div>
      <Loading isLoading={loading} />
    </div>
  );
};

export default PackagePlan;
