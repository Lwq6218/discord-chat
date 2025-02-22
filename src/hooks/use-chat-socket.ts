import { useSocket } from '@/providers/socket-provider';
import { Member, Message, Profile } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      const { key, message } = data;

      if (key === addKey) {
        queryClient.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [
                {
                  items: [message],
                },
              ],
            };
          }
          const newData = [...oldData.pages];
          newData[0] = {
            ...newData[0],
            items: [message, ...newData[0].items],
          };
          return {
            ...oldData,
            pages: newData,
          };
        });
      }
      if (key === updateKey) {
        queryClient.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }

          const newData = oldData.pages.map((page: any) => {
            return {
              ...page,
              items: page.items.map((item: MessageWithMemberWithProfile) => {
                if (item.id === message.id) {
                  return message;
                }
                return item;
              }),
            };
          });
          return {
            ...oldData,
            pages: newData,
          };
        });
      }
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [queryClient, socket, addKey, updateKey, queryKey]);
};
