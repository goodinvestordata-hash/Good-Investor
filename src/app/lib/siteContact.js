/** Same number as contact / compliance pages (India, full MSISDN for wa.me). */
export const WHATSAPP_PHONE_DIGITS = "919704648777";

export const SITE_PHONE_DISPLAY = "+91 9704648777";

export function whatsappUrl(prefillMessage = "") {
  const base = `https://wa.me/${WHATSAPP_PHONE_DIGITS}`;
  const t = String(prefillMessage || "").trim();
  if (!t) return base;
  return `${base}?text=${encodeURIComponent(t)}`;
}
