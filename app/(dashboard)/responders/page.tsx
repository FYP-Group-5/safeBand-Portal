import {
  ArrowLeft,
  Phone,
  Mail,
  Edit,
  Trash2,
  Info,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { AddResponderButton } from "../components/AddResponderButton";

export default function RespondersPage() {
  const responders = [
    {
      id: 1,
      name: "Jane Doe",
      relationship: "Mother",
      contact: "+1 (555) 012-3456",
      contactType: "phone",
      status: "verified",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBgLF9Ece_EyjtszoGOU10OQ4CBj0VKsqJ4v6XcRBQmw_CpJuOCc30m32JnDJCuEuGAQHd1dez81Kb129MowkG3oHDg8J0Bc1hx0rq1PrW2bofpYl9HAuxJnWoG2j6kKuDRGjSJl54ttX6ikMEX4Oag-e9Gk-J89NfHRsG4hAl8Dhn8zfP9I-OX-DKy3uH9JBAbb4c343qJzmOTaDnGVE7jjdxeMmnwXREV686IKyoK5XMgfgrM-VB6BeoW059lfhINnIfSoAqmOA",
    },
    {
      id: 2,
      name: "Mark Wilson",
      relationship: "Friend",
      contact: "mark.w@example.com",
      contactType: "email",
      status: "pending",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBDqklr-656JwZ7ANfmdDv8fCaTvL6BsvWVYr30YtWCc2AaGRLKRbtQjJEdk7nA9E9G5vRLTLUO2qtfN0lUd98zOrtCIZo6mkdD849VOU0SSJiIITM_72T3bmIb03eBIrBKXkcgt8kkCZMuJ9oCokEIewLISdtm5dzIHnU-CMjUg0_GV7wWMpZF62PRdslB4bycG0Yz9ItTCPG6aO5i1kEoCNBxwcSwlrfTWwmpI2RkrcgMT8FeA9mDwIPPtwPze0TvZa_x6556kQ",
    },
    {
      id: 3,
      name: "Sarah Chen",
      relationship: "Partner",
      contact: "+1 (555) 987-6543",
      contactType: "phone",
      status: "verified",
      initials: "SC",
    },
  ];

  return (
    <section className="bg-background-light relative flex min-h-screen w-full flex-col pb-20 md:pb-0">
      {/* Top Navigation Bar */}
      <header className="border-primary-dark/10 flex items-center justify-between border-b bg-white px-6 py-4 md:px-10 lg:px-40">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <button className="text-primary-dark hover:bg-primary-dark/5 flex h-10 w-10 items-center justify-center rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <h1 className="text-primary-dark text-xl font-bold tracking-tight">
            Responders
          </h1>
        </div>
        <div className="hidden md:block">
          <AddResponderButton />
        </div>
      </header>

      <main className="flex flex-1 justify-center px-4 py-8 md:px-10 lg:px-40">
        <div className="flex max-w-240 flex-1 flex-col gap-6">
          {/* Mobile Add Button */}
          <div className="md:hidden">
            <AddResponderButton />
          </div>

          {/* List Header */}
          <div className="flex flex-wrap items-end justify-between gap-2.5 px-2">
            <div>
              <h2 className="text-primary-dark text-2xl font-bold">
                Active Network
              </h2>
              <p className="text-sm text-slate-500">
                People who will be notified in case of emergency.
              </p>
            </div>
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              {responders.length} Total
            </span>
          </div>

          {/* Responder Cards List */}
          <div className="flex flex-col gap-4">
            {responders.map((responder) => (
              <div
                key={responder.id}
                className="border-primary-dark/5 flex flex-col items-center justify-between gap-4 rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:flex-row"
              >
                <div className="flex w-full items-center gap-4 md:w-auto">
                  <div className="bg-primary-dark/10 relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                    {responder.image ? (
                      <img
                        alt={`${responder.name} profile photo`}
                        className="h-full w-full object-cover"
                        src={responder.image}
                      />
                    ) : (
                      <div className="text-primary-dark flex h-full w-full items-center justify-center text-xl font-bold">
                        {responder.initials}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="text-primary-dark text-lg font-bold">
                        {responder.name}
                      </h3>
                      {responder.status === "verified" ? (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700 uppercase">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-700 uppercase">
                          <Clock className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      {responder.relationship}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      {responder.contactType === "phone" ? (
                        <Phone className="h-3.5 w-3.5" />
                      ) : (
                        <Mail className="h-3.5 w-3.5" />
                      )}
                      {responder.contact}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-end gap-2 md:w-auto">
                  <button className="text-primary-dark bg-primary-dark/5 hover:bg-primary-dark/10 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors">
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50"
                    title="Remove Responder"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Information Section */}
          <div className="border-primary-dark/10 bg-primary-dark/5 mt-4 rounded-xl border p-6">
            <div className="flex items-start gap-4">
              <Info className="text-primary-dark mt-1 h-6 w-6 shrink-0" />
              <div className="flex flex-col gap-1">
                <h4 className="text-primary-dark text-sm font-bold">
                  About Responders
                </h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  Responders are your trusted contacts who will receive your
                  location and an SOS alert when your SafeBand is triggered. We
                  recommend having at least 2 verified responders.
                </p>
                <button className="text-primary-dark mt-2 w-fit text-sm font-bold hover:underline">
                  Learn more about verification
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
