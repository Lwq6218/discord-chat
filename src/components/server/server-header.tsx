import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useModal } from '@/hooks/use-modal-store';
import { MemberRole, Server } from '@/types';
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ServerHeaderProps {
  server: Server;
  role?: MemberRole;
}
const ServerHeader = ({ role, server }: ServerHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  const { t } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">
          {server.name}
          <ChevronDown className="ml-auto size-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 space-y-[4px] text-xs font-medium text-black dark:text-neutral-400">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen('invite', { server })}
            className="cursor-pointer px-3 py-2 text-sm text-indigo-600 dark:to-indigo-400"
          >
            {t('Invite People')}
            <UserPlus className="ml-auto size-4" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('editServer', { server })}
            className="cursor-pointer px-3 py-2 text-sm"
          >
            {t('Server Settings')}

            <Settings className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('members', { server })}
            className="cursor-pointer px-3 py-2 text-sm"
          >
            {t('Manage Members')}
            <Users className="ml-auto size-4" />
          </DropdownMenuItem>
        )}

        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen('createChannel', { server })}
            className="cursor-pointer px-3 py-2 text-sm"
          >
            {t('Create Channel')}
            <PlusCircle className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('deleteServer', { server })}
            className="cursor-pointer px-3 py-2 text-sm text-rose-500"
          >
            {t('Delete Server')}

            <Trash className="ml-auto size-4" />
          </DropdownMenuItem>
        )}

        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('leaveServer', { server })}
            className="cursor-pointer px-3 py-2 text-sm text-rose-500"
          >
            {t('Leave Server')}

            <LogOut className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
