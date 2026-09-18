import {
  Clapperboard,
  Heart,
  House,
  MapPin,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

export interface SidebarItem {
  href: string;
  label: 'home' | 'episodes' | 'characters' | 'locations' | 'favorites';
  icon: LucideIcon;
}

export const sidebarItems: SidebarItem[] = [
  { href: '/dashboard', label: 'home', icon: House },
  { href: '/episodes', label: 'episodes', icon: Clapperboard },
  { href: '/characters', label: 'characters', icon: UsersRound },
  { href: '/locations', label: 'locations', icon: MapPin },
  { href: '/favorites', label: 'favorites', icon: Heart },
];
