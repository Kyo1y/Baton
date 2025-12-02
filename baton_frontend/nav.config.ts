export type NavLink = { label: string, href: string, external?: boolean }

export const NAV_PUBLIC: NavLink[] = [
    { label:'Home', href: '/' },
    { label:'About', href: '/about' },
    { label:'Contact', href: '/contact' },
    { label:'Status', href: '/status' },
    { label:'Sign in', href: ''}
];

export const NAV_AUTH: NavLink[] = [
    { label:'Home', href: '/' },
    { label:'Transfer', href:'/transfer' },
    { label:'Dashboard', href:'/dashboard' },
    { label:'Profile', href:'/user-info'},
    { label:'About', href: '/about' },
    { label:'Contact', href: '/contact' },
    { label:'Status', href: '/status' },
];

export function buildNav({ isAuthed }: { isAuthed: boolean }) {
  return isAuthed ? NAV_AUTH : NAV_PUBLIC;
}