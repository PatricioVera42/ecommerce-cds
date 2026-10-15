import { Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProductPage } from "./pages/ProductPage";
import { AdminProductsPage } from "./pages/AdminProductsPage";
import { RequireAdmin } from "./components/RequireAdmin";
import { ProductFormPage } from "./pages/ProductFormPage";
import { CartPage } from "./pages/CartPage";
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "./components/RequireAuth";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { CheckoutCancelPage } from "./pages/CheckoutCancelPage";
import { OrdersPage } from "./pages/OrdersPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function App(){
  return (
    <>
    <Toaster />
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/productos/:id" element={<ProductPage />} />
        <Route element={ <RequireAuth /> }> 
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/checkout/exito" element={<CheckoutSuccessPage/>} />
          <Route path="/checkout/cancelado" element={<CheckoutCancelPage />} />
          <Route path="/ordenes" element={<OrdersPage/>} />
          <Route path="/ordenes/:id" element={<OrderDetailPage/>} />
        </Route>
        <Route element={<RequireAdmin/>}>
          <Route path="/admin/productos" element={ <AdminProductsPage/> }/>
          <Route path="/admin/productos/nuevo" element={ <ProductFormPage/> }/>
          <Route path="/admin/productos/:id" element={ <ProductFormPage/> }/>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
    </>
  );
}

