import { ActionTooltip } from '@/components/action-tooltiip';
import { cn } from '@/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}
const NavigationItem = ({ id, imageUrl, name }: NavigationItemProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const onClick = () => {
    navigate(`/servers/${id}`);
  };
  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={onClick}
        className="group relative flex items-center space-y-2"
      >
        <div
          className={cn(
            'absolute left-0 w-[4px] rounded-r-full bg-primary-500 transition-all',
            params?.serverId !== id && 'group-hover:h-[20px]',
            params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
          )}
        />
        <div
          className={cn(
            'group relative mx-3 flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px] group-active:translate-y-[1px]',
            params?.serverId === id &&
              'rounded-[16px] bg-primary-500/10 text-primary-500'
          )}
        >
          <img src={imageUrl} alt="Channel" className="object-fill" />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
