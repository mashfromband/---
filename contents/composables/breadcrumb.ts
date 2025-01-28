
export interface BreadcrumbLinkItem {
  to?: string;
  icon?: string;
  label?: string;
}

export const ProfileBreadcrumbLinkItems: BreadcrumbLinkItem[] = [
{
  to: "/home",
  icon: "i-heroicons-home-20-solid",
},
{
  label: "プロフィール",
},
];
