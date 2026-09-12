import Link from "next/link";
import type { ReactNode } from "react";

export default function AccountShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="bg-[#f7f7f5] py-12 md:py-20">
      <div className="mx-auto grid max-w-frame overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-sm lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex min-h-[260px] flex-col justify-between bg-black p-7 text-white md:p-10 lg:min-h-[620px]">
          <Link href="/" className="text-xl font-bold tracking-[-0.04em]">
            MYZIA
          </Link>
          <div className="max-w-sm">
            <p className="mb-4 text-sm uppercase tracking-[0.22em] text-white/60">
              {eyebrow}
            </p>
            <h1 className="text-4xl font-bold leading-none tracking-[-0.05em] md:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/65 md:text-base">
              {description}
            </p>
          </div>
          <p className="hidden text-xs uppercase tracking-[0.18em] text-white/45 lg:block">
            Fragrance, made personal.
          </p>
        </div>
        <div className="p-6 md:p-10 lg:p-14">
          <div className="mx-auto max-w-[520px]">{children}</div>
          <div className="mx-auto mt-8 max-w-[520px] text-center text-sm text-black/55">
            {footer}
          </div>
        </div>
      </div>
    </main>
  );
}
