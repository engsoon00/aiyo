import logoMark from "@/assets/logo.png";

const SIZES = {
  default: { icon: "h-8", text: "text-xl" },
  sm: { icon: "h-7", text: "text-lg" },
} as const;

export function Logo({ size = "default" }: { size?: keyof typeof SIZES }) {
  const { icon, text } = SIZES[size];

  return (
    <span className="inline-flex items-center gap-2">
      <img src={logoMark} alt="" className={`w-auto ${icon}`} />
      <span className={`font-general-sans font-semibold tracking-tight text-foreground ${text}`}>
        Aiyo
      </span>
    </span>
  );
}
