import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("faq", "routes/faq.tsx"),
  route("emergency-contacts", "routes/emergency-contacts.tsx"),
] satisfies RouteConfig;
