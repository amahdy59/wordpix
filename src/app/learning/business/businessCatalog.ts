import catalogData from "./businessCatalog.json";
import { businessUnitSchema, type BusinessUnit, type BusinessCefrLevel } from "./businessTypes";

export const BUSINESS_UNITS: BusinessUnit[] = (catalogData as unknown[]).map((raw) =>
  businessUnitSchema.parse(raw)
);

const UNIT_MAP = new Map<string, BusinessUnit>(BUSINESS_UNITS.map((unit) => [unit.id, unit]));

const UNIT_NUMBER_MAP = new Map<number, BusinessUnit>(
  BUSINESS_UNITS.map((unit) => [unit.unitNumber, unit])
);

export function getBusinessUnit(unitId: string): BusinessUnit | undefined {
  return UNIT_MAP.get(unitId);
}

export function getBusinessUnitByNumber(unitNumber: number): BusinessUnit | undefined {
  return UNIT_NUMBER_MAP.get(unitNumber);
}

export function getBusinessUnitsByLevel(level: BusinessCefrLevel): BusinessUnit[] {
  return BUSINESS_UNITS.filter((u) => u.level === level);
}

export const getBusinessUnitsByCefr = getBusinessUnitsByLevel;

export interface BusinessSection {
  sectionNumber: number;
  title: string;
  titleAr?: string;
  level: BusinessCefrLevel;
  units: BusinessUnit[];
}

export function getBusinessSections(): BusinessSection[] {
  const sections: BusinessSection[] = [];
  for (let i = 1; i <= 4; i++) {
    const units = BUSINESS_UNITS.filter((u) => u.sectionNumber === i);
    if (units.length > 0) {
      sections.push({
        sectionNumber: i,
        title: units[0].sectionTitle,
        titleAr: units[0].sectionTitleAr,
        level: units[0].level,
        units,
      });
    }
  }
  return sections;
}
