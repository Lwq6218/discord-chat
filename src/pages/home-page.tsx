import NavigationSideBar from '@/components/navigation/navigation-sidebar';
import { ModalProvider } from '@/providers/modal-provider';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => navigate('/devflow/questions'), [navigate]);
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-30 hidden h-full w-[72px] flex-col md:flex">
        <NavigationSideBar />
      </div>
      <main className="h-full md:pl-[72px]">
        <ModalProvider />
        <Outlet />
      </main>
    </div>
  );
};

export default HomePage;
