export type ConsentCategories = {
  essential: true;          // immer true
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentRecord = {
  granted: ConsentCategories;
  timestamp: string;        // ISO
  version: string;          // z.B. "1.0.0"
  source: "banner" | "modal" | "auto_dnt_gpc";
};