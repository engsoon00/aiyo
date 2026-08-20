import type { Template } from "./types";

/**
 * Ready-made real-world processes. These are the "template matching" target
 * for the understanding layer, and they double as the landing page's use-case
 * content so the marketing site and the app can never drift apart.
 */
export const TEMPLATES: Template[] = [
  {
    id: "bank-visit",
    title: "Bank Visit",
    description: "Updating details or sorting something out at a branch.",
    category: "finance",
    example: "I need to update my phone number at the bank.",
    preparation: [
      { label: "ID Card", hint: "Original, not a photocopy" },
      { label: "Bank Card" },
      { label: "Current Phone", hint: "For the verification SMS" },
    ],
    steps: [
      "Check branch opening hours",
      "Visit branch",
      "Take queue number",
      "Request phone number update",
      "Complete verification",
      "Confirm new number",
    ],
  },
  {
    id: "send-parcel",
    title: "Send a Parcel",
    description: "Getting something packed, addressed and dropped off.",
    category: "delivery",
    example: "I need to send a parcel to Penang.",
    preparation: [
      { label: "Item packed", hint: "Box, filler, tape" },
      { label: "Recipient address" },
      { label: "Recipient phone number" },
      { label: "Payment method" },
    ],
    steps: [
      "Weigh and measure the parcel",
      "Compare courier rates",
      "Write or print the address label",
      "Seal the parcel",
      "Drop off at the counter",
      "Save the tracking number",
    ],
  },
  {
    id: "buy-medicine",
    title: "Buy Medicine",
    description: "Picking up a prescription or over-the-counter medicine.",
    category: "health",
    example: "I need to buy medicine from the pharmacy.",
    preparation: [
      { label: "Medicine name", hint: "Photo of the box helps" },
      { label: "Prescription", hint: "If it's a controlled medicine" },
      { label: "ID Card", hint: "Some pharmacies ask" },
    ],
    steps: [
      "Confirm the exact medicine and dosage",
      "Check pharmacy opening hours",
      "Go to the pharmacy",
      "Hand over the prescription",
      "Check the expiry date before leaving",
      "Confirm how and when to take it",
    ],
  },
  {
    id: "home-repair",
    title: "Home Repair",
    description: "Getting something fixed by a technician.",
    category: "home",
    example: "My kitchen pipe is leaking.",
    preparation: [
      { label: "Photos of the problem" },
      { label: "Location details", hint: "Which room, how long it's been" },
      { label: "Availability window" },
    ],
    steps: [
      "Shut off water or power if needed",
      "Take photos of the problem",
      "Contact a technician",
      "Agree on a time and rough cost",
      "Be available for the visit",
      "Test the repair before paying",
    ],
  },
  {
    id: "pay-bill",
    title: "Pay a Bill",
    description: "Finding, checking and settling a bill on time.",
    category: "payments",
    example: "I need to pay my electricity bill.",
    preparation: [
      { label: "Bill or account number" },
      { label: "Amount due" },
      { label: "Payment method" },
    ],
    steps: [
      "Find the latest bill",
      "Check the amount and due date",
      "Choose how to pay",
      "Make the payment",
      "Save the receipt",
      "Mark it done",
    ],
  },
  {
    id: "clinic-appointment",
    title: "Clinic Appointment",
    description: "Turning up prepared and on time.",
    category: "appointments",
    example: "I have a clinic appointment tomorrow.",
    preparation: [
      { label: "Appointment details", hint: "Time, doctor, room" },
      { label: "ID Card" },
      { label: "Insurance or panel card" },
      { label: "Previous reports", hint: "If it's a follow-up" },
    ],
    steps: [
      "Confirm the appointment",
      "Check travel time",
      "Bring documents and cards",
      "Register at the counter",
      "See the doctor",
      "Collect medicine or the next appointment",
    ],
  },
  {
    id: "renew-passport",
    title: "Renew Passport",
    description: "A government counter visit that rewards preparation.",
    category: "government",
    example: "I need to renew my passport.",
    preparation: [
      { label: "Current passport" },
      { label: "ID Card" },
      { label: "Payment method" },
      { label: "Photo", hint: "Only if the counter doesn't take one" },
    ],
    steps: [
      "Check renewal requirements",
      "Book an appointment slot if available",
      "Prepare documents",
      "Go to the office",
      "Submit and pay",
      "Collect or arrange delivery",
    ],
  },
  {
    id: "replace-document",
    title: "Replace a Document",
    description: "Reporting and replacing something lost or damaged.",
    category: "documents",
    example: "I lost my driving licence and need a replacement.",
    preparation: [
      { label: "Police report", hint: "If it was lost or stolen" },
      { label: "ID Card" },
      { label: "Supporting documents" },
      { label: "Payment method" },
    ],
    steps: [
      "Make a report if required",
      "Check what replacement needs",
      "Prepare documents",
      "Go to the counter",
      "Submit and pay",
      "Collect the replacement",
    ],
  },
];

export const templateById = (id: string | null | undefined) =>
  TEMPLATES.find((t) => t.id === id) ?? null;
