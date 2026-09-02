import { ArrowRight, ArrowLeft } from "lucide-react";
import { useI18n } from "../../../context/I18nContext";

/** Forward navigation icon that flips in RTL. */
export function ForwardIcon({ className }: { className?: string }) {
  const { dir } = useI18n();
  return dir === "rtl" ? (
    <ArrowLeft className={className} aria-hidden />
  ) : (
    <ArrowRight className={className} aria-hidden />
  );
}
