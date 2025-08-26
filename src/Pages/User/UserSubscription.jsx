import { useEffect, useState } from "react";
import apiRequest from "../../Services/ApiRequest";
import Button from "../../Components/Ui/Button/Button"; // ✅ Import your reusable Button

const SubscriptionPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentIframeUrl, setPaymentIframeUrl] = useState(null);
  const [buyingPlanId, setBuyingPlanId] = useState(null); // ✅ Track loading for specific plan

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiRequest("GET", "/subscriptions");
        setPlans(response?.data || []);
        console.log(response);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleBuy = async (planId) => {
    try {
      setBuyingPlanId(planId); // ✅ Show loading on clicked button
      const response = await apiRequest("POST", "/subscriptions/pay", { subscription_id: planId });

      if (response?.payment_url) {
        setPaymentIframeUrl(response.payment_url);
      } else {
        alert("Payment initialization failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong while processing the payment.");
    } finally {
      setBuyingPlanId(null); // ✅ Stop loading state
    }
  };

  if (loading) {
    return <p className="text-center text-gray-300 mt-10 text-lg">Loading subscriptions...</p>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">
        Choose Your <span className="text-indigo-400">Plan</span>
      </h1>

      {plans.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No subscription plans available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-gray-800 rounded-2xl shadow-lg border border-gray-700 hover:shadow-indigo-500/20 transition transform hover:-translate-y-2 p-6 text-center ${
                plan.popular ? "ring-2 ring-indigo-500" : ""
              }`}
            >
              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-4xl font-bold text-indigo-400 mb-6">{plan.cost} EGP</p>
              <ul className="text-gray-300 text-left space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✔</span>
                  You have Access to Posting Up to {plan.no_of_posts}
                </li>
              </ul>

              {/* ✅ Use Reusable Button */}
              <Button
                fullWidth
                variant="primary"
                size="md"
                loading={buyingPlanId === plan.id}
                onClick={() => handleBuy(plan.id)}
              >
                Buy Now
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Payment Iframe */}
      {paymentIframeUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-3xl h-[700px] relative">
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => setPaymentIframeUrl(null)}
            >
              ✕
            </Button>
            <iframe
              src={paymentIframeUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Paymob Payment"
              className="rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
