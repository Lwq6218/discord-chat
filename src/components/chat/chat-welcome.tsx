import { Hash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ChatWelcomeProps {
  name: string;
  type: 'channel' | 'conversation';
}

const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-4 space-y-2 px-4">
      {type === 'channel' && (
        <div className="flex size-[75px] items-center justify-center rounded-full bg-zinc-500 dark:bg-zinc-700">
          <Hash className="size-12 text-white" />
        </div>
      )}
      <p className="text-xl font-bold md:text-3xl">
        {type === 'channel' ? t('Welcome to #') : ''}
        {name === 'general' ? t(name) : name}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {type === 'channel'
          ? `${t('This is the start of the')} #${name === 'general' ? t(name) : name} `
          : `${t('This is the start of your conversation with')}${name}.`}
      </p>
    </div>
  );
};

export default ChatWelcome;
