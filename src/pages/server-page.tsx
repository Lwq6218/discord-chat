import ServerSidebar from '@/components/server/server-sidebar';
import { getInitialChannelById } from '@/services/api/server';
import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

const ServerPage = () => {
  const { serverId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchInitialChannel = async () => {
      const response = await getInitialChannelById(serverId);
      if (response) {
        navigate(`/servers/${serverId}/channels/${response.id}`, {
          replace: true,
        });
      }
    };
    fetchInitialChannel();
  }, [serverId, navigate]);

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerSidebar serverId={serverId} />
      </div>
      <main className="h-full md:pl-60">
        <Outlet />
      </main>
    </div>
  );
};

export default ServerPage;
