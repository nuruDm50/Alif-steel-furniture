

import { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <>
      <Helmet>
        <title>
          Alif Steel Furniture | Premium Steel Furniture
          in Bangladesh
        </title>

        <meta
          name="description"
          content="Buy premium quality steel furniture in Bangladesh from Alif Steel Furniture. Explore modern steel almirah, wardrobe, cabinet, locker, showcase, and office furniture with professional showroom-style experience."
        />

        <meta
          name="keywords"
          content="steel furniture Bangladesh, steel almirah, wardrobe, cabinet, locker, office furniture, Alif Steel Furniture"
        />

        <meta
          property="og:title"
          content="Alif Steel Furniture"
        />

        <meta
          property="og:description"
          content="Modern premium steel furniture e-commerce platform in Bangladesh."
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-white">
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white" />
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={<HomePage />}
            />

            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Routes>
        </Suspense>
      </div>
    </>
  );
};

export default App;