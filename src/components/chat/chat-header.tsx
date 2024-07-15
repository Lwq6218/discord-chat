import MobileToggle from '@/components/mobile-toggle';
import { SocketIndicator } from '@/components/socket-indicator';
import { Hash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import UserAvatar from '../user-avatar';

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: 'channel' | 'conversation';
  imageUrl?: string;
}
const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex h-12 items-center border-b-2 border-neutral-200 px-3 text-xl font-semibold dark:border-neutral-800">
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <Hash className="mr-2 size-5 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === 'conversation' && (
        <UserAvatar src={imageUrl} className="mr-2 size-8 md:size-8" />
      )}
      <p className="text-xl font-semibold text-black dark:text-white">
        {type === 'channel' && name === 'general' ? t(name) : name}
      </p>
      <div className="ml-auto flex items-center">
        {/* {type === 'conversation' && <ChatVideoButton />} */}
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
