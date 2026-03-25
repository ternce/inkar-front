import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { useState } from 'react';

interface AnalyticsData {
  name: string;
  value: number;
  color: string;
}

interface ClientAnalytics {
  id: string;
  branch: string;
  client: string;
  priceList: string;
  skuCount: number;
  forecastShare: string;
  actualShare: string;
  comment: string;
}

const distributionData: AnalyticsData[] = [
  { name: 'Левое плечо (цена ниже)', value: 25, color: '#10b981' },
  { name: 'Зона логичности (0-3%)', value: 45, color: '#3b82f6' },
  { name: 'Правое плечо (>3%)', value: 20, color: '#f59e0b' },
  { name: 'Не пересекаемый сегмент', value: 10, color: '#6b7280' },
];

const mockClientAnalytics: ClientAnalytics[] = [
  {
    id: '1',
    branch: 'Алматы',
    client: 'Аптека 1',
    priceList: 'ИПЛ_01_002',
    skuCount: 150,
    forecastShare: '12%',
    actualShare: '7%',
    comment: 'Требуется корректировка',
  },
  {
    id: '2',
    branch: 'Астана',
    client: 'Аптека 2',
    priceList: 'ГПЛ_02_001',
    skuCount: 200,
    forecastShare: '15%',
    actualShare: '14%',
    comment: 'В пределах нормы',
  },
  {
    id: '3',
    branch: 'Шымкент',
    client: 'Аптека 3',
    priceList: 'ГПЛ_03_001',
    skuCount: 120,
    forecastShare: '10%',
    actualShare: '5%',
    comment: 'Низкая конкурентоспособность',
  },
];

export function AnalyticsTab() {
  const [clientAnalytics] = useState<ClientAnalytics[]>(mockClientAnalytics);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAnalytics = clientAnalytics.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-700">
            Количество: {payload[0].value} SKU
          </p>
          <p className="text-sm text-gray-700">
            Процент: {((payload[0].value / distributionData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Chart Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Распределение товаров по ценовым зонам
        </h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${(percent * 100).toFixed(1)}%`
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-sm text-gray-700">{entry.payload.name}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend Description */}
        <div className="mt-6 space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded bg-green-500 mt-0.5 flex-shrink-0"></div>
            <div>
              <strong>Левое плечо:</strong> Цена ниже конкурентов
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded bg-blue-500 mt-0.5 flex-shrink-0"></div>
            <div>
              <strong>Зона логичности:</strong> Цена выше на 0-3%
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded bg-amber-500 mt-0.5 flex-shrink-0"></div>
            <div>
              <strong>Правое плечо:</strong> Цена выше более чем на 3%
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded bg-gray-500 mt-0.5 flex-shrink-0"></div>
            <div>
              <strong>Не пересекаемый сегмент:</strong> Нет данных конкурентов
            </div>
          </div>
        </div>
      </div>

      {/* Client Analytics Table */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">
          Аналитика по клиентам
        </h3>
        
        <div className="relative max-w-sm mb-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Филиал
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Клиент
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Прайс-лист
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Количество SKU
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Доля прогноз
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Доля факт
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Комментарий
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalytics.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.branch}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.client}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.priceList}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.skuCount}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.forecastShare}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.actualShare}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.comment}
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
