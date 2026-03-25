import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Eye, ArrowDown } from 'lucide-react';
import { useState } from 'react';

interface CompetitorPriceList {
  id: string;
  supplier: string;
  priceDate: string;
  name: string;
  region: string;
}

interface SelectedPriceList {
  id: string;
  coefficient: string;
  supplier: string;
  priceDate: string;
  name: string;
}

const mockCompetitorLists: CompetitorPriceList[] = [
  {
    id: '1',
    supplier: 'Эмити',
    priceDate: '21.03.2026',
    name: 'Персентиль 10',
    region: 'Алматы',
  },
  {
    id: '2',
    supplier: 'Эмити',
    priceDate: '21.03.2026',
    name: 'Персентиль 20',
    region: 'Алматы',
  },
  {
    id: '3',
    supplier: 'СофтМедика',
    priceDate: '20.03.2026',
    name: 'Базовый прайс',
    region: 'Астана',
  },
  {
    id: '4',
    supplier: 'ФармаТрейд',
    priceDate: '19.03.2026',
    name: 'Оптовый',
    region: 'Шымкент',
  },
];

export function CompetitorAssignmentTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLists, setSelectedLists] = useState<SelectedPriceList[]>([
    {
      id: '2',
      coefficient: '1.000',
      supplier: 'Эмити',
      priceDate: '21.03.2026',
      name: 'Персентиль 20',
    },
  ]);

  const filteredLists = mockCompetitorLists.filter((list) =>
    Object.values(list).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDoubleClick = (list: CompetitorPriceList) => {
    const exists = selectedLists.some((item) => item.id === list.id);
    if (!exists) {
      setSelectedLists([
        ...selectedLists,
        {
          id: list.id,
          coefficient: '1.000',
          supplier: list.supplier,
          priceDate: list.priceDate,
          name: list.name,
        },
      ]);
    }
  };

  const handleRemoveSelected = (id: string) => {
    setSelectedLists(selectedLists.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Available Price Lists */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">
          Доступные прайс-листы конкурентов
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Просмотр прайс-листа
          </Button>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Поставщик
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Дата цен
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Наименование
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Регион
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLists.map((list) => (
                  <tr
                    key={list.id}
                    onDoubleClick={() => handleDoubleClick(list)}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {list.supplier}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {list.priceDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {list.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {list.region}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Двойной клик для добавления в выбранные
        </p>
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <ArrowDown className="h-6 w-6 text-gray-400" />
      </div>

      {/* Selected Price Lists */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">
          Выбранные прайс-листы
        </h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Коэффициент
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Поставщик
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Дата цен
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Наименование
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedLists.map((list) => (
                  <tr
                    key={list.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <Input
                        value={list.coefficient}
                        className="w-24"
                        onChange={() => {}}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {list.supplier}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {list.priceDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {list.name}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSelected(list.id)}
                      >
                        Удалить
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
