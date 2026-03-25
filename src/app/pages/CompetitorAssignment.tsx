import { useEffect, useMemo, useState } from "react";
import { Search, MoveRight, Trash2 } from "lucide-react";
import { apiGet, apiSend } from "../api";

type Competitor = {
  id: number;
  supplier: string;
  priceDate: string;
  name: string; // например: "Персентиль 10"
  coefficient?: number;
};

type AssignedResponse = {
  format: string;
  assigned: Competitor[];
  assignedIds: number[];
};

export function CompetitorAssignment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [assigned, setAssigned] = useState<Competitor[]>([]);
  const [availableCompetitors, setAvailableCompetitors] = useState<Competitor[]>([
    { id: 1, supplier: "Эмити", priceDate: "21.03.2026", name: "Персентиль 10", coefficient: 1.0 },
    { id: 2, supplier: "Эмити", priceDate: "21.03.2026", name: "Персентиль 20", coefficient: 1.0 },
  ]);
  const [selectedFormat, setSelectedFormat] = useState("ГПЛ_02_001");

  const handleAdd = (competitor: Competitor) => {
    if (!assigned.find((a) => a.id === competitor.id)) {
      setAssigned([...assigned, competitor]);
    }
  };

  const handleRemove = (id: number) => {
    setAssigned(assigned.filter((a) => a.id !== id));
  };

  const filteredAvailable = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return availableCompetitors;
    return availableCompetitors.filter(
      (comp) =>
        comp.name.toLowerCase().includes(q) || comp.supplier.toLowerCase().includes(q)
    );
  }, [availableCompetitors, searchQuery]);

  useEffect(() => {
    let cancelled = false;
    apiGet<Competitor[]>("/api/competitors")
      .then((res) => {
        if (!cancelled) setAvailableCompetitors(res);
      })
      .catch(() => {
        // оставляем локальные значения
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    apiGet<AssignedResponse>(`/api/price-formats/${encodeURIComponent(selectedFormat)}/competitors`)
      .then((res) => {
        if (!cancelled) setAssigned(res.assigned);
      })
      .catch(() => {
        // оставляем текущие
      });
    return () => {
      cancelled = true;
    };
  }, [selectedFormat]);

  const save = async () => {
    await apiSend(
      `/api/price-formats/${encodeURIComponent(selectedFormat)}/competitors`,
      "POST",
      { assignedIds: assigned.map((x) => x.id) }
    );
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl mb-4">Назначение прайс-листов конкурентов</h2>

        {/* Format Selector */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <label className="text-sm text-gray-600 mb-2 block">Ценовой формат</label>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white w-80"
          >
            <option value="ГПЛ_02_001">ГПЛ_02_001 (Астана)</option>
            <option value="ИПЛ_01_002">ИПЛ_01_002 (Алматы)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Available Competitors */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg mb-3">Доступные прайс-листы конкурентов</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white"
              />
            </div>
          </div>
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Название</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Поставщик</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Дата</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Тип</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAvailable.map((comp) => (
                  <tr
                    key={comp.id}
                    onDoubleClick={() => handleAdd(comp)}
                    className={`hover:bg-blue-50 cursor-pointer transition-colors ${
                      assigned.find((a) => a.id === comp.id) ? "opacity-40" : ""
                    }`}
                    title="Двойной клик для добавления"
                  >
                    <td className="px-6 py-3 text-sm">{comp.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{comp.supplier}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{comp.priceDate}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {comp.coefficient !== undefined ? `${comp.coefficient.toFixed(4)} × ${comp.name}` : comp.name}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
            Показано: {filteredAvailable.length} из {availableCompetitors.length}
          </div>
        </div>

        {/* Assigned Competitors */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg">Выбранные для {selectedFormat}</h3>
          </div>
          <div className="overflow-auto max-h-[600px]">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Название</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Поставщик</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Дата</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Тип</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assigned.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <MoveRight className="w-8 h-8" />
                        <p>Выберите конкурентов из левого списка</p>
                        <p className="text-sm">Двойной клик для добавления</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  assigned.map((comp) => (
                    <tr key={comp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm">{comp.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{comp.supplier}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{comp.priceDate}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          {comp.coefficient !== undefined ? `${comp.coefficient.toFixed(4)} × ${comp.name}` : comp.name}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleRemove(comp.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Выбрано: {assigned.length}</span>
              <button
                onClick={() => void save()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Сохранить назначение
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm text-blue-900 mb-2">Инструкция:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Используйте двойной клик на прайс-листе конкурента для добавления</li>
          <li>Персентиль — расчет цены на основе процентиля распределения цен</li>
          <li>Прямой — использование прямой цены конкурента</li>
          <li>Назначенные конкуренты будут использоваться для расчета МЦК (минимальная цена конкурента)</li>
        </ul>
      </div>
    </div>
  );
}
