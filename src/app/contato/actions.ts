"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendInquiryEmail } from "@/lib/mail";
import type { ContactFormState } from "./contact-form-state";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo."),
  email: z.string().trim().email("Informe um email válido."),
  phone: z.string().trim().optional(),
  expeditionId: z.string().trim().optional(),
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
    expeditionId: formData.get("expeditionId"),
    message: formData.get("message"),
  });

  if (!validated.success) {
    return {
      status: "error",
      message: "Verifique os campos destacados abaixo.",
      fieldErrors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, email, phone, expeditionId, message } = validated.data;

  const expedition = expeditionId
    ? await prisma.expedition.findUnique({ where: { id: expeditionId } })
    : null;

  const inquiry = await prisma.inquiry.create({
    data: {
      name,
      email,
      phone: phone || null,
      message,
      expeditionId: expedition?.id ?? null,
    },
  });

  try {
    await sendInquiryEmail({
      name,
      email,
      phone,
      message,
      expeditionName: expedition?.name,
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
