import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import newRequest from "../utils/newRequest";
import toast, { Toaster } from "react-hot-toast";

const Checkout = () => {
  const { id } = useParams(); // gig id
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [gig, setGig] = useState(null);

  // Fetch gig details to display order summary
  useEffect(() => {
    const fetchGig = async () => {
        try {
            const res = await newRequest.get(`/gigs/single/${id}`);
            setGig(res.data);
        } catch (err) {
            console.error("Failed to fetch gig details:", err);
            toast.error("Could not load gig details.");
        }
    };
    fetchGig();
  }, [id]);

  // Create payment intent
  useEffect(() => {
    const createIntent = async () => {
      try {
        const res = await newRequest.post(`/orders/create-payment-intent/${id}`);
        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error("Failed to create payment intent:", err.response?.data || err.message);
        toast.error("Could not initialize payment.");
      }
    };
    if (id) {
        createIntent();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    setError(null);

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      try {
        await newRequest.put("/orders/confirm", {
          payment_intent: paymentIntent.id,
        });
        toast.success("Payment successful! Redirecting to your orders...");
        setTimeout(() => navigate("/orders"), 2000);
      } catch (err) {
        console.error("Failed to confirm order:", err.message);
        toast.error("Payment was successful, but we couldn't confirm your order. Please contact support.");
        setProcessing(false);
      }
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Toaster position="top-center" />
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center">Complete Your Payment</h1>

            {/* Order Summary */}
            {gig && (
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Order Summary</h2>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">{gig.title}</span>
                        <span className="font-bold text-gray-900">₹{gig.price.toLocaleString()}</span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="p-4 border rounded-lg bg-gray-50">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
                    <CardElement options={cardElementOptions} />
                </div>

                {error && <div className="text-red-600 text-sm mt-2 text-center">{error}</div>}

                <button
                    type="submit"
                    disabled={!stripe || processing || !clientSecret}
                    className="w-full mt-6 bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {processing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        `Pay Now (₹${gig?.price?.toLocaleString() || '...'})`
                    )}
                </button>
            </form>
        </div>
    </div>
  );
};

export default Checkout;
