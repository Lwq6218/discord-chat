import { ActionTooltip } from '@/components/action-tooltiip';
import { ModalType, useModal } from '@/hooks/use-modal-store';
import { cn } from '@/lib/utils';
import { Channel, ChannelType, MemberRole, Server } from '@/types';
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};
const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const { onOpen } = useModal();
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const Icon = iconMap[channel.type];

  const onHandleClick = () => {
    navigate(`/servers/${params?.serverId}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { server, channel });
  };
  return (
    <button
      onClick={onHandleClick}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        params?.channelId === channel.id &&
          'text-primary dark:bg-zinc-700/20 dark:group-hover:bg-zinc-700'
      )}
    >
      <Icon className="size-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          'line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          params?.channelId === channel.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {channel.name === 'general' ? t('general') : channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label={t('Edit')}>
            <Edit
              onClick={(e) => onAction(e, 'editChannel')}
              className="hidden size-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>

          <ActionTooltip label={t('Delete')}>
            <Trash
              onClick={(e) => onAction(e, 'deleteChannel')}
              className="hidden size-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock className="ml-auto size-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  );
};

export default ServerChannel;
