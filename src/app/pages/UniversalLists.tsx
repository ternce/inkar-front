import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Upload, Plus, Edit, Trash2, FileText } from "lucide-react";
import { apiGet } from "../api";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

type UniversalListRow = {
  id: number;
  name: string;
  type: string;
  status: string;
  period: string;
  itemsCount: number;
};

type UniversalListDetails = {
  id: number;
  name: string;
  type: string;
  status: string;
  period: { start: string; end: string };
  items: { code: string; name: string; value: string }[];
  linkedPriceLists: { code: string; name: string; status: string }[];
};

export function UniversalLists() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedList, setSelectedList] = useState<number | null>(null);
  const [lists, setLists] = useState<UniversalListRow[]>([]);
  const [details, setDetails] = useState<UniversalListDetails | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<UniversalListRow | null>(null);

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
        description: `products=${out.products}, universal_lists=${out.universal_lists}, list_items=${out.list_items}, competitor_prices=${out.competitor_prices}`,
      });

      // refresh current view
      const refreshedLists = await apiGet<UniversalListRow[]>("/api/universal-lists");
      setLists(refreshedLists);
      if (selectedList !== null) {
        const refreshedDetails = await apiGet<UniversalListDetails>(`/api/universal-lists/${selectedList}`);
        setDetails(refreshedDetails);
      }
    } catch (e) {
      toast.error("Ошибка импорта", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const createList = async () => {
    try {
      const res = await fetch("/api/universal-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: "Новый список",
          type: "Фикс цена",
          status: "Черновик",
          start_date: null,
          end_date: null,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Create failed (${res.status})`);
      }

      const created = (await res.json()) as { id: number };
      toast.success("Список создан", { description: `ID: ${created.id}` });

      const refreshedLists = await apiGet<UniversalListRow[]>("/api/universal-lists");
      setLists(refreshedLists);
      setSelectedList(created.id);
    } catch (e) {
      toast.error("Не удалось создать список", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const deleteList = async (id: number) => {
    try {
      const res = await fetch(`/api/universal-lists/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Delete failed (${res.status})`);
      }

      toast.success("Список удален");

      const refreshedLists = await apiGet<UniversalListRow[]>("/api/universal-lists");
      setLists(refreshedLists);
      if (selectedList === id) {
        setSelectedList(null);
        setDetails(null);
      }
    } catch (e) {
      toast.error("Не удалось удалить список", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  };

  useEffect(() => {
    let cancelled = false;
    apiGet<UniversalListRow[]>("/api/universal-lists")
      .then((res) => {
        if (!cancelled) setLists(res);
      })
      .catch(() => {
        // оставляем пустым
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (selectedList === null) {
      setDetails(null);
      return;
    }
    let cancelled = false;
    apiGet<UniversalListDetails>(`/api/universal-lists/${selectedList}`)
      .then((res) => {
        if (!cancelled) setDetails(res);
      })
      .catch(() => {
        // оставляем как есть
      });
    return () => {
      cancelled = true;
    };
  }, [selectedList]);

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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">Универсальные списки</h2>
          <button
            onClick={() => void createList()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Создать список
          </button>
        </div>
      </div>

      {selectedList === null ? (
        /* Lists Table */
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Наименование</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Тип</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Статус</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Период действия</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Позиций</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lists.map((list) => (
                  <tr key={list.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{list.name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        {list.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded ${
                          list.status === "Активен"
                            ? "bg-green-100 text-green-700"
                            : list.status === "Черновик"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {list.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{list.period}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{list.itemsCount}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedList(list.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Открыть"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedList(list.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(list)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* List Details */
        <div>
          <button
            onClick={() => setSelectedList(null)}
            className="mb-4 text-blue-600 hover:text-blue-700"
          >
            ← Назад к списку
          </button>

          <div className="grid grid-cols-3 gap-6">
            {/* Left Side - List Items */}
            <div className="col-span-2">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg">{details?.name ?? ""}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={onImportExcel}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Импорт из Excel
                      </button>
                      <button
                        onClick={() =>
                          toast.message("Добавление вручную пока не реализовано", {
                            description: "Используйте импорт из Excel",
                          })
                        }
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Добавить вручную
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Тип: {details?.type ?? ""}</span>
                    <span>•</span>
                    <span>
                      Период: {details ? `${details.period.start} - ${details.period.end}` : ""}
                    </span>
                    <span>•</span>
                    <span>Статус: {details?.status ?? ""}</span>
                  </div>
                </div>
                <div className="overflow-auto max-h-[600px]">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">Код</th>
                        <th className="px-6 py-3 text-left text-sm text-gray-600">Наименование</th>
                        <th className="px-6 py-3 text-right text-sm text-gray-600">Значение (₽)</th>
                        <th className="px-6 py-3 text-left text-sm text-gray-600"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(details?.items ?? []).map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-3 text-sm font-mono text-gray-600">{item.code}</td>
                          <td className="px-6 py-3 text-sm">{item.name}</td>
                          <td className="px-6 py-3 text-sm text-right font-mono">{item.value}</td>
                          <td className="px-6 py-3">
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
                  Всего позиций: {details?.items?.length ?? 0}
                </div>
              </div>
            </div>

            {/* Right Side - Linked Price Lists */}
            <div>
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h4 className="text-sm">Привязанные прайс-листы</h4>
                </div>
                <div className="p-4 space-y-3">
                  {(details?.linkedPriceLists ?? []).map((pl, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-sm font-mono">{pl.code}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            pl.status === "Активен"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {pl.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">{pl.name}</div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-gray-200">
                  <button className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Управление привязками
                  </button>
                </div>
              </div>

              {/* Info Panel */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="text-sm text-blue-900 mb-2">Типы списков:</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li><strong>Фикс. цена</strong> — точная фиксированная цена</li>
                  <li><strong>Мин. цена</strong> — минимально допустимая цена</li>
                  <li><strong>Макс. наценка</strong> — максимальная наценка в %</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertDialog open={deleteCandidate !== null} onOpenChange={(open) => (!open ? setDeleteCandidate(null) : null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить список?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteCandidate ? `"${deleteCandidate.name}" будет удален без возможности восстановления.` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteCandidate(null)}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const id = deleteCandidate?.id;
                setDeleteCandidate(null);
                if (typeof id === "number") void deleteList(id);
              }}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
