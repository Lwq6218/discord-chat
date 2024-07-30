import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTheme } from '@/providers/theme-provider';
import data from '@emoji-mart/data';
import zh from '@emoji-mart/data/i18n/zh.json';
import Picker from '@emoji-mart/react';
import { Smile } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmojiPickerProps {
  onChange: (value: string) => void;
}
export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="mb-16 border-none bg-transparent shadow-none drop-shadow-none"
      >
        <Picker
          i18n={i18n.language === 'zh' && zh}
          theme={theme}
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};
