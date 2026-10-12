import { Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProductPage } from "./pages/ProductPage";
import { AdminProductsPage } from "./pages/AdminProductsPage";
import { RequireAdmin } from "./components/RequireAdmin";
import { ProductFormPage } from "./pages/ProductFormPage";

export function App(){
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/productos/:id" element={<ProductPage />} />
        <Route element={<RequireAdmin/>}>
          <Route path="/admin/productos" element={ <AdminProductsPage/> }/>
          <Route path="/admin/productos/nuevo" element={ <ProductFormPage/> }/>
          <Route path="/admin/productos/:id" element={ <ProductFormPage/> }/>
        </Route>
      </Route>
    </Routes>
  );
}

