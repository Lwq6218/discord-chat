import { useSocket } from '@/providers/socket-provider';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

type ActionSocketProps = {
  memberAddKey?: string;
  memberLeaveKey?: string;
  memberUpdateKey?: string;
};

export const useActionSocket = ({
  memberAddKey,
  memberLeaveKey,
  memberUpdateKey,
}: ActionSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      const { key, message } = data;
      console.log('socket data', data);
      if (memberAddKey && key === memberAddKey) {
        queryClient.invalidateQueries({ queryKey: ['members'] });
      }
      if (memberLeaveKey && key === memberLeaveKey) {
        queryClient.invalidateQueries({ queryKey: ['members'] });
      }
      if (memberUpdateKey && key === memberUpdateKey) {
        console.log('memberUpdateKey', memberUpdateKey, message);
        queryClient.invalidateQueries({ queryKey: ['members', message] });
      }
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [memberAddKey, memberLeaveKey, memberUpdateKey, queryClient, socket]);
};
