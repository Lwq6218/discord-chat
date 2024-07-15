import StatusButton from '@/components/status/status-button';
import { Headphones, Mic, Settings } from 'lucide-react';

interface VoiceControlsProps {
  voiceStatus: {
    mute?: boolean;
    deaf?: boolean;
  };
  setVoiceStatus: (
    statusUpdater: (prev: { mute?: boolean; deaf?: boolean }) => {
      mute?: boolean;
      deaf?: boolean;
    }
  ) => void;
}
function StatusControl({ voiceStatus, setVoiceStatus }: VoiceControlsProps) {
  return (
    <div className="flex items-center">
      <StatusButton
        muted={voiceStatus.mute || voiceStatus.deaf}
        tooltipText={voiceStatus.mute || voiceStatus.deaf ? 'Unmute' : 'Mute'}
        onClick={() =>
          setVoiceStatus((prev) => ({
            ...prev,
            deaf: false,
            mute: !prev?.mute,
          }))
        }
        icon={<Mic size={18} />}
      />
      <StatusButton
        muted={voiceStatus.deaf}
        tooltipText={voiceStatus.deaf ? 'Undeaf' : 'Deaf'}
        onClick={() =>
          setVoiceStatus((prev: { mute?: boolean; deaf?: boolean }) => ({
            ...prev,
            deaf: !prev.deaf,
          }))
        }
        icon={<Headphones size={20} />}
      />
      <StatusButton
        tooltipText="Settings"
        icon={
          <Settings
            size={20}
            className="transition duration-200 hover:rotate-180"
          />
        }
      />
    </div>
  );
}

export default StatusControl;
