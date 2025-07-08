import React, { useState, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader"; // Import Loader component

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const clientId = "1074315812564-92s9klc0eos45ujtefj613bkualvulq0.apps.googleusercontent.com";

  useEffect(() => {
    // Load Google Identity Services API
    const loadGoogleAPI = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleLogin;
      document.body.appendChild(script);
    };

    const initializeGoogleLogin = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleSuccess,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { theme: "outline", size: "large" } // Customize button
      );
    };

    loadGoogleAPI();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is OK (status code 200-299)
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        toast.error(errorData.message || "Có lỗi xảy ra, vui lòng thử lại.");
        return;
      }

      // ... Trong phần response xử lý thành công:
      const data = await response.json();
      console.log("Login Response:", data);

      // Check if user and token exist
      if (!data.user || !data.token) {
        toast.error("Thông tin đăng nhập không hợp lệ.");
        return;
      }

      // Save only user object and token separately if cần
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // Fetch user cart
      const cartResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${data.user._id}`);

      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        localStorage.setItem("cart", JSON.stringify(cartData.items));
      } else {
        console.error("Không lấy được giỏ hàng.");
      }

      // Thông báo & chuyển trang
      toast.success("Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 2000);

    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleGoogleSuccess = (response) => {
    // Handle Google login success
    const { profileObj, tokenId } = response;
    console.log("Google login successful", profileObj);

    setIsLoading(true); // Start loading for Google login

    // Send the tokenId and profileObj to your backend for authentication
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: tokenId,
        profile: profileObj,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data));
          toast.success("Đăng nhập với Google thành công!", {
            position: "top-right",
            autoClose: 2000,
          });

          try {
            const cartResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/perfumes/cart`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: data.user.email }),
            });

            if (cartResponse.ok) {
              const cartData = await cartResponse.json();
              localStorage.setItem("cart", JSON.stringify(cartData)); // Save cart to localStorage
            } else {
              console.error("Failed to fetch cart data");
            }
          } catch (error) {
            console.error("Error fetching cart:", error);
          }
          // Navigate to home after success
          setTimeout(() => {
            navigate("/");
            window.location.reload();
          }, 2000);
        } else {
          toast.error("Đăng nhập với Google thất bại.");
        }
      })
      .catch((error) => {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false); // Stop loading after login
      });
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login error", error);
    toast.error("Đăng nhập với Google thất bại.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {isLoading && <Loader text="Hệ thống đang xử lý..." />} {/* Show loader while loading */}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập vào EvolveX</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6 text-right">
            <a href="/recovery" className="text-red-500 hover:text-red-700">
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            className={`w-full p-3 rounded-md focus:outline-none focus:ring-2 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-black"
            }`}
            disabled={isLoading} // Disable button when loading
          >
            Đăng nhập
          </button>
        </form>

        <div className="my-4 text-center">
          <span className="text-gray-500">Hoặc</span>
        </div>

        <GoogleLogin
          clientId={clientId}
          buttonText="Tiếp tục với Google"
          onSuccess={handleGoogleSuccess}
          onFailure={handleGoogleFailure}
          cookiePolicy={"single_host_origin"}
          className="w-full border-2 border-red-600 text-red-600 p-4 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 font-bold"
        />

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Đăng ký ngay!
            </a>
          </p>
        </div>
      </div>

       
    </div>
  );
}

export default Login;
