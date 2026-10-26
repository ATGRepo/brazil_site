import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error(
      "Configuração de SMTP ausente. Defina SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASSWORD."
    );
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export type InquiryEmailInput = {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  expeditionName?: string | null;
};

export async function sendInquiryEmail(input: InquiryEmailInput) {
  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    throw new Error("CONTACT_EMAIL não configurado.");
  }

  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;

  const lines = [
    `Nome: ${input.name}`,
    `Email: ${input.email}`,
    input.phone ? `Telefone: ${input.phone}` : null,
    input.expeditionName ? `Viagem de interesse: ${input.expeditionName}` : null,
    "",
    "Mensagem:",
    input.message,
  ].filter(Boolean);

  await getTransporter().sendMail({
    from,
    to,
    replyTo: input.email,
    subject: `Nova solicitação de informações — ${input.name}`,
    text: lines.join("\n"),
  });
}
