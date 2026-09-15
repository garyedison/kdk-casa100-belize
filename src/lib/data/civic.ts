/** Civic extras — optional. Not in Installed homes. Not in Turnkey village. */

export const CIVIC_LINES = [
  {
    item: "09.05",
    label: "Civic plaza + pavilion (community hall)",
    amount: 185_000,
    image: "/civic/plaza.jpg",
  },
  {
    item: "09.04",
    label: "Perimeter fence + village gatehouse",
    amount: 140_000,
    image: "/civic/gatehouse.jpg",
  },
  {
    item: "09.06",
    label: "Street trees, lot grassing, civic green",
    amount: 95_000,
    image: "/civic/plaza.jpg",
  },
  {
    item: "05.05",
    label: "Pavilion + gatehouse electrical",
    amount: 42_000,
    image: "/civic/pavilion.jpg",
  },
] as const;

export const CIVIC_TOTAL = CIVIC_LINES.reduce((s, l) => s + l.amount, 0);

export const PLAZA_INCLUDES = [
  "One open-air, single-storey pavilion at the village crossroads (community hall)",
  "Covered gathering floor — cream columns, charcoal metal roof, raised concrete pad",
  "Gravel and paver plaza around the pavilion",
  "Civic lawn and young trees at the green",
  "Simple timber benches / picnic tables (village seating — not house furniture)",
  "Community notice board, LED lights, ceiling fans",
  "Power to the pavilion and gatehouse (item 05.05)",
];

export const PLAZA_EXCLUDES = [
  "Two-storey hall, air-conditioned auditorium, or commercial kitchen",
  "Sports court, playground equipment, church, or shops",
  "House furniture (beds, sofas, dining) — that is FF&E, not civic",
  "Village roads, potable water, WWTP (sewage plant), or power to the 100 lots",
];

export const UNFURNISHED = {
  means:
    "Installed homes unfurnished = the 100 homes have no furniture, and there is no village civil. No roads, village power, water mains or WWTP in that price. Plaza, trees and gate are civic extras — also not in Turnkey village.",
  stillIn: [
    "The container homes, ocean + inland when those packages are on",
    "Pads, set, house MEP, rooftop solar equipment (no battery)",
    "Interior make-good (paint, floors) and range + refrigerator",
  ],
  notIn: [
    "Village roads, village power to the lots, potable water mains",
    "WWTP (wastewater treatment plant / shared sewage plant)",
    "Street trees, plaza, pavilion, gatehouse — see this page; add as civic extras",
    "Furniture / FF&E — take Furnished homes to add it",
    "Battery storage",
    "Solar install labour hours (ESTIMATED). Module assembly hours are in Div 11.01.",
  ],
};

export const CIVIC_IMAGES = [
  {
    src: "/civic/plaza.jpg",
    alt: "Open-air civic pavilion and gravel plaza at the village crossroads",
    caption: "Plaza + pavilion — conceptual rendering. Single-storey open hall, not a hotel.",
  },
  {
    src: "/civic/pavilion.jpg",
    alt: "Interior of the open-air community pavilion",
    caption: "Under the pavilion — benches, fans, notice board. Community hall, not an event venue.",
  },
  {
    src: "/civic/gatehouse.jpg",
    alt: "Village gatehouse and perimeter fence at the entrance",
    caption: "Gatehouse + fence — staffed entry booth, not a mantrap.",
  },
] as const;
