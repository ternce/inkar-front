import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { PriceLists } from "./pages/PriceLists";
import { PriceListAnalysis } from "./pages/PriceListAnalysis";
import { CompetitorAssignment } from "./pages/CompetitorAssignment";
import { UniversalLists } from "./pages/UniversalLists";
import { PricingSettings } from "./pages/PricingSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "price-lists", Component: PriceLists },
      { path: "price-list-analysis/:id", Component: PriceListAnalysis },
      { path: "competitor-assignment", Component: CompetitorAssignment },
      { path: "universal-lists", Component: UniversalLists },
      { path: "pricing-settings", Component: PricingSettings },
    ],
  },
]);
