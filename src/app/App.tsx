import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { PriceListsTab } from './components/PriceListsTab';
import { CompetitorAssignmentTab } from './components/CompetitorAssignmentTab';
import { ListsManagementTab } from './components/ListsManagementTab';
import { ContractorsTab } from './components/ContractorsTab';
import { PricingSettingsTab } from './components/PricingSettingsTab';
import { UniversalListsTab } from './components/UniversalListsTab';
import { AnalyticsTab } from './components/AnalyticsTab';

interface PriceFormat {
  id: string;
  name: string;
  code: string;
  branch: string;
}

const priceFormats: PriceFormat[] = [
  { id: '1', name: 'ГПЛ_02_001', code: '02', branch: 'Астана' },
  { id: '2', name: 'ИПЛ_01_002', code: '01', branch: 'Алматы' },
  { id: '3', name: 'ГПЛ_03_001', code: '03', branch: 'Шымкент' },
  { id: '4', name: 'ИПЛ_02_003', code: '02', branch: 'Астана' },
];

export default function App() {
  const [selectedFormat, setSelectedFormat] = useState<PriceFormat>(priceFormats[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Управление прайс-листами и ценообразованием
        </h1>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - 30% */}
        <aside className="w-[30%] bg-white border-r border-gray-200 overflow-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Ценовые форматы
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-200">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Наименование
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Код
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                      Филиал
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {priceFormats.map((format) => (
                    <tr
                      key={format.id}
                      onClick={() => setSelectedFormat(format)}
                      className={`border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedFormat.id === format.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {format.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {format.code}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {format.branch}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </aside>

        {/* Right Panel - 70% */}
        <main className="w-[70%] bg-white overflow-auto">
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedFormat.name} — {selectedFormat.branch}
              </h2>
            </div>

            <Tabs defaultValue="pricelists" className="w-full">
              <TabsList className="w-full justify-start border-b border-gray-200 rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="pricelists"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
                >
                  Сформированные прайс-листы
                </TabsTrigger>
                <TabsTrigger
                  value="competitors"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
                >
                  Назначение прайс-листов конкурентов
                </TabsTrigger>
                <TabsTrigger
                  value="lists"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
                >
                  Работа со списками
                </TabsTrigger>
                <TabsTrigger
                  value="contractors"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
                >
                  Контрагенты
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
                >
                  Настройки ценообразования
                </TabsTrigger>
                <TabsTrigger
                  value="universal"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
                >
                  Универсальные списки
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-2"
                >
                  Аналитика прайс-листа
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="pricelists" className="m-0">
                  <PriceListsTab />
                </TabsContent>
                <TabsContent value="competitors" className="m-0">
                  <CompetitorAssignmentTab />
                </TabsContent>
                <TabsContent value="lists" className="m-0">
                  <ListsManagementTab />
                </TabsContent>
                <TabsContent value="contractors" className="m-0">
                  <ContractorsTab />
                </TabsContent>
                <TabsContent value="pricing" className="m-0">
                  <PricingSettingsTab />
                </TabsContent>
                <TabsContent value="universal" className="m-0">
                  <UniversalListsTab />
                </TabsContent>
                <TabsContent value="analytics" className="m-0">
                  <AnalyticsTab />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
