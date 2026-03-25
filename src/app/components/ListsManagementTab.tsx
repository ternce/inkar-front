import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Edit, FileUp, Search, Power } from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';

interface RestrictionList {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive';
  type: string;
  startDate: string;
  endDate: string;
}

const mockLists: RestrictionList[] = [
  {
    id: '1',
    name: 'Прямые контракты',
    code: '001',
    status: 'active',
    type: 'Фиксированная цена',
    startDate: '01.03.2026',
    endDate: '31.03.2026',
  },
  {
    id: '2',
    name: 'Акционные товары',
    code: '002',
    status: 'active',
    type: 'Процент скидки',
    startDate: '15.03.2026',
    endDate: '15.04.2026',
  },
  {
    id: '3',
    name: 'Минимальная маржа',
    code: '003',
    status: 'inactive',
    type: 'Минимальная наценка',
    startDate: '01.02.2026',
    endDate: '28.02.2026',
  },
];

export function ListsManagementTab() {
  const [lists] = useState<RestrictionList[]>(mockLists);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLists = lists.filter((list) =>
    Object.values(list).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileUp className="h-4 w-4 mr-2" />
            Импорт из Excel
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
          <Button variant="outline" size="sm">
            <Power className="h-4 w-4 mr-2" />
            Активировать / Деактивировать
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Создать список
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
                  Наименование
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Код
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Статус
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Тип
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Дата начала
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Дата окончания
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
                    {list.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {list.code}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Badge
                      variant={
                        list.status === 'active' ? 'default' : 'secondary'
                      }
                      className={
                        list.status === 'active'
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                      }
                    >
                      {list.status === 'active' ? 'Активный' : 'Неактивный'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {list.type}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {list.startDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {list.endDate}
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
