import { cn } from '@/lib/utils';
import { Member, MemberRole, Server } from '@/types';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import UserAvatar from '../user-avatar';

interface ServerMemberProps {
  member: Member;
  server: Server;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="ml-2 size-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="ml-2 size-4 text-rose-500" />,
};
const ServerMember = ({ member }: ServerMemberProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const icon = roleIconMap[member.role];
  const onClick = () => {
    navigate(`/servers/${params?.serverId}/conversations/${member.id}`);
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700',
        params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar src={member.profile?.imageUrl} className="size-8 md:size-8" />
      <p
        className={cn(
          'text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          params?.member === member.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {member.profile?.name}
      </p>
      {icon}
    </button>
  );
};

export default ServerMember;
