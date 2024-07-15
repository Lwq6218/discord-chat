import { ActionTooltip } from '@/components/action-tooltiip';
import { useModal } from '@/hooks/use-modal-store';
import { ChannelType, MemberRole, Server } from '@/types';
import { Plus, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: 'channel' | 'member';
  channelType?: ChannelType;
  server?: Server;
}
const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === 'channel' && (
        <ActionTooltip label={t('Create Channel')} side="top">
          <button
            onClick={() => onOpen('createChannel', { channelType })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Plus className="size-4" />
          </button>
        </ActionTooltip>
      )}

      {role === MemberRole.ADMIN && sectionType === 'member' && (
        <ActionTooltip label={t('Manage Members')} side="top">
          <button
            onClick={() => onOpen('members', { server })}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Settings className="size-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
