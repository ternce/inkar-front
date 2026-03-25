import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Search, FileUp } from 'lucide-react';
import { Badge } from './ui/badge';
import { useState } from 'react';

interface Product {
  id: string;
  nomenclature: string;
  code: string;
  markup: string;
}

interface AppliedPriceList {
  id: string;
  number: number;
  priceList: string;
}

const mockProducts: Product[] = [
  { id: '1', nomenclature: 'Анальгин', code: '12121', markup: '0.5' },
  { id: '2', nomenclature: 'Парацетамол', code: '12122', markup: '0.8' },
  { id: '3', nomenclature: 'Аспирин', code: '12123', markup: '1.2' },
];

const mockAppliedLists: AppliedPriceList[] = [
  { id: '1', number: 1, priceList: 'ИПЛ_002_001' },
  { id: '2', number: 2, priceList: 'ГПЛ_01_002' },
];

export function UniversalListsTab() {
  const [products] = useState<Product[]>(mockProducts);
  const [appliedLists] = useState<AppliedPriceList[]>(mockAppliedLists);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((product) =>
    Object.values(product).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      {/* List Settings */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Параметры списка
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Код</Label>
            <Input id="code" placeholder="Введите код" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="listName">Наименование</Label>
            <Input id="listName" placeholder="Введите наименование" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Статус</Label>
            <Select defaultValue="active">
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Активный</SelectItem>
                <SelectItem value="inactive">Неактивный</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="section">Раздел</Label>
            <Select>
              <SelectTrigger id="section">
                <SelectValue placeholder="Выберите раздел" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medicines">Медикаменты</SelectItem>
                <SelectItem value="medical">Медизделия</SelectItem>
                <SelectItem value="hygiene">Гигиена</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Тип</Label>
            <Select>
              <SelectTrigger id="type">
                <SelectValue placeholder="Выберите тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Фиксированная цена</SelectItem>
                <SelectItem value="markup">Наценка</SelectItem>
                <SelectItem value="discount">Скидка</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">Дата начала</Label>
            <Input id="startDate" type="date" />
          </div>
          
          <div className="space-y-2 col-span-3">
            <Label htmlFor="endDate">Дата окончания</Label>
            <Input id="endDate" type="date" />
          </div>
        </div>
      </div>

      {/* Two-column layout for tables */}
      <div className="grid grid-cols-2 gap-4">
        {/* Products Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Товары
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Подбор
              </Button>
              <Button variant="outline" size="sm">
                <FileUp className="h-4 w-4 mr-2" />
                Загрузить
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Добавить
              </Button>
            </div>
          </div>
          
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Номенклатура
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Код
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Наценка
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {product.nomenclature}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {product.code}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {product.markup}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Applied Price Lists Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Применяемые прайс-листы
            </h3>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Добавить
            </Button>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-16">
                      №
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Прайс-лист
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appliedLists.map((list) => (
                    <tr
                      key={list.id}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {list.number}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {list.priceList}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
