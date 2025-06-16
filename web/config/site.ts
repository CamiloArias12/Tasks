export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "TODO",
  description: "Todo App",
  navItems: [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Proyectos",
      href: "/dashboard/projects",
    },
    {
      label: "Usuarios",
      href: "/dashboard/users",
    },
    {
      label: "Tareas",
      href: "/dashboard/tasks",
    },
  ]

};
