import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import ChatMessages from '@/components/chat/chat-messages';
import { useAuth } from '@/providers/auth-provider';
import { getOrCreateConversation } from '@/services/api/conversation';
import { getMemberByServerId } from '@/services/api/member';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';

const ConversationPage = () => {
  const { memberId, serverId } = useParams();
  const [searchParams] = useSearchParams();
  const { uid } = useAuth();

  const memberQuery = useQuery({
    queryKey: ['member', serverId],
    queryFn: () => getMemberByServerId(serverId),
  });
  const currentMember = memberQuery.data;
  const currentMemberId = currentMember?.id;

  const conversationQuery = useQuery({
    queryKey: ['getOrCreateConversation', memberId, currentMemberId],
    queryFn: () => getOrCreateConversation(currentMemberId, memberId),
    enabled: !!currentMemberId,
  });
  const conversation = conversationQuery.data;

  if (!conversation || !currentMember) return null;

  const otherMember =
    conversation?.memberOne?.profileId === uid
      ? conversation?.memberTwo
      : conversation?.memberOne;
  return (
    <div className="flex h-screen flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        name={otherMember.profile?.name as string}
        imageUrl={otherMember.profile?.imageUrl}
        serverId={serverId as string}
        type="conversation"
      />
      {!searchParams.get('video') && (
        <>
          <ChatMessages
            name={otherMember.profile?.name as string}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/direct-message/list"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/direct-message/socket"
            socketQuery={{ conversationId: conversation.id }}
            member={currentMember!}
          />
          <ChatInput
            name={otherMember.profile?.name as string}
            type="conversation"
            apiUrl="/direct-message/socket"
            query={{ conversationId: conversation.id }}
          />
        </>
      )}
    </div>
  );
};

export default ConversationPage;
