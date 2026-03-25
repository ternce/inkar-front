import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Filter, Eye, RefreshCw } from "lucide-react";
import { apiGet } from "../api";
import { toast } from "sonner";

type PriceListRow = {
  date: string;
  number: string;
  format: string;
  activationDate: string;
  user: string;
  status: string;
  branch?: string;
};

export function PriceLists() {
  const [selectedBranch, setSelectedBranch] = useState("Все");
  const [selectedStatus, setSelectedStatus] = useState("Все");
  const [priceLists, setPriceLists] = useState<PriceListRow[]>([
    {
      date: "21.03.2026 11:00",
      number: "ГПЛ_02_001",
      format: "ГПЛ_02_001",
      activationDate: "22.03.2026",
      user: "ФИО",
      status: "Активен",
      branch: "Астана",
    },
    {
      date: "21.03.2026 11:01",
      number: "ИПЛ_01_002",
      format: "ИПЛ_01_002",
      activationDate: "22.03.2026",
      user: "ФИО",
      status: "Активен",
      branch: "Алматы",
    },
  ]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedBranch && selectedBranch !== "Все") params.set("branch", selectedBranch);
    if (selectedStatus && selectedStatus !== "Все") params.set("status", selectedStatus);
    const qs = params.toString();

    let cancelled = false;
    apiGet<PriceListRow[]>(`/api/price-lists${qs ? `?${qs}` : ""}`)
      .then((res) => {
        if (!cancelled) setPriceLists(res);
      })
      .catch(() => {
        // оставляем локальные значения
      });
    return () => {
      cancelled = true;
    };
  }, [selectedBranch, selectedStatus]);

  const recalc = async (row: PriceListRow) => {
    try {
      const res = await fetch("/api/calculate-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          price_format_code: row.format,
          price_list_number: row.number,
          activation_date: null,
          user: "",
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Calculate failed (${res.status})`);
      }

      const out = (await res.json()) as { price_list_number: string; calculated_count: number };
      toast.success("Пересчет выполнен", {
        description: `${out.price_list_number} • позиций: ${out.calculated_count}`,
      });

      // refresh list in background
      const params = new URLSearchParams();
      if (selectedBranch && selectedBranch !== "Все") params.set("branch", selectedBranch);
      if (selectedStatus && selectedStatus !== "Все") params.set("status", selectedStatus);
      const qs = params.toString();
      const refreshed = await apiGet<PriceListRow[]>(`/api/price-lists${qs ? `?${qs}` : ""}`);
      setPriceLists(refreshed);
    } catch (e) {
      toast.error("Ошибка пересчета", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl mb-4">Сформированные прайс-листы</h2>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex items-center gap-4 flex-1">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Филиал</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option>Все</option>
                  <option>Астана</option>
                  <option>Алматы</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Статус</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option>Все</option>
                  <option>Активен</option>
                  <option>Черновик</option>
                  <option>Архив</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Период</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    defaultValue="2026-03-01"
                  />
                  <input
                    type="date"
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    defaultValue="2026-03-24"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Дата</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Номер</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Ценовой формат</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Дата активации</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Пользователь</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Статус</th>
                <th className="px-6 py-3 text-left text-sm text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {priceLists.map((pl, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{pl.date}</td>
                  <td className="px-6 py-4 text-sm font-mono">{pl.number}</td>
                  <td className="px-6 py-4 text-sm">{pl.format}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pl.activationDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pl.user}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded ${
                        pl.status === "Активен"
                          ? "bg-green-100 text-green-700"
                          : pl.status === "Черновик"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {pl.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/price-list-analysis/${pl.number}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Открыть ПЛ"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => void recalc(pl)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Пересчитать"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
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
