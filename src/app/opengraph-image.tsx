import { OG_SIZE, siteImage } from "@/lib/og";

export const alt = "MSALEH: Business runs on systems. I build them. Mohamed Saleh, systems developer in Giza.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return siteImage();
}
