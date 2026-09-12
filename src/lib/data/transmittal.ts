/** Formal addressee for the CASA 100 government submission. */
export const TRANSMITTAL = {
  date: "12 September 2026",
  ref: "KDK-CASA-100 / BEL-OPM-2026-09",
  subject:
    "CASA 100 — Proposal to supply and install one hundred finished-ready modular homes",
  from: {
    company: "KDK Technology Ltd",
    principal: "Gary Kellmann",
    title: "Principal",
    footprint: "Hong Kong · Shanghai · San Luis Potosí",
  },
  to: {
    name: "Mr. Ian Courtenay",
    title: "Senior Investment & E-Governance Officer",
    office: "Office of the Prime Minister",
    building: "Sir Edney Cain Building",
    floor: "3rd Floor, Left Wing",
    compound: "Government Offices",
    city: "Belmopan",
    district: "Cayo District",
    country: "Belize, Central America",
  },
  finance: {
    minister: "Hon. John Briceño",
    ministerTitle:
      "Prime Minister and Minister of Finance, Investment, Economic Transformation, Civil Aviation & E-Governance",
    building: "Sir Edney Cain Building",
    floor: "3rd Floor, Right Wing",
    office: "Ministry of Finance",
    city: "Belmopan City",
    phone: "+501 822-2362",
    email: "info@mof.gov.bz",
    hours: "Mon–Thu 8:00 am–5:00 pm · Fri 8:00 am–4:30 pm",
    web: "https://mof.gov.bz",
  },
  opm: {
    phone: "+501 828-4180 / 828-4182",
    switchboard: "+501 822-2345 / 2346",
    emailCeo: "ceo@opm.gov.bz",
    emailSecretary: "secretarypm@opm.gov.bz",
    emailEgov: "info@egov.gov.bz",
  },
  copies: [
    "Hon. John Briceño, Prime Minister and Minister of Finance, Investment, Economic Transformation, Civil Aviation & E-Governance",
    "Mr. Joseph Waight, Financial Secretary, Ministry of Finance",
    "Mrs. Narda Garcia, Chief Executive Officer, Office of the Prime Minister",
  ],
} as const;

export function mailingBlock() {
  const t = TRANSMITTAL.to;
  return [
    t.name,
    t.title,
    t.office,
    t.floor,
    `${t.building}, ${t.compound}`,
    `${t.city}, ${t.district}`,
    t.country,
  ].join("\n");
}

export function financeMailingBlock() {
  const f = TRANSMITTAL.finance;
  return [
    f.office,
    f.floor,
    `${f.building}, Government Offices`,
    `${f.city}, Cayo District`,
    "Belize, Central America",
  ].join("\n");
}
