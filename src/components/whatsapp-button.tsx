// Botão fixo no canto da tela que abre uma conversa no WhatsApp do Destinos Polares.

const WHATSAPP_NUMBER = "5541988203015";
const WHATSAPP_TEXT = "Olá! Vim pelo site Destinos Polares.";

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale com a gente pelo WhatsApp"
      title="Fale com a gente pelo WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
    >
      <svg viewBox="0 0 32 32" className="h-8 w-8" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3C8.828 3 3.01 8.817 3.01 15.992c0 2.29.6 4.528 1.74 6.5L3 29l6.68-1.72a12.95 12.95 0 0 0 6.32 1.62h.005c7.175 0 12.993-5.818 12.993-12.993C28.998 8.817 23.18 3 16.004 3Zm0 23.73h-.004a10.77 10.77 0 0 1-5.49-1.503l-.394-.234-3.965 1.02 1.058-3.865-.257-.397a10.74 10.74 0 0 1-1.65-5.759c0-5.94 4.835-10.773 10.778-10.773 5.94 0 10.773 4.834 10.773 10.776 0 5.94-4.834 10.735-10.85 10.735Zm5.907-8.066c-.324-.162-1.916-.946-2.213-1.054-.297-.108-.513-.162-.729.162-.216.324-.837 1.054-1.026 1.27-.189.216-.378.243-.702.081-.324-.162-1.368-.504-2.605-1.608-.963-.859-1.613-1.92-1.802-2.244-.189-.324-.02-.499.142-.66.146-.145.324-.378.486-.567.162-.189.216-.324.324-.54.108-.216.054-.405-.027-.567-.081-.162-.729-1.757-.999-2.405-.263-.632-.53-.546-.729-.556l-.621-.011a1.19 1.19 0 0 0-.864.405c-.297.324-1.134 1.108-1.134 2.702 0 1.595 1.161 3.135 1.323 3.351.162.216 2.285 3.49 5.536 4.893.774.334 1.378.534 1.849.683.777.247 1.484.212 2.043.129.623-.093 1.916-.783 2.186-1.54.27-.756.27-1.404.189-1.54-.081-.135-.297-.216-.621-.378Z" />
      </svg>
    </a>
  );
}
