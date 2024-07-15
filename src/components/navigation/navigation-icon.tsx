import { ActionTooltip } from '@/components/action-tooltiip';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

function NavigationIcon() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const pathname = useLocation().pathname;
  const isActive = pathname.includes('devflow');
  return (
    <div>
      <ActionTooltip side="right" align="center" label={t('Browse Posts')}>
        <button
          className="group flex items-center"
          onClick={() => navigate('/devflow/questions')}
        >
          <div
            className={cn(
              'absolute left-0 w-[4px] rounded-r-full bg-primary-500 transition-all',
              isActive ? 'h-[36px]' : 'h-[8px]',
              'group-hover:h-[20px]'
            )}
          />
          <div
            className={cn(
              'mx-3 flex size-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-primary-500',
              isActive && 'rounded-[16px] bg-primary-500'
            )}
          >
            <Icons.discord
              className={cn(
                'fill-[#313338] transition group-hover:fill-white dark:fill-[#dbdee1]',
                isActive && 'fill-white'
              )}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
}

export default NavigationIcon;
