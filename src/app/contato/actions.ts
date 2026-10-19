"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
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

  const inquiry = await prisma.inquiry.create({
    data: {
      name,
      email,
      phone: phone || null,
      message: tripLine ? `Viagem: ${tripLine}\n\n${message}` : message,
    },
  });

  try {
    await sendInquiryEmail({
      name,
      email,
      phone,
      message,
      expeditionName: tripLine,
    });
    await prisma.inquiry.update({
      where: { id: inquiry.id },
      data: { emailStatus: "sent" },
    });
  } catch (error) {
    console.error("Falha ao enviar email de solicitação:", error);
    await prisma.inquiry.update({
      where: { id: inquiry.id },
      data: { emailStatus: "failed" },
    });
    return {
      status: "error",
      message:
        "Não foi possível enviar sua solicitação por email agora. Tente novamente em instantes ou escreva diretamente para o email de contato no rodapé da página.",
    };
  }

  return {
    status: "success",
    message: "Solicitação enviada! Nossa equipe responderá por email em breve.",
  };
}
