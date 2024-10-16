export interface NavLinkProps {
  path: string;
  label: string;
  options?: {
    href: string;
    label: string;
    description?: string;
    icon?: string;
  }[];
}

export interface BottomNavProps {
  path: string;
  svgContent: string;
  label: string;
  options?: {
    href: string;
    label: string;
    description?: string;
    icon?: string;
  }[];
}
