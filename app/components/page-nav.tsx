import { NavLink } from "react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/faq", label: "FAQ" },
  { to: "/emergency-contacts", label: "Emergency Contacts" },
];

export default function PageNav() {
  return (
    <nav aria-label="Primary" className="flex flex-wrap gap-3">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:text-slate-900"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
