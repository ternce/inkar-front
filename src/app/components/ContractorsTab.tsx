import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface Contractor {
  id: string;
  code: string;
  holding: string;
  name: string;
  inn: string;
}

const mockContractors: Contractor[] = [
  {
    id: '1',
    code: '001',
    holding: 'АСС',
    name: 'ТОО Аптека 1',
    inn: '123456789012',
  },
  {
    id: '2',
    code: '002',
    holding: 'АСС',
    name: 'ТОО Аптека 2',
    inn: '123456789013',
  },
  {
    id: '3',
    code: '003',
    holding: 'Садыхан',
    name: 'ТОО Фармацевт',
    inn: '987654321012',
  },
  {
    id: '4',
    code: '004',
    holding: 'Садыхан',
    name: 'ТОО МедСервис',
    inn: '987654321013',
  },
  {
    id: '5',
    code: '005',
    holding: 'Европа',
    name: 'ТОО Европа Фарма',
    inn: '456789123012',
  },
];

export function ContractorsTab() {
  const [contractors] = useState<Contractor[]>(mockContractors);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContractors = contractors.filter((contractor) =>
    Object.values(contractor).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-4">
      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-900">
          <strong>Информация:</strong> Данный раздел предназначен только для
          просмотра. Редактирование контрагентов запрещено.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Поиск..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Код
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Холдинг
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Наименование
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  ИНН
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredContractors.map((contractor) => (
                <tr
                  key={contractor.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {contractor.code}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {contractor.holding}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {contractor.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {contractor.inn}
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
