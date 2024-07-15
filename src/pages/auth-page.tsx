import { Outlet } from 'react-router-dom';

function AuthPage() {
  return (
    <div className="relative mx-auto h-screen w-[400px] justify-center">
      <Outlet />
    </div>
  );
}

export default AuthPage;
