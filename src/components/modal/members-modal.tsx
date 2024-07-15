import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react';
import qs from 'query-string';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import UserAvatar from '@/components/user-avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useModal } from '@/hooks/use-modal-store';
import { MemberRole } from '@/types';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const roleIconMap = {
  '2': null,
  '1': <ShieldCheck className="ml-2 size-4 text-indigo-500" />,
  '0': <ShieldAlert className="ml-2 size-4 text-rose-500" />,
};
const MembersModal = () => {
  const { t } = useTranslation();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, SetLoadingId] = useState('');
  const isModalOpen = isOpen && type === 'members';
  const { server } = data;
  const navigate = useNavigate();
  const onKick = async (id: string) => {
    try {
      SetLoadingId(id);
      const url = qs.stringifyUrl({
        url: `/member/${id}`,
        query: {
          serverId: server?.id,
        },
      });
      const response = await axios.delete(url);
      navigate(0);
      onOpen('members', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      SetLoadingId('');
    }
  };
  const onRoleChange = async (id: string, role: MemberRole) => {
    try {
      SetLoadingId(id);
      const url = qs.stringifyUrl({
        url: `/member/${id}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.patch(url, { role });
      onOpen('members', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      SetLoadingId('');
    }
  };
  // const [members, setMembers] = useState<Member[]>();
  // useEffect(() => {
  //   const { server } = data;
  //   const fetchMembers = async () => {
  //     try {
  //       const members = await listMembersWithProfile(server?.id);
  //       console.log('members:', members);
  //       setMembers(members);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchMembers();
  // }, [data, server?.id]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            {t('Manage Members')}
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="mb-6 flex items-center gap-x-2">
              <UserAvatar src={member.profile?.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-1 text-xs font-semibold">
                  {member.profile?.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile?.email}</p>
              </div>

              {server?.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="size-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="mr-2 size-4" />
                            <span>{t('Role')}</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, MemberRole.GUEST)
                                }
                              >
                                <Shield className="mr-2 size-4" />
                                {t('Guest')}
                                {member.role === MemberRole.GUEST && (
                                  <Check className="ml-auto size-4" />
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, MemberRole.MODERATOR)
                                }
                              >
                                <ShieldCheck className="mr-2 size-4" />
                                {t('Moderator')}
                                {member.role === MemberRole.MODERATOR && (
                                  <Check className="ml-auto size-4" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onKick(member.id)}>
                          <Gavel className="mr-2 size-4" />
                          {t('Kick')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="ml-auto size-4 animate-spin text-zinc-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
