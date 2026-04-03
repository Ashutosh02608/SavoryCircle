import { brandGradientClass } from "@/features/homepage/constants";

export default function BrandMark() {
  return (
    <span
      aria-hidden="true"
      className={`relative aspect-square w-8 rounded-xl ${brandGradientClass} shadow-[0_14px_34px_rgba(34,22,15,0.09)] after:absolute after:inset-[24%_28%] after:rounded-[60%_40%_55%_45%] after:bg-white/90 after:content-['']`}
    />
  );
}
