import StatusControl from '@/components/status/status-control';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Profile } from '@/types';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SettingProfileProps {
  profile: Profile;
}
interface VoiceStatus {
  mute?: boolean;
  deaf?: boolean;
  serverMuted?: boolean;
}

const DATE_FORMAT = 'd MMM yyyy';
function StatusProfile({ profile }: SettingProfileProps) {
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>({ mute: true });
  const { t } = useTranslation();
  return (
    <Popover>
      <div className="flex justify-between gap-1 px-2 py-1.5">
        <PopoverTrigger asChild>
          <button className="flex gap-2 rounded-md py-1 pl-0.5 pr-2 text-left leading-tight hover:bg-white/20">
            <Avatar>
              <AvatarImage src={profile.imageUrl} alt={profile.name} />
              <AvatarFallback>{profile.name}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-xs font-semibold">{profile.name}</div>
              <div className="text-[11px] text-gray-300">status</div>
            </div>
          </button>
        </PopoverTrigger>
        <StatusControl
          voiceStatus={voiceStatus}
          setVoiceStatus={setVoiceStatus}
        />
      </div>
      <PopoverContent
        side="top"
        className="relative left-20 !w-full border-none bg-gradient-to-b dark:bg-[#1e1f22] md:min-w-[360px]"
      >
        <div className="h-[60px] w-full rounded-t-md bg-gray-300" />
        <Avatar className="relative -top-4 left-8 scale-[2] ring-[3px] ring-[#1e1f22]">
          <AvatarImage src={profile.imageUrl} alt={profile.name} />
          <AvatarFallback>{profile.name}</AvatarFallback>
        </Avatar>
        <div className="relative mt-6 rounded-lg">
          <img
            src="/hashtag.png"
            height={28}
            width={28}
            alt="hashtag image"
            className="absolute -top-12 right-0 size-6 rounded bg-black object-cover p-0.5"
          />

          <p className="text-lg font-semibold">{t('Name')}</p>
          <p className="text-xs">{profile.name}</p>
          <Separator />
          <p className="mt-2 text-xs font-semibold">{t('Member Since')}</p>
          <p className="py-2 text-xs">
            {format(new Date(profile.createTime as Date), DATE_FORMAT)}
          </p>
          <Separator />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default StatusProfile;
