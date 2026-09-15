/**
 * Basic SHELL — what ships in the box (FOB China).
 * Taken from the supplier fittings + accessories lists (same kit on all three styles).
 * Do not put supplier model numbers on customer pages.
 */

export const SHELL_IN = [
  {
    group: "Structure",
    items: [
      "Steel container frames — hot-dip galvanized, 3 mm, factory-welded",
      "Floor: steel + 18 mm fiber-cement board + PVC floor (anti-slip in the bath)",
      "Roof: steel + 70 mm injected PU insulation + colour steel both sides",
      "Columns and PVC downpipes",
      "Exterior sandwich wall panels (75 mm)",
      "Interior sandwich wall panels (50 mm)",
      "Steel entry door, interior doors, aluminium toilet door",
      "Windows as designed (PVC / aluminium)",
      "Pitch roof, gutters, flashing; porch railing where the style has a porch",
      "Interior moldings — skirting, top and corner strips",
      "Connection hardware — bolts, rubber strips, trims",
    ],
  },
  {
    group: "House electrical (in the box)",
    items: [
      "LED lights, switches and sockets",
      "Distribution box",
      "PVC conduit and cable prefabricated in roof and wall panels",
      "Outdoor power-connection socket",
    ],
  },
  {
    group: "Kitchen (in the shell)",
    items: [
      "Kitchen cabinet with stainless-steel sink and faucet",
      "Bathroom-side plumbing for the wet rooms",
    ],
  },
  {
    group: "Bath (in the shell)",
    items: [
      "Ceramic toilet",
      "Porcelain wash-basin with cabinet and mirror",
      "Glass shower cube — tray, mixer, sprayer, drainage",
      "Inlet and outlet pipework for the bathroom",
    ],
  },
] as const;

export const SHELL_OUT = [
  {
    group: "Not in the shell — Belize BOQ add-ons",
    items: [
      "Split air conditioner (04.01)",
      "Rooftop solar PV, inverter, rails (04.02–04.04) — no battery",
      "Range / cooktop and refrigerator (08.01) — gas stove is optional at the supplier and is not in this price",
      "Interior make-good paint, extra floor finish, extra house lights (Div 07)",
      "Furniture / FF&E (Div 10)",
      "Concrete slab, excavation, hurricane ties, crane (Div 03)",
      "Module assembly labour on the pad (11.01) — quoted hours, not in the FOB shell price",
      "Ocean freight and Belize inland (off on Homes only — FOB China port)",
      "Village roads, village power, potable water, WWTP, plaza, trees, gate",
    ],
  },
] as const;

export const SHELL_BLURB =
  "The basic shell is the finished-ready box as it leaves China: structure, walls, roof, doors, windows, house electrics, kitchen cabinet + sink, toilet, wash-basin and shower. It is unfurnished. It is not a bare empty container. Split air, solar, range, fridge, furniture, pads and village works are Belize add-ons.";

/** So flooring / paint / lighting are not double-counted. */
export const FACTORY_VS_LOCAL = {
  factory: [
    "Steel structure, insulated roof, walls, doors, windows",
    "Factory PVC floor + bath anti-slip; factory wall panels",
    "Prefabricated house lights, switches, sockets, distribution box",
    "Kitchen cabinet, sink, faucet",
    "Toilet, wash-basin, glass shower, bathroom pipework",
    "Interior doors and moldings as shipped",
  ],
  belize: [
    "Slab, hurricane ties, crane, Div 11.01 assembly on the pad",
    "Split air (04.01) and rooftop solar equipment + estimated install",
    "House water/sewer laterals and extra consumer-unit hookup",
    "Interior make-good: extra floor finish, paint, ceiling, kitchen (Div 07)",
    "Extra house LED allowance (07.06) beyond the factory lights",
    "Range + refrigerator (08.01). Furniture if FF&E is taken.",
  ],
} as const;
