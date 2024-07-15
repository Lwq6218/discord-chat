import ServerChannel from '@/components/server/server-channel';
import ServerHeader from '@/components/server/server-header';
import ServerMember from '@/components/server/server-member';
import ServerSearch from '@/components/server/server-search';
import ServerSection from '@/components/server/server-section';
import StatusProfile from '@/components/status/status-profile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useActionSocket } from '@/hooks/use-action-socket';
import { useAuth } from '@/providers/auth-provider';
import { listChannelsByServerId } from '@/services/api/channel';
import { listMembersWithProfile } from '@/services/api/member';
import { getServerById } from '@/services/api/server';
import { ChannelType, MemberRole } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ServerSidebarProps {
  serverId: string | undefined;
}
const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 size-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 size-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 size-4" />,
};
const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 size-4 text-rose-500" />,
};

const ServerSidebar = ({ serverId }: ServerSidebarProps) => {
  const { uid } = useAuth();
  const { t } = useTranslation();
  const serverQuery = useQuery({
    queryKey: ['server', serverId],
    queryFn: () => getServerById(serverId),
  });
  const channelsQuery = useQuery({
    queryKey: ['channels', serverId],
    queryFn: () => listChannelsByServerId(serverId),
  });
  const membersQuery = useQuery({
    queryKey: ['members', serverId],
    queryFn: () => listMembersWithProfile(serverId),
  });
  const server = serverQuery.data;
  const channels = channelsQuery.data;
  const members = membersQuery.data;

  useActionSocket({
    memberAddKey: `server:${server?.inviteCode}:member:add`,
    memberLeaveKey: `server:${serverId}:member:leave`,
    memberUpdateKey: `server:${serverId}:member:update`,
  });

  if (!server) {
    return null;
  }

  const textChannels = channels?.filter(
    (channel) => channel.type === ChannelType.TEXT
  );

  const audioChannels = channels?.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = channels?.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const membersOthers = members?.filter((member) => member.profileId !== uid);
  const currentMember = members?.find((member) => member.profileId === uid);
  const profile = currentMember?.profile;
  if (!profile) {
    return null;
  }
  const role = members?.find((member) => member.profileId === uid)?.role;
  return (
    <div className="text-primary flex size-full flex-col bg-[#f2F3F5] dark:bg-[#2B2D31]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },

              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: membersOthers?.map((member) => ({
                  id: member.id,
                  name: member.profile?.name as string,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>

        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />

        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channel"
              channelType={ChannelType.TEXT}
              role={role}
              label={t('Text Channels')}
            />
          </div>
        )}
        <div className="space-y-[2px]">
          {textChannels?.map((channel) => (
            <ServerChannel
              key={channel.id}
              channel={channel}
              role={role}
              server={server}
            />
          ))}
        </div>

        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channel"
              channelType={ChannelType.AUDIO}
              role={role}
              label={t('Voide Channels')}
            />
          </div>
        )}

        <div className="space-y-[2px]">
          {audioChannels?.map((channel) => (
            <ServerChannel
              key={channel.id}
              channel={channel}
              role={role}
              server={server}
            />
          ))}
        </div>
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channel"
              channelType={ChannelType.VIDEO}
              role={role}
              label={t('Video Channels')}
            />
          </div>
        )}

        <div className="space-y-[2px]">
          {videoChannels?.map((channel) => (
            <ServerChannel
              key={channel.id}
              channel={channel}
              role={role}
              server={server}
            />
          ))}
        </div>

        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="member"
              role={role}
              label={t('Members')}
              server={server}
            />
          </div>
        )}

        <div className="space-y-[2px]">
          {membersOthers?.map((member) => (
            <ServerMember key={member.id} member={member} server={server} />
          ))}
        </div>
      </ScrollArea>
      <StatusProfile profile={profile} />
    </div>
  );
};

export default ServerSidebar;
