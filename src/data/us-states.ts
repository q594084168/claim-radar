export const US_STATES = [
  { code: "AL", name: "Alabama", abbr: "AL" },
  { code: "AK", name: "Alaska", abbr: "AK" },
  { code: "AZ", name: "Arizona", abbr: "AZ" },
  { code: "AR", name: "Arkansas", abbr: "AR" },
  { code: "CA", name: "California", abbr: "CA" },
  { code: "CO", name: "Colorado", abbr: "CO" },
  { code: "CT", name: "Connecticut", abbr: "CT" },
  { code: "DE", name: "Delaware", abbr: "DE" },
  { code: "FL", name: "Florida", abbr: "FL" },
  { code: "GA", name: "Georgia", abbr: "GA" },
  { code: "HI", name: "Hawaii", abbr: "HI" },
  { code: "ID", name: "Idaho", abbr: "ID" },
  { code: "IL", name: "Illinois", abbr: "IL" },
  { code: "IN", name: "Indiana", abbr: "IN" },
  { code: "IA", name: "Iowa", abbr: "IA" },
  { code: "KS", name: "Kansas", abbr: "KS" },
  { code: "KY", name: "Kentucky", abbr: "KY" },
  { code: "LA", name: "Louisiana", abbr: "LA" },
  { code: "ME", name: "Maine", abbr: "ME" },
  { code: "MD", name: "Maryland", abbr: "MD" },
  { code: "MA", name: "Massachusetts", abbr: "MA" },
  { code: "MI", name: "Michigan", abbr: "MI" },
  { code: "MN", name: "Minnesota", abbr: "MN" },
  { code: "MS", name: "Mississippi", abbr: "MS" },
  { code: "MO", name: "Missouri", abbr: "MO" },
  { code: "MT", name: "Montana", abbr: "MT" },
  { code: "NE", name: "Nebraska", abbr: "NE" },
  { code: "NV", name: "Nevada", abbr: "NV" },
  { code: "NH", name: "New Hampshire", abbr: "NH" },
  { code: "NJ", name: "New Jersey", abbr: "NJ" },
  { code: "NM", name: "New Mexico", abbr: "NM" },
  { code: "NY", name: "New York", abbr: "NY" },
  { code: "NC", name: "North Carolina", abbr: "NC" },
  { code: "ND", name: "North Dakota", abbr: "ND" },
  { code: "OH", name: "Ohio", abbr: "OH" },
  { code: "OK", name: "Oklahoma", abbr: "OK" },
  { code: "OR", name: "Oregon", abbr: "OR" },
  { code: "PA", name: "Pennsylvania", abbr: "PA" },
  { code: "RI", name: "Rhode Island", abbr: "RI" },
  { code: "SC", name: "South Carolina", abbr: "SC" },
  { code: "SD", name: "South Dakota", abbr: "SD" },
  { code: "TN", name: "Tennessee", abbr: "TN" },
  { code: "TX", name: "Texas", abbr: "TX" },
  { code: "UT", name: "Utah", abbr: "UT" },
  { code: "VT", name: "Vermont", abbr: "VT" },
  { code: "VA", name: "Virginia", abbr: "VA" },
  { code: "WA", name: "Washington", abbr: "WA" },
  { code: "WV", name: "West Virginia", abbr: "WV" },
  { code: "WI", name: "Wisconsin", abbr: "WI" },
  { code: "WY", name: "Wyoming", abbr: "WY" },
  { code: "DC", name: "District of Columbia", abbr: "DC" },
];

export const CANADA_PROVINCES = [
  { code: "AB", name: "Alberta", abbr: "AB" },
  { code: "BC", name: "British Columbia", abbr: "BC" },
  { code: "MB", name: "Manitoba", abbr: "MB" },
  { code: "NB", name: "New Brunswick", abbr: "NB" },
  { code: "NL", name: "Newfoundland and Labrador", abbr: "NL" },
  { code: "NS", name: "Nova Scotia", abbr: "NS" },
  { code: "ON", name: "Ontario", abbr: "ON" },
  { code: "PE", name: "Prince Edward Island", abbr: "PE" },
  { code: "QC", name: "Quebec", abbr: "QC" },
  { code: "SK", name: "Saskatchewan", abbr: "SK" },
  { code: "NT", name: "Northwest Territories", abbr: "NT" },
  { code: "NU", name: "Nunavut", abbr: "NU" },
  { code: "YT", name: "Yukon", abbr: "YT" },
];

export function getStateName(code: string): string {
  const state = US_STATES.find((s) => s.code === code);
  return state ? state.name : code;
}

export function getProvinceName(code: string): string {
  const province = CANADA_PROVINCES.find((p) => p.code === code);
  return province ? province.name : code;
}
