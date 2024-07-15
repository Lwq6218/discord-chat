import { ActionTooltip } from '@/components/action-tooltiip';
import { useModal } from '@/hooks/use-modal-store';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NavigationAction() {
  const { t } = useTranslation();
  const { onOpen } = useModal();
  return (
    <div>
      <ActionTooltip side="right" align="center" label={t('Add a server')}>
        <button
          className="group mt-2 flex items-center"
          onClick={() => onOpen('createServer')}
        >
          <div className="mx-3 flex size-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700">
            <Plus
              className="text-emerald-500 transition group-hover:text-white"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
}
