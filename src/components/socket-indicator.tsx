import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/providers/socket-provider';
import { useTranslation } from 'react-i18next';

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  const { t } = useTranslation();
  if (!isConnected) {
    return (
      <Badge variant="outline" className="border-none bg-yellow-600 text-white">
        {t('Fallbback: Polling every 1s')}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-none bg-emerald-600 text-white">
      {t('Live: Real-time updates')}
    </Badge>
  );
};
