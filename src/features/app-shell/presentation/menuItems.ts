export type AppMenuAction = "home" | "search" | "noop" | "sign-out";

export type AppMenuItem = {
  id: string;
  label: string;
  ionicon: string;
  action: AppMenuAction;
};

export const menuItems: readonly AppMenuItem[] = [
  { id: "home", label: "Inicio", ionicon: "home-outline", action: "home" },
  { id: "search", label: "Búsqueda", ionicon: "search-outline", action: "search" },
  {
    id: "profile",
    label: "Mi perfil",
    ionicon: "person-outline",
    action: "noop",
  },
  { id: "history", label: "Historial", ionicon: "time-outline", action: "noop" },
  {
    id: "settings",
    label: "Configuración",
    ionicon: "open-outline",
    action: "noop",
  },
];
