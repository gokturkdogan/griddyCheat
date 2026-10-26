import Link from "next/link";

type Props = {
  title: string;
  description: string;
};

export function ModulePlaceholder({ title, description }: Props) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">{title}</h1>
      <p className="mt-3 text-pitch-line/80">{description}</p>
      <p className="mt-6 text-sm text-pitch-line/55">
        Bu mod için içerik yakında eklenecek.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex text-sm font-medium text-gold hover:underline"
      >
        Anasayfaya dön
      </Link>
    </div>
  );
}
