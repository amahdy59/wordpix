import { useState } from "react";
import type { Action } from "../types";
import { StatusBar } from "../shared/StatusBar";
import { HomeIndicator } from "../shared/HomeIndicator";
import { useProgress } from "../data/progress";
import {
  Building2,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Award,
  Briefcase,
  Star,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { useI18n } from "../context/I18nContext";

const imgHero = "./scene-images/splash-hero.jpg";

interface Props {
  dispatch: React.Dispatch<Action>;
}

type SectorId = "all" | "tech" | "telecom" | "healthcare" | "finance";

interface CompanyPartner {
  id: string;
  name: string;
  sectorKey: string;
  sectorGroup: SectorId;
  descriptionKey: string;
  badgeLabel: string;
  logo: (props: { className?: string }) => JSX.Element;
}

const PARTNERS: CompanyPartner[] = [
  {
    id: "vodafone",
    name: "Vodafone",
    sectorKey: "onboarding.partnerVodafoneSector",
    sectorGroup: "telecom",
    descriptionKey: "onboarding.partnerVodafoneDesc",
    badgeLabel: "Global Telecom",
    logo: ({ className = "size-8" }) => (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="44" className="stroke-current stroke-[7]" opacity="0.25" />
        <path
          d="M50 18 C34 18 22 30 22 46 C22 64 36 76 50 82 C44 76 40 68 40 58 C40 44 48 34 60 30 C57 22 53 18 50 18 Z"
          className="fill-current"
        />
        <circle cx="58" cy="52" r="10" className="fill-current opacity-90" />
      </svg>
    ),
  },
  {
    id: "microsoft",
    name: "Microsoft",
    sectorKey: "onboarding.partnerMicrosoftSector",
    sectorGroup: "tech",
    descriptionKey: "onboarding.partnerMicrosoftDesc",
    badgeLabel: "Cloud & AI",
    logo: ({ className = "size-8" }) => (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="14" y="14" width="32" height="32" rx="4" className="fill-current opacity-90" />
        <rect x="54" y="14" width="32" height="32" rx="4" className="fill-current opacity-70" />
        <rect x="14" y="54" width="32" height="32" rx="4" className="fill-current opacity-60" />
        <rect x="54" y="54" width="32" height="32" rx="4" className="fill-current opacity-80" />
      </svg>
    ),
  },
  {
    id: "siemens",
    name: "Siemens",
    sectorKey: "onboarding.partnerSiemensSector",
    sectorGroup: "tech",
    descriptionKey: "onboarding.partnerSiemensDesc",
    badgeLabel: "Engineering",
    logo: ({ className = "size-8" }) => (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="42" className="stroke-current stroke-[6]" opacity="0.3" />
        <path
          d="M30 36 C30 28 38 24 50 24 C62 24 70 28 70 34 C70 42 62 46 50 48 C36 50 28 54 28 64 C28 72 36 76 50 76 C64 76 72 70 72 62"
          className="stroke-current stroke-[8]"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "etisalat",
    name: "e& (Etisalat)",
    sectorKey: "onboarding.partnerEtisalatSector",
    sectorGroup: "telecom",
    descriptionKey: "onboarding.partnerEtisalatDesc",
    badgeLabel: "Telecom & Digital",
    logo: ({ className = "size-8" }) => (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="42" className="fill-current opacity-15" />
        <circle cx="44" cy="48" r="22" className="stroke-current stroke-[7]" />
        <path d="M26 48 L62 48" className="stroke-current stroke-[6]" strokeLinecap="round" />
        <circle cx="68" cy="40" r="7" className="fill-current" />
      </svg>
    ),
  },
  {
    id: "astrazeneca",
    name: "AstraZeneca",
    sectorKey: "onboarding.partnerAstraZenecaSector",
    sectorGroup: "healthcare",
    descriptionKey: "onboarding.partnerAstraZenecaDesc",
    badgeLabel: "Healthcare",
    logo: ({ className = "size-8" }) => (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M50 16 C34 16 24 28 24 44 C24 64 50 84 50 84 C50 84 76 64 76 44 C76 28 66 16 50 16 Z"
          className="stroke-current stroke-[6]"
          opacity="0.3"
        />
        <path
          d="M38 48 C38 38 44 32 50 32 C56 32 62 38 62 48 C62 58 56 64 50 64 C44 64 38 58 38 48 Z"
          className="fill-current opacity-80"
        />
      </svg>
    ),
  },
  {
    id: "hsbc",
    name: "HSBC",
    sectorKey: "onboarding.partnerHsbcSector",
    sectorGroup: "finance",
    descriptionKey: "onboarding.partnerHsbcDesc",
    badgeLabel: "Global Banking",
    logo: ({ className = "size-8" }) => (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          x="12"
          y="24"
          width="76"
          height="52"
          rx="6"
          className="stroke-current stroke-[6]"
          opacity="0.3"
        />
        <polygon points="50,28 72,50 50,72 28,50" className="fill-current opacity-90" />
        <polygon points="16,50 28,38 28,62" className="fill-current opacity-60" />
        <polygon points="84,50 72,38 72,62" className="fill-current opacity-60" />
      </svg>
    ),
  },
  {
    id: "emirates",
    name: "Emirates",
    sectorKey: "onboarding.partnerEmiratesSector",
    sectorGroup: "finance",
    descriptionKey: "onboarding.partnerEmiratesDesc",
    badgeLabel: "Aviation & Cargo",
    logo: ({ className = "size-8" }) => (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="42" className="stroke-current stroke-[6]" opacity="0.25" />
        <path
          d="M24 60 C38 44 62 40 76 34 C68 46 54 54 36 68 Z"
          className="fill-current opacity-90"
        />
        <path
          d="M40 38 C54 32 68 28 78 26 C72 34 60 40 48 46 Z"
          className="fill-current opacity-60"
        />
      </svg>
    ),
  },
  {
    id: "deloitte",
    name: "Deloitte",
    sectorKey: "onboarding.partnerDeloitteSector",
    sectorGroup: "finance",
    descriptionKey: "onboarding.partnerDeloitteDesc",
    badgeLabel: "Strategy & Advisory",
    logo: ({ className = "size-8" }) => (
      <svg
        viewBox="0 0 100 100"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="42" className="stroke-current stroke-[6]" opacity="0.2" />
        <path
          d="M32 28 L50 28 C64 28 72 36 72 50 C72 64 64 72 50 72 L32 72 Z M44 40 L44 60 L50 60 C58 60 60 56 60 50 C60 44 58 40 50 40 Z"
          className="fill-current"
        />
        <circle cx="76" cy="68" r="6" className="fill-current opacity-90" />
      </svg>
    ),
  },
];

export function PartnersWelcome({ dispatch }: Props) {
  const { t, interfaceLang, setInterfaceLang } = useI18n();
  const { setPreferences } = useProgress();
  const [selectedSector, setSelectedSector] = useState<SectorId>("all");

  const advance = () => dispatch({ type: "ONBOARD_NEXT" });
  const back = () => dispatch({ type: "ONBOARD_BACK" });

  const skip = () => {
    setPreferences({ englishLevel: "A1", dailyGoalMinutes: 10, goal: "everyday" });
    dispatch({ type: "GO", to: "home" });
  };

  const filteredPartners =
    selectedSector === "all"
      ? PARTNERS
      : PARTNERS.filter((partner) => partner.sectorGroup === selectedSector);

  const sectorFilters: Array<{ id: SectorId; labelKey: string }> = [
    { id: "all", labelKey: "onboarding.filterAll" },
    { id: "tech", labelKey: "onboarding.filterTech" },
    { id: "telecom", labelKey: "onboarding.filterTelecom" },
    { id: "healthcare", labelKey: "onboarding.filterHealthcare" },
    { id: "finance", labelKey: "onboarding.filterFinance" },
  ];

  return (
    <div className="bg-background text-foreground flex flex-col md:flex-row min-h-dvh md:min-h-[560px] relative overflow-hidden">
      <StatusBar />

      {/* ── Desktop Left Hero Column ────────────────────────────────────────── */}
      <aside
        aria-label={t("onboarding.clientPortfolio")}
        className="hidden md:flex md:w-1/2 bg-wp-panel text-wp-text-on-panel relative overflow-hidden flex-col justify-between p-8 xl:p-12"
      >
        <div className="absolute inset-0 opacity-30">
          <img alt={t("onboarding.previewAlt")} className="object-cover size-full" src={imgHero} />
          <div className="absolute inset-0 bg-gradient-to-t from-wp-panel via-wp-panel/80 to-transparent" />
        </div>

        {/* Brand Header Left */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-primary flex items-center justify-center shadow-md">
            <BookOpen className="size-5 text-primary-foreground" />
          </div>
          <span className="font-sans font-black text-white text-xl tracking-tight">
            {t("app.title")}
          </span>
        </div>

        {/* Center Feature Highlights */}
        <div className="relative z-10 flex flex-col gap-5 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md self-start text-xs font-sans font-semibold">
            <Award className="size-3.5 text-wp-amber-foreground" />
            <span>{t("onboarding.enterpriseProven")}</span>
          </div>

          <h2 className="font-sans font-black text-3xl xl:text-4xl text-white leading-tight">
            {t("onboarding.trustedHeroHeading")}
          </h2>

          <p className="font-sans text-wp-text-on-panel-muted text-sm leading-relaxed">
            {t("onboarding.trustedHeroDesc")}
          </p>

          {/* Social Proof Metric Bar */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-white/10 rounded-2xl p-3 border border-white/15 backdrop-blur-md flex flex-col gap-1 text-center">
              <span className="font-sans font-black text-white text-lg xl:text-xl">
                {t("onboarding.statCompaniesValue")}
              </span>
              <span className="text-[11px] font-sans font-medium text-wp-text-on-panel-muted leading-tight">
                {t("onboarding.statCompanies")}
              </span>
            </div>

            <div className="bg-white/10 rounded-2xl p-3 border border-white/15 backdrop-blur-md flex flex-col gap-1 text-center">
              <span className="font-sans font-black text-white text-lg xl:text-xl">
                {t("onboarding.statLearnersValue")}
              </span>
              <span className="text-[11px] font-sans font-medium text-wp-text-on-panel-muted leading-tight">
                {t("onboarding.statLearners")}
              </span>
            </div>

            <div className="bg-white/10 rounded-2xl p-3 border border-white/15 backdrop-blur-md flex flex-col gap-1 text-center">
              <span className="font-sans font-black text-white text-lg xl:text-xl">
                {t("onboarding.statFluencyValue")}
              </span>
              <span className="text-[11px] font-sans font-medium text-wp-text-on-panel-muted leading-tight">
                {t("onboarding.statFluency")}
              </span>
            </div>
          </div>

          {/* Testimonial Quote Box */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 backdrop-blur-md flex flex-col gap-2.5">
            <div className="flex items-center gap-1 text-wp-amber-foreground" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((star) => (
                <Star key={star} className="size-3.5 fill-current" />
              ))}
            </div>
            <p className="text-xs font-sans text-white/95 leading-relaxed italic">
              {t("onboarding.trustedQuote")}
            </p>
            <div className="flex items-center gap-2 pt-1 border-t border-white/10">
              <Briefcase className="size-3.5 text-wp-text-on-panel-muted shrink-0" />
              <span className="text-[11px] font-sans font-semibold text-wp-text-on-panel-muted">
                {t("onboarding.trustedAuthor")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Left */}
        <div className="relative z-10 flex items-center gap-2 text-wp-text-on-panel-muted text-xs font-sans font-semibold">
          <Globe className="size-4" />
          <span>{t("onboarding.trustedFooterNote")}</span>
        </div>
      </aside>

      {/* ── Right Column / Mobile Layout ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-8 xl:p-12 min-h-dvh md:min-h-0 bg-background relative z-10 overflow-y-auto">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden w-full flex items-center justify-between z-10 shrink-0 mb-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-primary flex items-center justify-center shadow-wp-xs">
              <BookOpen className="size-4 text-primary-foreground" />
            </div>
            <span className="font-sans font-bold text-foreground text-base tracking-tight">
              {t("app.title")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center rounded-xl bg-muted p-0.5 border border-border"
              role="group"
              aria-label={t("onboarding.selectLanguage")}
            >
              <button
                type="button"
                onClick={() => setInterfaceLang("en")}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all min-h-[44px] ${
                  interfaceLang === "en"
                    ? "bg-card text-foreground shadow-wp-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={interfaceLang === "en"}
              >
                {t("settings.english")}
              </button>
              <button
                type="button"
                onClick={() => setInterfaceLang("ar")}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all min-h-[44px] ${
                  interfaceLang === "ar"
                    ? "bg-card text-foreground shadow-wp-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={interfaceLang === "ar"}
              >
                {t("settings.arabic")}
              </button>
            </div>
            <span className="text-xs font-sans font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
              {t("onboarding.step2")}
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-start w-full max-w-xl mx-auto md:mx-0 py-2 gap-5 z-10">
          {/* Desktop Subheader */}
          <div className="hidden md:flex items-center justify-between w-full">
            <span className="text-xs font-sans font-bold text-secondary-foreground bg-secondary px-3 py-1 rounded-full border border-primary/30">
              {t("onboarding.clientPortfolio")}
            </span>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center rounded-xl bg-muted p-0.5 border border-border"
                role="group"
                aria-label={t("onboarding.selectLanguage")}
              >
                <button
                  type="button"
                  onClick={() => setInterfaceLang("en")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all min-h-[44px] ${
                    interfaceLang === "en"
                      ? "bg-card text-foreground shadow-wp-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-pressed={interfaceLang === "en"}
                >
                  {t("settings.english")}
                </button>
                <button
                  type="button"
                  onClick={() => setInterfaceLang("ar")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all min-h-[44px] ${
                    interfaceLang === "ar"
                      ? "bg-card text-foreground shadow-wp-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-pressed={interfaceLang === "ar"}
                >
                  {t("settings.arabic")}
                </button>
              </div>
              <span className="text-xs font-sans font-semibold text-muted-foreground">
                {t("onboarding.step2")}
              </span>
            </div>
          </div>

          {/* Header Title Section */}
          <div className="flex flex-col gap-2 text-start">
            <div className="inline-flex items-center gap-2 bg-secondary px-3.5 py-1 rounded-full border border-primary/30 shadow-wp-xs self-start">
              <Building2 className="size-3.5 text-primary" />
              <span className="font-sans font-semibold text-xs text-secondary-foreground">
                {t("onboarding.enterpriseProven")}
              </span>
            </div>
            <h1 className="font-sans font-black text-foreground text-2xl md:text-3xl leading-tight tracking-tight">
              {t("onboarding.trustedTitle")}
            </h1>
            <p className="font-sans font-medium text-muted-foreground text-sm md:text-base leading-relaxed">
              {t("onboarding.trustedSubtitle")}
            </p>
          </div>

          {/* Interactive Sector Filter Pills */}
          <div
            className="flex items-center gap-1.5 flex-wrap w-full py-1"
            role="toolbar"
            aria-label={t("onboarding.filterAll")}
          >
            {sectorFilters.map((sector) => {
              const active = selectedSector === sector.id;
              return (
                <button
                  key={sector.id}
                  type="button"
                  onClick={() => setSelectedSector(sector.id)}
                  aria-pressed={active}
                  className={`px-3 py-1.5 text-xs font-sans font-semibold rounded-full min-h-[44px] transition-all flex items-center gap-1.5 border focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {active && <CheckCircle2 className="size-3.5 text-primary-foreground shrink-0" />}
                  <span>{t(sector.labelKey)}</span>
                </button>
              );
            })}
          </div>

          {/* Logo Showcase Grid */}
          <div
            className="grid grid-cols-2 gap-3 sm:gap-4 w-full"
            role="region"
            aria-label={t("onboarding.clientPortfolio")}
          >
            {filteredPartners.map((partner) => {
              const LogoComponent = partner.logo;
              return (
                <div
                  key={partner.id}
                  className="rounded-2xl border border-border bg-card p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-wp-xs hover:border-primary/50 hover:shadow-wp-sm transition-all text-start group focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="size-11 rounded-xl bg-secondary/30 flex items-center justify-center p-1.5 text-foreground group-hover:text-primary transition-colors">
                      <LogoComponent className="size-7 text-current" />
                    </div>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border">
                      {partner.badgeLabel}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-sans font-black text-foreground text-base tracking-tight group-hover:text-primary transition-colors">
                      {partner.name}
                    </h3>
                    <p className="font-sans text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {t(partner.sectorKey)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-border/50 text-[11px] font-medium text-wp-green">
                    <CheckCircle2 className="size-3.5 shrink-0" />
                    <span className="truncate">{t("onboarding.supportedInTraining")}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Metrics Strip (Hidden on Desktop) */}
          <div className="md:hidden grid grid-cols-3 gap-2 w-full pt-1">
            <div className="bg-card border border-border rounded-xl p-2.5 text-center flex flex-col gap-0.5">
              <span className="font-sans font-bold text-foreground text-sm">
                {t("onboarding.statCompaniesValue")}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                {t("onboarding.statCompanies")}
              </span>
            </div>
            <div className="bg-card border border-border rounded-xl p-2.5 text-center flex flex-col gap-0.5">
              <span className="font-sans font-bold text-foreground text-sm">
                {t("onboarding.statLearnersValue")}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                {t("onboarding.statLearners")}
              </span>
            </div>
            <div className="bg-card border border-border rounded-xl p-2.5 text-center flex flex-col gap-0.5">
              <span className="font-sans font-bold text-foreground text-sm">
                {t("onboarding.statFluencyValue")}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                {t("onboarding.statFluency")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Navigation CTA */}
        <footer className="w-full max-w-xl mx-auto md:mx-0 pt-4 shrink-0 z-10">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={back}
              aria-label={t("onboarding.backStep")}
              className="w-full sm:w-auto px-5 py-4 bg-card border border-border text-foreground rounded-xl font-sans font-bold text-sm min-h-[52px]
                hover:border-primary/40 hover:bg-muted transition-colors flex items-center justify-center gap-2
                focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
              <span>{t("onboarding.backStep")}</span>
            </button>

            <button
              type="button"
              onClick={advance}
              className="w-full flex-1 bg-primary rounded-xl py-4 font-sans font-bold text-primary-foreground text-base min-h-[52px]
                focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary
                shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{t("onboarding.continueToGoal")}</span>
              <ArrowRight className="size-5 rtl:rotate-180" aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={skip}
            className="w-full mt-2 py-2.5 font-sans font-semibold text-muted-foreground hover:text-foreground text-sm min-h-[44px] rounded-lg transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("onboarding.skipSetup")}
          </button>
        </footer>

        <div className="md:hidden shrink-0">
          <HomeIndicator />
        </div>
      </div>
    </div>
  );
}
