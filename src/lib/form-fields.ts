import type { Field } from "@/components/lead-form";

export const SEASONS = [
  "Esta temporada, 2026/27",
  "Próxima temporada, 2027/28",
  "2028/29",
  "Qualquer temporada, ou ainda não sei",
];

export const DEALS_OPTIN: Field = {
  type: "checkbox",
  label: "Também quero receber por email ofertas não publicadas das operadoras e vagas de última hora",
  hint: "Você pode cancelar quando quiser. Isso é separado da resposta ao seu pedido.",
};

export const TRIP_REQUEST_FIELDS: Field[] = [
  { type: "text", label: "Nome", required: true },
  { type: "text", label: "Sobrenome (opcional)" },
  { type: "email", label: "Email", required: true },
  { type: "tel", label: "Telefone (opcional)" },
  {
    type: "select",
    label: "Para onde você quer ir? (opcional)",
    options: [
      "Ainda não sei",
      "Antártica",
      "Península Antártica",
      "Ártico",
      "Travessia da Passagem de Drake",
      "Svalbard",
      "Geórgia do Sul",
      "Ilhas Malvinas",
      "Círculo Polar Antártico",
      "Islândia",
      "Spitsbergen",
      "Outro lugar",
    ],
  },
  {
    type: "select",
    label: "Quando? (opcional)",
    options: [
      "Tenho flexibilidade",
      "Antártica 2026/27",
      "Antártica 2027/28",
      "Antártica 2028/29",
      "Ártico 2026",
      "Ártico 2027",
      "Ártico 2028",
    ],
  },
  { type: "number", label: "Quantas pessoas? (opcional)" },
  { type: "textarea", label: "Algo mais que a gente deva saber? (opcional)" },
  DEALS_OPTIN,
];
