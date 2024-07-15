import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessages from '@/components/chat/chat-messages';
import { MediaRoom } from '@/components/media-room';
import { getChannelById } from '@/services/api/channel';
import { getMemberByServerId } from '@/services/api/member';
import { ChannelType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const ChannelPage = () => {
  const { serverId, channelId } = useParams();
  const channelQuery = useQuery({
    queryKey: ['channel', channelId],
    queryFn: () => getChannelById(channelId),
  });
  const memberQuery = useQuery({
    queryKey: ['member', serverId],
    queryFn: () => getMemberByServerId(serverId),
  });
  const channel = channelQuery.data;
  const member = memberQuery.data;
  if (!channel || !member) return null;
  return (
    <div className="flex h-screen flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel?.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            chatId={channel.id}
            type="channel"
            apiUrl="/message/list"
            socketUrl="/message/socket"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            name={channel.name}
            paramKey="channelId"
            paramValue={channel.id}
          />

          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/message/socket"
            query={{ channelId: channel.id, serverId: serverId! }}
          />
        </>
      )}
      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}

      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={false} />
      )}
    </div>
  );
};

export default ChannelPage;
