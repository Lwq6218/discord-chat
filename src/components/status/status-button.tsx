import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type VoiceStatusButton = {
  icon: React.ReactNode;
  muted?: boolean;
  tooltipText: string;
  onClick?: () => void;
};
const StatusButton = ({
  icon,
  muted,
  tooltipText,
  onClick,
}: VoiceStatusButton) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger
          asChild
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <button
            onClick={onClick}
            className={cn(
              'group relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-700',
              'text-gray-300 hover:text-gray-200'
            )}
          >
            {icon}
            {muted && (
              <div className="border-semibackground absolute h-3/4 w-[5px] rotate-45 rounded-sm border-[2px] bg-red-500 group-hover:border-gray-700"></div>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent className="text-xs font-normal text-gray-200">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StatusButton;
