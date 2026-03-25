import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { apiGet, apiSend } from "../api";

const markupRanges = [
  { id: 1, lowerBound: 0, upperBound: 100, markup: 30 },
  { id: 2, lowerBound: 100, upperBound: 500, markup: 25 },
  { id: 3, lowerBound: 500, upperBound: 1000, markup: 20 },
  { id: 4, lowerBound: 1000, upperBound: 5000, markup: 15 },
  { id: 5, lowerBound: 5000, upperBound: 999999, markup: 10 },
];

export function PricingSettings() {
  const [selectedFormat, setSelectedFormat] = useState("ИПЛ_01_001");
  const [pricingRule, setPricingRule] = useState("markup-percentile");
  const [deflection, setDeflection] = useState(5);
  const [minMarkup, setMinMarkup] = useState(10);
  const [maxPrice, setMaxPrice] = useState(0);
  const [includeVAT, setIncludeVAT] = useState(true);
  const [useMinCompetitor, setUseMinCompetitor] = useState(true);
  const [considerStock, setConsiderStock] = useState(false);
  const [ranges, setRanges] = useState(markupRanges);

  type SettingsResponse = {
    name: string;
    branch: string;
    pricingRule: string;
    deflectionPercent?: number;
    includeVAT?: boolean;
    useMinCompetitor?: boolean;
    considerStock?: boolean;
    recommendedMarkups?: {
      id: number;
      lowerBound: number;
      upperBound: number;
      markupPercent: number;
    }[];
  };

  useEffect(() => {
    let cancelled = false;
    apiGet<SettingsResponse>(`/api/price-formats/${encodeURIComponent(selectedFormat)}/settings`)
      .then((res) => {
        if (cancelled || !res) return;
        setPricingRule(res.pricingRule ?? pricingRule);
        if (typeof res.deflectionPercent === "number") setDeflection(res.deflectionPercent);
        if (typeof res.includeVAT === "boolean") setIncludeVAT(res.includeVAT);
        if (typeof res.useMinCompetitor === "boolean") setUseMinCompetitor(res.useMinCompetitor);
        if (typeof res.considerStock === "boolean") setConsiderStock(res.considerStock);

        if (Array.isArray(res.recommendedMarkups) && res.recommendedMarkups.length > 0) {
          setRanges(
            res.recommendedMarkups.map((r) => ({
              id: r.id,
              lowerBound: r.lowerBound,
              upperBound: r.upperBound,
              markup: r.markupPercent,
            }))
          );
        }
      })
      .catch(() => {
        // оставляем локальные значения
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFormat]);

  const addRange = () => {
    const newId = Math.max(...ranges.map((r) => r.id)) + 1;
    setRanges([...ranges, { id: newId, lowerBound: 0, upperBound: 0, markup: 0 }]);
  };

  const removeRange = (id: number) => {
    setRanges(ranges.filter((r) => r.id !== id));
  };

  const updateRange = (id: number, field: string, value: number) => {
    setRanges(
      ranges.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl mb-4">Настройки ценообразования</h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="col-span-2 space-y-6">
          {/* Basic Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg mb-4">Основные параметры</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Ценовой формат</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="ИПЛ_01_001">ИПЛ_01_001 (Астана)</option>
                  <option value="ИПЛ_01_002">ИПЛ_01_002 (Алматы)</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">Филиал</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                  <option>Астана</option>
                  <option>Алматы</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-600 mb-2 block">Правило ценообразования</label>
                <select
                  value={pricingRule}
                  onChange={(e) => setPricingRule(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="markup-percentile">Наценка + Персентиль МЦК</option>
                  <option value="markup-only">Только наценка</option>
                  <option value="competitor-based">На основе цен конкурентов</option>
                  <option value="fixed">Фиксированные цены</option>
                </select>
              </div>
            </div>
          </div>

          {/* Markup Ranges */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg">Диапазоны наценок</h3>
              <button
                onClick={addRange}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Добавить диапазон
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm text-gray-600">Нижняя граница (₽)</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600">Верхняя граница (₽)</th>
                    <th className="px-4 py-3 text-left text-sm text-gray-600">Наценка (%)</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ranges.map((range) => (
                    <tr key={range.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={range.lowerBound}
                          onChange={(e) =>
                            updateRange(range.id, "lowerBound", parseFloat(e.target.value))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={range.upperBound}
                          onChange={(e) =>
                            updateRange(range.id, "upperBound", parseFloat(e.target.value))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={range.markup}
                          onChange={(e) => updateRange(range.id, "markup", parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => removeRange(range.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategy Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg mb-4">Настройки стратегии</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Прогиб (%)
                  <span className="ml-1 text-gray-400" title="Допустимое отклонение от цены конкурента">ⓘ</span>
                </label>
                <input
                  type="number"
                  value={deflection}
                  onChange={(e) => setDeflection(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  step="0.1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Минимальная наценка (%)
                </label>
                <input
                  type="number"
                  value={minMarkup}
                  onChange={(e) => setMinMarkup(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  step="0.1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Максимальная цена (₽)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="0 = без ограничений"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={() =>
                void apiSend(
                  `/api/price-formats/${encodeURIComponent(selectedFormat)}/settings`,
                  "PUT",
                  {
                    name: selectedFormat,
                    branch: selectedFormat.includes("01") ? "Астана" : "Алматы",
                    pricingRule,
                    deflectionPercent: deflection,
                    includeVAT,
                    useMinCompetitor,
                    considerStock,
                    recommendedMarkups: ranges.map((r) => ({
                      id: r.id,
                      lowerBound: r.lowerBound,
                      upperBound: r.upperBound,
                      markupPercent: r.markup,
                    })),
                  }
                )
              }
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Сохранить настройки
            </button>
          </div>
        </div>

        {/* Right Side - Additional Settings & Info */}
        <div className="space-y-6">
          {/* Checkboxes */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg mb-4">Дополнительно</h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeVAT}
                  onChange={(e) => setIncludeVAT(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300"
                />
                <div>
                  <div className="text-sm">Учитывать НДС</div>
                  <div className="text-xs text-gray-600">
                    Включать НДС в расчет себестоимости
                  </div>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useMinCompetitor}
                  onChange={(e) => setUseMinCompetitor(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300"
                />
                <div>
                  <div className="text-sm">Использовать минимальную цену конкурента</div>
                  <div className="text-xs text-gray-600">
                    Ориентироваться на минимальную МЦК
                  </div>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={considerStock}
                  onChange={(e) => setConsiderStock(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300"
                />
                <div>
                  <div className="text-sm">Учитывать остатки</div>
                  <div className="text-xs text-gray-600">
                    Корректировать цены при низких остатках
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Info Panel */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-sm text-purple-900 mb-3">Зоны ценообразования</h4>
            <div className="space-y-3 text-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-purple-900">Левое плечо (ЛП)</span>
                </div>
                <p className="text-purple-800 text-xs">
                  Цена ниже конкурентов. Возможная потеря маржи.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-purple-900">Зона логичности</span>
                </div>
                <p className="text-purple-800 text-xs">
                  Оптимальные цены в рамках рыночных.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-purple-900">Правое плечо</span>
                </div>
                <p className="text-purple-800 text-xs">
                  Цена выше рынка. Риск потери продаж.
                </p>
              </div>
            </div>
          </div>

          {/* Formula Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm text-blue-900 mb-2">Формула расчета цены:</h4>
            <div className="text-xs text-blue-800 space-y-1 font-mono bg-white p-3 rounded border border-blue-200">
              <div>Цена = MAX(</div>
              <div className="ml-4">Себестоимость × (1 + Наценка%),</div>
              <div className="ml-4">МЦК × (1 - Прогиб%),</div>
              <div className="ml-4">Минимальная цена</div>
              <div>)</div>
            </div>
          </div>

          {/* History */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm mb-3">История изменений</h4>
            <div className="space-y-2 text-xs">
              <div className="pb-2 border-b border-gray-200">
                <div className="text-gray-900">Изменение наценок</div>
                <div className="text-gray-600">Иванов И.И. • 20.03.2026</div>
              </div>
              <div className="pb-2 border-b border-gray-200">
                <div className="text-gray-900">Обновление прогиба</div>
                <div className="text-gray-600">Петрова А.С. • 15.03.2026</div>
              </div>
              <div className="pb-2">
                <div className="text-gray-900">Добавление диапазона</div>
                <div className="text-gray-600">Сидоров П.В. • 10.03.2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
