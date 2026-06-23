import Image from "next/image";

interface InviterCardProps {
  name: string;
  phoneNumber: string;
  imageUrl: string;
}

export default function InviterCard({
  name,
  phoneNumber,
  imageUrl,
}: InviterCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50 flex items-center gap-4 p-6">
        <div className="relative size-14 overflow-hidden rounded-full border-2 border-white shadow-sm">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Invitation from
          </p>
          <p className="text-lg font-bold leading-tight text-primary-dark">
            {name}
          </p>
          <p className="text-sm text-slate-500">{phoneNumber}</p>
        </div>
      </div>
    </div>
  );
}
