// lib/UIPlaceholders.ts
export interface UIDisplayField {
  key: string;
  label: {
    en: string;
    hi: string;
    as: string;
  };
  unit?: string; // optional display unit like %, ₹, etc.
  format?: "number" | "percent" | "currency" | "text";
}

/**
 * Define consistent human-readable field labels
 * for MGNREGA dashboard cards, tables, and tooltips.
 */
export const UI_PLACEHOLDERS: UIDisplayField[] = [
  {
    key: "Approved_Labour_Budget",
    label: {
      en: "Approved Labour Budget",
      hi: "स्वीकृत श्रम बजट",
      as: "অনুমোদিত শ্রম বাজেট",
    },
    unit: "₹",
    format: "currency",
  },
  {
    key: "Average_Wage_rate_per_day_per_person",
    label: {
      en: "Avg. Wage Rate / Day",
      hi: "औसत दैनिक मजदूरी दर",
      as: "গড় দিনপিছু মজুৰিৰ হাৰ",
    },
    unit: "₹",
    format: "currency",
  },
  {
    key: "Average_days_of_employment_provided_per_Household",
    label: {
      en: "Avg. Days of Employment per HH",
      hi: "प्रति परिवार औसत रोजगार दिवस",
      as: "প্ৰতি গৃহস্থৰ গড় কাৰ্য দিন",
    },
    format: "number",
  },
  {
    key: "Total_Households_Worked",
    label: {
      en: "Households Worked",
      hi: "कार्यरत परिवार",
      as: "কৰ্মৰত গৃহস্থসকল",
    },
    format: "number",
  },
  {
    key: "Total_Individuals_Worked",
    label: {
      en: "Individuals Worked",
      hi: "कार्यरत व्यक्ति",
      as: "কৰ্মৰত ব্যক্তি",
    },
    format: "number",
  },
  {
    key: "Total_Exp",
    label: {
      en: "Total Expenditure",
      hi: "कुल व्यय",
      as: "মুঠ খৰচ",
    },
    unit: "₹",
    format: "currency",
  },
  {
    key: "Number_of_Completed_Works",
    label: {
      en: "Completed Works",
      hi: "पूर्ण किए गए कार्य",
      as: "সম্পূৰ্ণ কাম",
    },
    format: "number",
  },
  {
    key: "Number_of_Ongoing_Works",
    label: {
      en: "Ongoing Works",
      hi: "चालू कार्य",
      as: "চলিত কাম",
    },
    format: "number",
  },
  {
    key: "Women_Persondays",
    label: {
      en: "Women Persondays",
      hi: "महिला कार्य दिवस",
      as: "মহিলাৰ কৰ্মদিন",
    },
    format: "number",
  },
  {
    key: "percentage_payments_gererated_within_15_days",
    label: {
      en: "Payments within 15 Days",
      hi: "15 दिनों के भीतर भुगतान (%)",
      as: "১৫ দিনৰ ভিতৰত পেমেণ্ট (%)",
    },
    unit: "%",
    format: "percent",
  },
  {
    key: "percent_of_Expenditure_on_Agriculture_Allied_Works",
    label: {
      en: "Expenditure on Agri & Allied Works",
      hi: "कृषि एवं संबद्ध कार्यों पर व्यय (%)",
      as: "কৃষি আৰু সম্পৰ্কীয় কামত ব্যয় (%)",
    },
    unit: "%",
    format: "percent",
  },
  {
    key: "ST_persondays",
    label: {
      en: "ST Persondays",
      hi: "अनुसूचित जनजाति कार्य दिवस",
      as: "তালিকাভুক্ত উপজাতিৰ কৰ্মদিন",
    },
    format: "number",
  },
  {
    key: "SC_persondays",
    label: {
      en: "SC Persondays",
      hi: "अनुसूचित जाति कार्य दिवस",
      as: "তালিকাভুক্ত জাতিৰ কৰ্মদিন",
    },
    format: "number",
  },
];
