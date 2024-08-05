import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import { AuthContext } from "../Auth/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginWithOtp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (email && password) {
      try {
        const response = await fetch(`${BASE_URL}/otpsent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
          setIsOtpSent(true);
          toast.success("OTP sent successfully");
        } else {
          const data = await response.json();
          setError(data.message || "Failed to send OTP");
          toast.error(data.message || "Failed to send OTP");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
        toast.error("An error occurred. Please try again.");
      }
      setIsSubmitting(false);
    } else {
      setError("Please enter both email and password");
      toast.error("Please enter both email and password");
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (otp) {
      try {
        const response = await fetch(`${BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, otp }),
        });
        if (response.ok) {
          const data = await response.json();
          const token = data.token;
          localStorage.setItem("token", data.token); // Save token to local storage or state
          dispatch({ type: "LOGIN_SUCCESS", payload: { token } });
          toast.success("Login successful");
          navigate("/user/dashboard"); // Redirect to a secure page
        } else {
          const data = await response.json();
          setError(data.message || "Failed to verify OTP");
          toast.error(data.message || "Failed to verify OTP");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
        toast.error("An error occurred. Please try again.");
      }
      setIsSubmitting(false);
    } else {
      setError("Please enter OTP");
      toast.error("Please enter OTP");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isOtpSent ? "Verify OTP" : "Login"}
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {!isOtpSent ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginWithOtp;
