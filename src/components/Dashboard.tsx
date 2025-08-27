import { useState, useEffect, useMemo } from "react";
import type { SelectChangeEvent } from "@mui/material";
const BASE_URL = import.meta.env.VITE_DUMMYJSON_API_BASE_URL;
import useFetch from "../hooks/useFetch";
import FiltersPanel from "./FiltersPanel";
import ChartDisplay from "./ChartDisplay";

import type { Category, Product } from "../types";

interface ProductsResponse {
  products: Product[];
}

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [chartOptions, setChartOptions] = useState<Highcharts.Options | null>(
    null
  );
  const [isReportRun, setIsReportRun] = useState<boolean>(false);

  const { data: allCategories } = useFetch<Category[]>(
    `${BASE_URL}/products/categories`
  );

  const productsUrl = selectedCategory
    ? `${BASE_URL}/products/category/${selectedCategory}`
    : null;
  const { data: productsData } = useFetch<ProductsResponse>(productsUrl);
  const productsForCategory = productsData?.products || [];

  // Memoize the initial pie chart options
  const initialPieChartOptions = useMemo((): Highcharts.Options => {
    if (!allCategories) return {};
    return {
      chart: { type: "pie" },
      title: { text: "Product Categories Overview" },
      tooltip: { pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>" },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: { enabled: true, format: "<b>{point.name}</b>" },
        },
      },
      series: [
        {
          name: "Categories",
          type: "pie",
          data: allCategories.map((cat) => ({ name: cat.name, y: 1 })),
        },
      ],
    };
  }, [allCategories]);

  useEffect(() => {
    if (allCategories && !selectedCategory) {
      setChartOptions(initialPieChartOptions);
    }
  }, [allCategories, initialPieChartOptions, selectedCategory]);

  useEffect(() => {
    setSelectedProducts([]);
  }, [selectedCategory]);

  useEffect(() => {
    setIsReportRun(false);
  }, [selectedCategory, selectedProducts]);

  const handleClear = () => {
    setSelectedCategory(null);
    setSelectedProducts([]);
    setChartOptions(initialPieChartOptions);
    setIsReportRun(false);
  };

  const handleRunReport = () => {
    setIsLoadingReport(true);
    setChartOptions(null);

    setTimeout(() => {
      const productsToShow =
        selectedProducts.length > 0 ? selectedProducts : productsForCategory;

      const barChartOptions: Highcharts.Options = {
        chart: { type: "column" },
        title: { text: `Product Prices in ${selectedCategory}` },
        xAxis: {
          categories: productsToShow.map((p) => p.title),
          title: { text: "Products" },
        },
        yAxis: { min: 0, title: { text: "Price (USD)" } },
        series: [
          {
            name: "Price",
            type: "column",
            data: productsToShow.map((p) => p.price),
          },
        ],
        tooltip: { pointFormat: "Price: <b>${point.y:.2f}</b>" },
      };

      setChartOptions(barChartOptions);
      setIsLoadingReport(false);
      setIsReportRun(true);
    }, 3000);
  };

  const isReportButtonDisabled =
    !selectedCategory || isLoadingReport || isReportRun;

  return (
    <div className="h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="max-w-screen-xl mx-auto w-full flex flex-col flex-grow">
        <header className="bg-white shadow rounded-lg mb-6 flex-shrink-0">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Products Dashboard
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
          <div className="lg:col-span-3">
            <FiltersPanel
              allCategories={allCategories || []}
              productsForCategory={productsForCategory}
              selectedCategory={selectedCategory}
              selectedProducts={selectedProducts}
              onCategoryChange={(e: SelectChangeEvent<string>) =>
                setSelectedCategory(e.target.value)
              }
              onProductsChange={(_, newValue) => setSelectedProducts(newValue)}
              onRunReport={handleRunReport}
              onClear={handleClear}
              isReportButtonDisabled={isReportButtonDisabled}
              isLoadingReport={isLoadingReport}
            />
          </div>
          <div className="lg:col-span-9">
            <ChartDisplay
              chartOptions={chartOptions}
              isLoading={isLoadingReport}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
