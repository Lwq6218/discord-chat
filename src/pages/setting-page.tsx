import { SidebarNav } from '@/components/setting/setting-sidebar';
import { Separator } from '@/components/ui/separator';
import { Outlet } from 'react-router-dom';

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/settings/profile',
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
  },
];

export default function SettingPage() {
  return (
    <>
      <div className="h-screen space-y-6 p-6">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex h-full flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
