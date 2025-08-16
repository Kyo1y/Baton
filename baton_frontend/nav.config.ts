export type NavLink = { label: string, href: string, external?: boolean }

export const NAV_PUBLIC: NavLink[] = [
    { label:'Home', href: '/' },
    { label:'How It Works', href: '/howitworks' }
];

export const NAV_AUTH: NavLink[] = [
    { label:'Transfer', href:'/transfer' },
    { label:'Dashboard', href:'/dashboard' }
];

export function buildNav({ isAuthed }: { isAuthed: boolean }) {
  return isAuthed ? [...NAV_PUBLIC, ...NAV_AUTH] : NAV_PUBLIC;
}