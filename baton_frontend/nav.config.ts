export type NavLink = { label: string, href: string, category?: string, external?: boolean }

export const NAV_PUBLIC: NavLink[] = [
    { label:'Home', href: '/' },
    { label:'About', href: '/about', category: "project" },
    { label:'Contact', href: '/contact', category: "support" },
    { label:'Sign in', href: ''}
];

export const NAV_AUTH: NavLink[] = [
    { label:'Home', href: '/' },
    { label:'Transfer', href:'/transfer' },
    { label:'Dashboard', href:'/dashboard', category:"product" },
    { label:'Profile', href:'/user-info' },
    { label:'About', href: '/about', category: "project" },
    { label:'Contact', href: '/contact', category: "support" },
];

export function buildNav({ isAuthed }: { isAuthed: boolean }) {
  return isAuthed ? NAV_AUTH : NAV_PUBLIC;
}