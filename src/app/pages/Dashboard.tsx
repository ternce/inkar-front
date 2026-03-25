import { Link } from "react-router";
import { Plus, RefreshCw, Download } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { apiGet } from "../api";
import { toast } from "sonner";

type DashboardResponse = {
  priceFormats: { name: string; code: string; branch: string }[];
  recentPriceLists: { date: string; number: string; format: string; status: string }[];
  assignments: { format: string; competitors: number; lastUpdate: string }[];
  activeLists: { name: string; type: string; items: number }[];
  contractors: { name: string; format: string; priceList: string }[];
};

export function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [dashboard, setDashboard] = useState<DashboardResponse>({
    priceFormats: [
      { name: "ГПЛ_02_001", code: "ГПЛ_02_001", branch: "Астана" },
      { name: "ИПЛ_01_002", code: "ИПЛ_01_002", branch: "Алматы" },
    ],
    recentPriceLists: [
      { date: "21.03.2026 11:00", number: "ГПЛ_02_001", format: "ГПЛ_02_001", status: "Активен" },
      { date: "21.03.2026 11:01", number: "ИПЛ_01_002", format: "ИПЛ_01_002", status: "Активен" },
    ],
    assignments: [
      { format: "ГПЛ_02_001", competitors: 2, lastUpdate: "21.03.2026" },
      { format: "ИПЛ_01_002", competitors: 1, lastUpdate: "21.03.2026" },
    ],
    activeLists: [
      { name: "Прямые контракты", type: "Фикс цена", items: 0 },
      { name: "Ограничения сверху", type: "Макс наценка", items: 0 },
      { name: "Минимальные цены", type: "Фикс цены", items: 0 },
    ],
    contractors: [
      { name: "ТОО Аптека 1", format: "ГПЛ_02_001", priceList: "ГПЛ_02_001" },
      { name: "ТОО Аптека 2", format: "ГПЛ_02_001", priceList: "ГПЛ_02_001" },
      { name: "ТОО Аптека 3", format: "ГПЛ_02_001", priceList: "ГПЛ_02_001" },
    ],
  });

  useEffect(() => {
    let cancelled = false;
    apiGet<DashboardResponse>("/api/dashboard")
      .then((res) => {
        if (!cancelled) setDashboard(res);
      })
      .catch(() => {
        // Оставляем локальные значения, если бек недоступен
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const priceFormats = dashboard.priceFormats;
  const [selectedFormat, setSelectedFormat] = useState<string>(priceFormats[0]?.code ?? "");

  useEffect(() => {
    if (!selectedFormat && priceFormats.length > 0) {
      setSelectedFormat(priceFormats[0].code);
    }
  }, [priceFormats, selectedFormat]);

  const selectedFormatLabel = useMemo(() => {
    const pf = priceFormats.find((x) => x.code === selectedFormat);
    return pf ? `${pf.code} (${pf.branch})` : selectedFormat;
  }, [priceFormats, selectedFormat]);

  async function uploadExcel(file: File) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload-excel", { method: "POST", body: form });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Upload failed (${res.status})`);
    }
    return (await res.json()) as {
      price_formats: number;
      markup_ranges: number;
      products: number;
      universal_lists: number;
      list_items: number;
      competitor_sources: number;
      competitor_prices: number;
    };
  }

  async function calculatePrices(priceListNumber?: string) {
    const res = await fetch("/api/calculate-prices", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        price_format_code: selectedFormat,
        price_list_number: priceListNumber ?? null,
        activation_date: null,
        user: "",
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Calculate failed (${res.status})`);
    }
    return (await res.json()) as { price_list_number: string; calculated_count: number };
  }

  const onCreatePriceList = async () => {
    if (!selectedFormat) return;
    try {
      const out = await calculatePrices();
      toast.success("Прайс-лист сформирован", {
        description: `${out.price_list_number} • позиций: ${out.calculated_count}`,
      });
      navigate(`/price-list-analysis/${encodeURIComponent(out.price_list_number)}`);
    } catch (e) {
      toast.error("Ошибка формирования прайс-листа", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const onRefreshPrices = async () => {
    if (!selectedFormat) return;
    try {
      const listRes = await apiGet<
        { date: string; number: string; format: string; status: string }[]
      >(`/api/price-lists?format_code=${encodeURIComponent(selectedFormat)}`);
      const last = listRes?.[0];
      const out = await calculatePrices(last?.number);
      toast.success("Пересчет выполнен", {
        description: `${out.price_list_number} • позиций: ${out.calculated_count}`,
      });
    } catch (e) {
      toast.error("Ошибка пересчета", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const onImportExcel = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (ev: ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file) return;
    try {
      const out = await uploadExcel(file);
      toast.success("Импорт завершен", {
        description: `products=${out.products}, price_formats=${out.price_formats}, markup_ranges=${out.markup_ranges}, universal_lists=${out.universal_lists}, list_items=${out.list_items}, competitor_sources=${out.competitor_sources}, competitor_prices=${out.competitor_prices}`,
      });
    } catch (e) {
      toast.error("Ошибка импорта", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const recentPriceLists = dashboard.recentPriceLists;
  const assignments = dashboard.assignments;
  const activeLists = dashboard.activeLists;
  const contractors = dashboard.contractors;

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={onFileChange}
      />

      <div className="mb-6">
        <h2 className="text-2xl mb-4">Панель управления</h2>
        
        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => void onCreatePriceList()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title={selectedFormat ? `ЦФ: ${selectedFormatLabel}` : ""}
          >
            <Plus className="w-4 h-4" />
            Создать ПЛ
          </button>
          <button
            onClick={() => void onRefreshPrices()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title={selectedFormat ? `ЦФ: ${selectedFormatLabel}` : ""}
          >
            <RefreshCw className="w-4 h-4" />
            Обновить цены
          </button>
          <button
            onClick={onImportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Импорт из SAP
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Section - Price Formats */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg">Ценовые форматы</h3>
            </div>
            <div className="overflow-auto max-h-[600px]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">Наименование</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">Код</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-600">Филиал</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {priceFormats.map((format, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedFormat === format.code ? "bg-blue-50/50" : ""
                      }`}
                      onClick={() => setSelectedFormat(format.code)}
                      title="Выберите ЦФ для действий сверху"
                    >
                      <td className="px-6 py-4 text-sm">{format.name}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{format.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{format.branch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Section - Multiple Panels */}
        <div className="space-y-6">
          {/* Recent Price Lists */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h4 className="text-sm">Сформированные ПЛ</h4>
            </div>
            <div className="p-4 space-y-3">
              {recentPriceLists.map((pl, idx) => (
                <Link 
                  key={idx} 
                  to={`/price-list-analysis/${pl.number}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-mono">{pl.number}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      pl.status === "Активен" 
                        ? "bg-green-100 text-green-700" 
                        : pl.status === "Черновик"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {pl.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">{pl.format}</div>
                  <div className="text-xs text-gray-500 mt-1">{pl.date}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Competitor Assignments */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h4 className="text-sm">Назначение ПЛК</h4>
            </div>
            <div className="p-4 space-y-3">
              {assignments.map((asg, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-mono mb-1">{asg.format}</div>
                  <div className="text-xs text-gray-600">Конкурентов: {asg.competitors}</div>
                  <div className="text-xs text-gray-500 mt-1">{asg.lastUpdate}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Lists */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h4 className="text-sm">Активные списки</h4>
            </div>
            <div className="p-4 space-y-3">
              {activeLists.map((list, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm mb-1">{list.name}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">{list.type}</span>
                    <span className="text-xs text-blue-600">{list.items} шт</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contractors */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h4 className="text-sm">Контрагенты</h4>
            </div>
            <div className="p-4 space-y-3">
              {contractors.map((contractor, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm mb-1">{contractor.name}</div>
                  <div className="text-xs text-gray-600">{contractor.format}</div>
                  <div className="text-xs text-gray-500 mt-1">{contractor.priceList}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
