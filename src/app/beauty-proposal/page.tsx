import type { Metadata } from "next";
import { BeautyPresentation } from "@/components/beauty-presentation";
import "./presentation.css";

export const metadata: Metadata = {
  title: "ATLAXIS BEAUTY | Коммерческое предложение",
  description: "Два этапа: проверка ценности продукта и реализация маркетинга.",
};

export default function BeautyProposalPage() {
  return <BeautyPresentation />;
}


