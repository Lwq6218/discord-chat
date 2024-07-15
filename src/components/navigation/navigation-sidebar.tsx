import LanguageToggle from '@/components/language-toggle';
import { ModeToggle } from '@/components/mode-toogle';
import NavigationAction from '@/components/navigation/navigation-action';
import NavigationIcon from '@/components/navigation/navigation-icon';
import NavigationItem from '@/components/navigation/navigation-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { listServers } from '@/services/api/server';
import { useQuery } from '@tanstack/react-query';

export default function NavigationSideBar() {
  const { data: servers } = useQuery({
    queryKey: ['servers'],
    queryFn: listServers,
  });
  return (
    <div className="text-primary flex size-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 dark:bg-[#1E1F22]">
      <NavigationIcon />

      <Separator className="mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700" />

      <ScrollArea className="w-full flex-1">
        {servers?.map((server) => (
          <NavigationItem
            key={server.id}
            id={server.id}
            imageUrl={server.imageUrl}
            name={server.name}
          />
        ))}
        <NavigationAction />
      </ScrollArea>

      <div className="flex flex-col items-center gap-y-4 pb-3">
        <LanguageToggle />
        <ModeToggle />
      </div>
    </div>
  );
}
