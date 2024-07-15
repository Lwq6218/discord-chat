import LeftSidebar from '@/components/devflow/left-sidebar';
import { Outlet } from 'react-router-dom';

function DevflowPage() {
  return (
    <div className="flex">
      <div className="fixed z-20">
        <LeftSidebar />
      </div>
      <main className="ml-[74px] min-h-screen flex-1 flex-col bg-white px-6 pb-6 pt-10 dark:bg-[#313338] max-md:pb-14 sm:px-14 lg:ml-[266px]">
        <div className="mx-auto w-full max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DevflowPage;
