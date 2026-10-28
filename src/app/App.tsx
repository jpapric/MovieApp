import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../features/auth/AuthProvider";
import { App as AntdApp } from "antd";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../features/auth/components/LoginPage";
import Header from "../components/Header";
import PageNotFound from "../components/PageNoutFound";
// @ts-ignore CSS side-effect imports are handled by the bundler.
import "../css/index.css";
import MoviesDetails from "../features/movies/components/MovieDetails";
import UserProfile from "../features/profile/UserProfile";
import SeriesDetails from "../features/series/components/SeriesDetails";
import CatalogPage from "../features/catalog/CatalogPage";

function App() {
  return (
    <>
      <AuthProvider>
        <AntdApp>
          <BrowserRouter>
            <StrictMode>
              <Header />
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/movies/:movieId" element={<MoviesDetails />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/tv/:tvDetailsId" element={<SeriesDetails />} />
                  <Route path="/catalog" element={<CatalogPage />} />
                </Route>
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </StrictMode>
          </BrowserRouter>
        </AntdApp>
      </AuthProvider>
    </>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('There is no element with id="root"');
}

createRoot(rootElement).render(<App />);
