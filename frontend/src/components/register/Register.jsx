import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/Loader"; // Import Loader component

function Register() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [suggestions, setSuggestions] = useState([]); // State to hold address suggestions

  // Function to validate each field
  const validate = () => {
    const newErrors = {};
    
    if (!fullName) newErrors.fullName = "Họ và tên không được để trống.";
    if (!phone) newErrors.phone = "Số điện thoại không được để trống.";
    if (!email) newErrors.email = "Email không được để trống.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email không hợp lệ.";
    
    if (!address) newErrors.address = "Địa chỉ không được để trống.";
    if (!province) newErrors.province = "Tỉnh/Thành không được để trống.";
    if (!district) newErrors.district = "Quận/Huyện không được để trống.";
    if (!ward) newErrors.ward = "Phường/Xã không được để trống.";
    
    if (!username) newErrors.username = "Tên đăng nhập không được để trống.";
    if (!password) newErrors.password = "Mật khẩu không được để trống.";
    else if (password !== rePassword) newErrors.rePassword = "Mật khẩu không khớp.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clear error for specific field when the user starts typing
  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (errors[field]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: undefined,
      }));
    }

    switch (field) {
      case "fullName":
        setFullName(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "address":
        handleAddressChange(e);
        break;
      case "province":
        setProvince(value);
        break;
      case "district":
        setDistrict(value);
        break;
      case "ward":
        setWard(value);
        break;
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "rePassword":
        setRePassword(value);
        break;
      default:
        break;
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);

    if (value) {
        fetchAddressDetails(value.toLowerCase()); // Normalize input to lowercase for consistency
    } else {
        setSuggestions([]); // Clear suggestions if address is empty
    }
};

let debounceTimer;

const fetchAddressDetails = async (address) => {
  clearTimeout(debounceTimer); // Clear the previous timer if a new address is typed

  debounceTimer = setTimeout(async () => {
      try {
          const encodedAddress = encodeURIComponent(address);
          const response = await fetch(`https://rsapi.goong.io/Geocode?api_key=85ULWPd6cLGhmsrM661hLSaG53zd1zfxdfp8Xiu3&address=${encodedAddress}`);

          if (!response.ok) {
              throw new Error(`API Error: ${response.statusText}`);
          }

          const data = await response.json();
          console.log("API Response:", data);

          if (data && data.results && Array.isArray(data.results) && data.results.length > 0) {
              const location = data.results[0].address_components;
              console.log("Address Components:", location);
              
              let ward = "Unknown Ward";
                let district = "Unknown District";
                let province = "Unknown Province";

                if (location.length === 4) {
                    // Full address with ward, district, and province
                    ward = location[1].long_name;     // "Phú Mỹ"
                    district = location[2].long_name; // "Phú Tân"
                    province = location[3].long_name; // "An Giang"
                } else if (location.length === 3) {
                    // Only district and province, no ward
                    district = location[1].long_name; // "Phú Tân"
                    province = location[2].long_name; // "An Giang"
                }

                setProvince(province);
                setDistrict(district);
                setWard(ward);


              setSuggestions(data.results);
          } else {
              setSuggestions([]);
          }
      } catch (error) {
          setSuggestions([]);
          toast.error(`Không thể lấy thông tin địa chỉ: ${error.message}`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
          });
      }
  }, 500); // Delay of 500ms before sending request
};






  const handleSelectSuggestion = (suggestion) => {
    setAddress(suggestion.formatted_address); // Use formatted address for the field
    setSuggestions([]); // Clear suggestions after selection
    // Optionally, set province, district, ward based on the selected suggestion
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setIsLoading(true); // Start loading
  
    if (validate()) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            phone,
            email,
            address,
            province,
            district,
            ward,
            username,
            password,
          }),
        });
  
        const data = await response.json();
  
        setIsLoading(false); // Stop loading
  
        if (response.ok) {
          toast.success(data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
  
          // Clear the form fields after successful registration
          setFullName("");
          setPhone("");
          setEmail("");
          setAddress("");
          setProvince("");
          setDistrict("");
          setWard("");
          setUsername("");
          setPassword("");
          setRePassword("");
  
        } else {
          toast.error(data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (error) {
        setIsLoading(false); // Stop loading
        toast.error("Có lỗi xảy ra, vui lòng thử lại.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      setIsLoading(false); // Stop loading if validation fails
    }
  };
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {isLoading && <Loader text="Hệ thống đang xử lý..." />} {/* Hiển thị loader */}

      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg mt-8 mb-8">
        <h2 className="text-3xl font-bold text-center mb-6">Tạo tài khoản </h2>

        <h3 className="text-xl font-semibold text-gray-700 mb-4">Thông tin liên hệ</h3>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Họ và tên
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Nhập họ và tên"
                value={fullName}
                onChange={(e) => handleInputChange(e, "fullName")}
              />
              {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => handleInputChange(e, "phone")}
              />
              {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Địa chỉ Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Nhập địa chỉ Email"
                value={email}
                onChange={(e) => handleInputChange(e, "email")}
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Nhập địa chỉ"
              value={address}
              onChange={(e) => handleInputChange(e, "address")}
            />
            {errors.address && <p className="text-red-600 text-sm">{errors.address}</p>}

            {suggestions.length > 0 && (
              <ul className="bg-white border border-gray-300 mt-2 max-h-48 overflow-y-auto rounded-md shadow-md">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion.formatted_address}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                Tỉnh/Thành
              </label>
              <input
                type="text"
                id="province"
                name="province"
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Nhập tỉnh/thành"
                value={province}
                onChange={(e) => handleInputChange(e, "province")}
              />
              {errors.province && <p className="text-red-600 text-sm">{errors.province}</p>}
            </div>
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                Quận/Huyện
              </label>
              <input
                type="text"
                id="district"
                name="district"
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Nhập quận/huyện"
                value={district}
                onChange={(e) => handleInputChange(e, "district")}
              />
              {errors.district && <p className="text-red-600 text-sm">{errors.district}</p>}
            </div>
            <div>
              <label htmlFor="ward" className="block text-sm font-medium text-gray-700">
                Phường/Xã
              </label>
              <input
                type="text"
                id="ward"
                name="ward"
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Nhập phường/xã"
                value={ward}
                onChange={(e) => handleInputChange(e, "ward")}
              />
              {errors.ward && <p className="text-red-600 text-sm">{errors.ward}</p>}
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-700 mb-4">Tài khoản đăng nhập</h3>

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => handleInputChange(e, "username")}
            />
            {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
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
                onChange={(e) => handleInputChange(e, "password")}
              />
              {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="rePassword" className="block text-sm font-medium text-gray-700">
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                id="rePassword"
                name="rePassword"
                className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Nhập lại mật khẩu"
                value={rePassword}
                onChange={(e) => handleInputChange(e, "rePassword")}
              />
              {errors.rePassword && <p className="text-red-600 text-sm">{errors.rePassword}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-black p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            Đăng ký
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Đã có tài khoản?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Đăng nhập ở đây
            </a>
          </p>
        </div>
      </div>

       {/* Toast container */}
        
    </div>
  );
}

export default Register;