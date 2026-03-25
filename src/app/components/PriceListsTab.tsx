import { Button } from './ui/button';
import { Input } from './ui/input';
import { FileDown, RefreshCw, Plus, Calculator, Search } from 'lucide-react';
import { useState } from 'react';

interface PriceList {
  id: string;
  date: string;
  number: string;
  format: string;
  activationDate: string;
  user: string;
}

const mockPriceLists: PriceList[] = [
  {
    id: '1',
    date: '21.03.2026 11:00',
    number: 'PL-001',
    format: 'ГПЛ_02_001',
    activationDate: '22.03.2026',
    user: 'Иванов',
  },
  {
    id: '2',
    date: '20.03.2026 14:30',
    number: 'PL-002',
    format: 'ГПЛ_02_001',
    activationDate: '21.03.2026',
    user: 'Петрова',
  },
  {
    id: '3',
    date: '19.03.2026 09:15',
    number: 'PL-003',
    format: 'ГПЛ_02_001',
    activationDate: '20.03.2026',
    user: 'Сидоров',
  },
];

export function PriceListsTab() {
  const [priceLists] = useState<PriceList[]>(mockPriceLists);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLists = priceLists.filter((list) =>
    Object.values(list).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить данные
          </Button>
          <Button variant="outline" size="sm">
            <Calculator className="h-4 w-4 mr-2" />
            Пересчитать цены
          </Button>
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Скачать Excel
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Создать прайс-лист
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Дата
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Номер
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Ценовой формат
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Дата активации
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Пользователь
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLists.map((list) => (
                <tr
                  key={list.id}
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {list.date}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {list.number}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {list.format}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {list.activationDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {list.user}
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
