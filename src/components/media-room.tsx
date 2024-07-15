import { useAuth } from '@/providers/auth-provider';
import { getUserById } from '@/services/api/user';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}
export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { uid } = useAuth();
  const userQuery = useQuery({
    queryKey: ['user', uid],
    queryFn: () => getUserById(uid!),
  });
  const profile = userQuery.data;
  const liveKitQuery = useQuery({
    queryKey: ['livekit', chatId],
    queryFn: () =>
      axios.get(`/livekit?room=${chatId}&username=${profile?.name}`),
    enabled: !!profile,
  });
  const { data } = liveKitQuery;
  const token = data?.data;

  if (!token) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="my-4 size-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }
  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      connect={true}
      token={token}
      serverUrl={import.meta.env.VITE_LIVEKIT_URL}
      data-lk-theme="default"
      className="bg-[#313338]"
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
