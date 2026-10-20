"use server";

import { z } from "zod";
import { sendInquiryEmail } from "@/lib/mail";
import type { ContactFormState } from "./contact-form-state";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo."),
  email: z.string().trim().email("Informe um email válido."),
  phone: z.string().trim().optional(),
  tripLabel: z.string().trim().max(400).optional(),
  tripSlug: z.string().trim().regex(/^[a-z0-9-]+$/).max(200).optional(),
  message: z.string().trim().min(10, "Conte um pouco mais sobre o que você procura."),
});

export async function submitInquiry(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validated = inquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    tripLabel: formData.get("tripLabel") ?? undefined,
    tripSlug: formData.get("tripSlug") ?? undefined,
    message: formData.get("message"),
  });

  if (!validated.success) {
    return {
      status: "error",
      message: "Verifique os campos destacados abaixo.",
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, tripLabel, tripSlug, message } = validated.data;
  const tripLine = tripLabel
    ? `${tripLabel}${tripSlug ? ` (https://letsgopolar.com/all-trips/${tripSlug}/)` : ""}`
    : undefined;

  try {
    await sendInquiryEmail({
      name,
      email,
      phone,
      message,
      expeditionName: tripLine,
    });
  } catch (error) {
    // Sem banco de dados, o email é o único registro do pedido. Se ele falhar,
    // a pessoa precisa saber para escrever direto.
    console.error("Falha ao enviar email de solicitação:", error);
    return {
      status: "error",
      message:
        "Não foi possível enviar sua solicitação agora. Tente de novo em instantes ou escreva direto para contato@destinospolares.com.br.",
    };
  }

  return {
    status: "success",
    message: "Solicitação enviada! Nossa equipe responderá por email em breve.",
  };
}
