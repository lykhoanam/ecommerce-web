import React, { useState, createContext, useEffect} from "react";
import {gapi} from 'gapi-script';
import {Route, Routes, useLocation} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import CategoryDescription from "./components/product-grid/CategoryDescription";
import ProductGrid from "./components/product-grid/ProductGrid.jsx";
import Footer from "./components/Footer";
import Cart from "./components/cart/Cart";
import Login from "./components/login/Login"
import Register from "./components/register/Register.jsx"
import ProductPage from "./components/product-page/ProductPage";
import Profile from "./components/profile/ProfilePage.jsx"
import Recovery from "./components/login/VerifyOTP.jsx"
import CheckOut from "./components/cart/CheckOut.jsx"

import Admin from "./components/admin/Admin.jsx";
import Product from "./components/admin/Product.jsx"
import AdminLogin from "./components/admin/login/Login.jsx"
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx"
import Order from "./components/admin/Order.jsx";
import Account from "./components/admin/Account.jsx";

import ChatBox from './components/chatbox/ChatBox';

export const Context = createContext();

const clientId = "1074315812564-92s9klc0eos45ujtefj613bkualvulq0.apps.googleusercontent.com";

function App() {
  const [cartCounter, setCartCounter] = useState(0);
  const navigationItems = ["For Him", "Unisex", "Body Mist"];
  const location = useLocation();

  const adminRoute = "/admin";
  const shouldHideHeaderFooter = location.pathname.includes(adminRoute);

  console.log(shouldHideHeaderFooter);

  useEffect(() => {
      function start() {
          gapi.client.init({
              clientId: clientId,
              scope: "",
          });
      }

      gapi.load("client:auth2", start);
  }, []);

  return (
      <Context.Provider value={[cartCounter, setCartCounter]}>
          {/* Announcement Bar */}
          {/* <AnnouncementBar title="Free Shipping in Europe" /> */}

          {/* Header */}
          {!shouldHideHeaderFooter && <Header navigationItems={navigationItems} />}

          {/* Routes */}
          <Routes>
              <Route path="/recovery" element={<Recovery />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<CheckOut />} />
              <Route
                  path="/"
                  element={
                      <>
                          <CategoryDescription
                              title="Discover our exquisite perfume collection"
                              desc="Explore our unique, refined perfume collection, perfect for every style and personality. Find your favorite scent today"
                              carouselImages={[
                                  "https://i.ibb.co/pv023Dx/6f6d91ceb23f9b46a3183c2ca2e9ff9f.jpg",
                                  "https://i.ibb.co/yhQsgDF/6c353a303a9ab73f1cdd010b0555a59e.jpg",
                                  "https://i.ibb.co/fCTDdWd/f428a8f8fcda2f0f5247f43acf1dea16.jpg",
                                  "https://i.ibb.co/FmbwFqS/da838ba7dac254f4d8581b4b43eea99f.jpg",
                              ]}
                          />
                          <ProductGrid category="Women" />
                      </>
                  }
              />
              <Route
                  path="/forhim"
                  element={
                      <>
                          <CategoryDescription
                              title="Discover our exquisite perfume collection"
                              desc="Explore our unique, refined perfume collection, perfect for every style and personality. Find your favorite scent today"
                              carouselImages={[
                                  "https://i.ibb.co/pv023Dx/6f6d91ceb23f9b46a3183c2ca2e9ff9f.jpg",
                                  "https://i.ibb.co/yhQsgDF/6c353a303a9ab73f1cdd010b0555a59e.jpg",
                                  "https://i.ibb.co/fCTDdWd/f428a8f8fcda2f0f5247f43acf1dea16.jpg",
                                  "https://i.ibb.co/FmbwFqS/da838ba7dac254f4d8581b4b43eea99f.jpg",
                              ]}
                          />
                          <ProductGrid category="Men" />
                      </>
                  }
              />
              <Route
                  path="/unisex"
                  element={
                      <>
                          <CategoryDescription
                              title="Discover our exquisite perfume collection"
                              desc="Explore our unique, refined perfume collection, perfect for every style and personality. Find your favorite scent today"
                              carouselImages={[
                                  "https://i.ibb.co/pv023Dx/6f6d91ceb23f9b46a3183c2ca2e9ff9f.jpg",
                                  "https://i.ibb.co/yhQsgDF/6c353a303a9ab73f1cdd010b0555a59e.jpg",
                                  "https://i.ibb.co/fCTDdWd/f428a8f8fcda2f0f5247f43acf1dea16.jpg",
                                  "https://i.ibb.co/FmbwFqS/da838ba7dac254f4d8581b4b43eea99f.jpg",
                              ]}
                          />
                          <ProductGrid category="Unisex" />
                      </>
                  }
              />
              <Route
                  path="/bodymist"
                  element={
                      <>
                          <CategoryDescription
                              title="Discover our exquisite perfume collection"
                              desc="Explore our unique, refined perfume collection, perfect for every style and personality. Find your favorite scent today"
                              carouselImages={[
                                  "https://i.ibb.co/pv023Dx/6f6d91ceb23f9b46a3183c2ca2e9ff9f.jpg",
                                  "https://i.ibb.co/yhQsgDF/6c353a303a9ab73f1cdd010b0555a59e.jpg",
                                  "https://i.ibb.co/fCTDdWd/f428a8f8fcda2f0f5247f43acf1dea16.jpg",
                                  "https://i.ibb.co/FmbwFqS/da838ba7dac254f4d8581b4b43eea99f.jpg",
                              ]}
                          />
                          <ProductGrid category="Body Mist" />
                      </>
                  }
              />
              <Route path="/products/:id" element={<ProductPage />} />


              {/*  admin routes */ }
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/home" element={<ProtectedRoute element={<Admin />} />} />
              <Route path="/admin/product" element={<ProtectedRoute element={<Product />} />} />
              <Route path="/admin/order" element={<ProtectedRoute element={<Order />} />} />
              <Route path="/admin/account" element={<ProtectedRoute element={<Account />} />} />


          </Routes>

          {/* Footer */}
            {!shouldHideHeaderFooter && <Footer />}
            {!shouldHideHeaderFooter && <ChatBox />}

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            />
      </Context.Provider>
  );
}

export default App;
