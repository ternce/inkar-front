import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Filter, ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router";
import { apiGet } from "../api";

type AnalysisResponse = {
  id: string;
  meta: {
    date: string;
    number: string;
    format: string;
    activationDate: string;
    user: string;
    status: string;
    branch: string;
  };
  distribution: { name: string; value: number; fill: string }[];
  products: {
    product: string;
    price: number;
    cost: number;
    competitorPrice: number | null;
    deviation: number | null;
    source: string;
    zone: "left" | "optimal" | "right" | "no-data";
  }[];
};

export function PriceListAnalysis() {
  const { id } = useParams();
  const [showLeftOnly, setShowLeftOnly] = useState(false);
  const [showNoCompetitor, setShowNoCompetitor] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Все");

  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    apiGet<AnalysisResponse>(`/api/price-lists/${encodeURIComponent(id)}/analysis`)
      .then((res) => {
        if (!cancelled) setAnalysis(res);
      })
      .catch(() => {
        // оставляем как есть
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const exportCsv = () => {
    if (!id) return;
    const url = `/api/price-lists/${encodeURIComponent(id)}/export.csv`;
    window.location.href = url;
  };

  const distributionData: AnalysisResponse["distribution"] = analysis?.distribution ?? [];
  const productsData: AnalysisResponse["products"] = analysis?.products ?? [];

  const filteredProducts = productsData.filter((p) => {
    if (showLeftOnly && p.zone !== "left") return false;
    if (showNoCompetitor && p.competitorPrice !== null) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link to="/price-lists" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            Назад к списку
          </Link>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Экспорт CSV"
          >
            <Download className="w-4 h-4" />
            Экспорт CSV
          </button>
        </div>

        <h2 className="text-2xl mb-2">Анализ прайс-листа {id}</h2>
        <p className="text-gray-600">
          {(analysis?.meta?.format ?? "")} • Создан: {(analysis?.meta?.date ?? "")} • Активация: {(analysis?.meta?.activationDate ?? "")}
        </p>
      </div>

      {/* Distribution Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg mb-4">Распределение товаров по зонам ценообразования</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Количество товаров" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-sm text-red-700 mb-1">Левое плечо</div>
            <div className="text-2xl text-red-600">234</div>
            <div className="text-xs text-red-600 mt-1">Ниже конкурентов</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-700 mb-1">Зона логичности</div>
            <div className="text-2xl text-green-600">1,456</div>
            <div className="text-xs text-green-600 mt-1">Оптимальные цены</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-sm text-yellow-700 mb-1">Правое плечо</div>
            <div className="text-2xl text-yellow-600">189</div>
            <div className="text-xs text-yellow-600 mt-1">Выше рынка</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <div className="flex items-center gap-4 flex-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLeftOnly}
                onChange={(e) => setShowLeftOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Только ЛП</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showNoCompetitor}
                onChange={(e) => setShowNoCompetitor(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">Только без МЦК</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Категория:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option>Все</option>
                <option>Анальгетики</option>
                <option>Жаропонижающие</option>
                <option>Сердечно-сосудистые</option>
                <option>Сорбенты</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Найдено: {filteredProducts.length} из {productsData.length}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Товар</th>
                <th className="px-6 py-3 text-right text-sm text-gray-600">Цена</th>
                <th className="px-6 py-3 text-right text-sm text-gray-600">Себестоимость</th>
                <th className="px-6 py-3 text-right text-sm text-gray-600">МЦК</th>
                <th className="px-6 py-3 text-right text-sm text-gray-600">Откл. %</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Источник цены</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-gray-50 ${
                    product.zone === "left"
                      ? "bg-red-50/30"
                      : product.zone === "right"
                      ? "bg-yellow-50/30"
                      : product.zone === "no-data"
                      ? "bg-gray-50/30"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 text-sm">{product.product}</td>
                  <td className="px-6 py-4 text-sm text-right font-mono">
                    {product.price.toFixed(2)} ₽
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-mono text-gray-600">
                    {product.cost.toFixed(2)} ₽
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-mono text-gray-600">
                    {product.competitorPrice ? `${product.competitorPrice.toFixed(2)} ₽` : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    {product.deviation !== null ? (
                      <span
                        className={`inline-flex px-2 py-1 rounded ${
                          product.deviation < 0
                            ? "bg-red-100 text-red-700"
                            : product.deviation > 5
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.deviation > 0 ? "+" : ""}
                        {product.deviation.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      {product.source}
                      {product.competitorPrice === null && (
                        <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                          нет МЦК
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
