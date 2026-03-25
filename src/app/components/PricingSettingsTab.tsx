import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Save } from 'lucide-react';

interface MarkupRule {
  id: string;
  number: number;
  lowerBound: string;
  upperBound: string;
  markup: string;
}

const mockMarkupRules: MarkupRule[] = [
  { id: '1', number: 1, lowerBound: '0', upperBound: '49.99', markup: '10%' },
  { id: '2', number: 2, lowerBound: '50', upperBound: '99.99', markup: '8%' },
  { id: '3', number: 3, lowerBound: '100', upperBound: '499.99', markup: '5%' },
  { id: '4', number: 4, lowerBound: '500', upperBound: '999.99', markup: '3%' },
  { id: '5', number: 5, lowerBound: '1000', upperBound: '9999.99', markup: '2%' },
];

export function PricingSettingsTab() {
  return (
    <div className="space-y-6">
      {/* Settings Form */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Основные параметры ценообразования
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Наименование</Label>
            <Input id="name" defaultValue="ГПЛ_02_001" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="branch">Филиал</Label>
            <Select defaultValue="astana">
              <SelectTrigger id="branch">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="astana">Астана</SelectItem>
                <SelectItem value="almaty">Алматы</SelectItem>
                <SelectItem value="shymkent">Шымкент</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 col-span-2">
            <Label htmlFor="rule">Правило ценообразования</Label>
            <Select defaultValue="standard">
              <SelectTrigger id="rule">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Стандартное</SelectItem>
                <SelectItem value="competitive">Конкурентное</SelectItem>
                <SelectItem value="margin">По марже</SelectItem>
                <SelectItem value="fixed">Фиксированное</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Сохранить настройки
          </Button>
        </div>
      </div>

      {/* Markup Rules Table */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">
          Таблица рекомендуемых наценок
        </h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-16">
                    №
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Нижняя граница
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Верхняя граница
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Наценка
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockMarkupRules.map((rule) => (
                  <tr
                    key={rule.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {rule.number}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {rule.lowerBound}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {rule.upperBound}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {rule.markup}
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
