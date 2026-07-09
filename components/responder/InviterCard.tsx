import Image from "next/image";

interface InviterCardProps {
  name: string;
  phoneNumber?: string;
  email?: string;
  imageUrl?: string;
}

export default function InviterCard({
  name,
  phoneNumber,
  email,
  imageUrl,
}: InviterCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50 flex items-center gap-4 p-6">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-primary-dark/10 text-primary-dark flex h-full w-full items-center justify-center text-xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Invitation from
          </p>
          <p className="text-lg font-bold leading-tight text-primary-dark">
            {name}
          </p>
          {phoneNumber && (
            <p className="text-sm text-slate-500">{phoneNumber}</p>
          )}
          {!phoneNumber && email && (
            <p className="text-sm text-slate-500">{email}</p>
          )}
        </div>
      </div>
    </div>
  );
}
