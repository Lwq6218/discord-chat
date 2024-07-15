import Profile from '@/components/shared/form/Profile';
import { useAuth } from '@/providers/auth-provider';
import { getUserById } from '@/services/api/user';
import { useQuery } from '@tanstack/react-query';

export default function ProfileEditPage() {
  const { uid } = useAuth();
  const userQuery = useQuery({
    queryKey: ['user', uid],
    queryFn: () => getUserById(uid as string),
  });
  if (!userQuery.data) return null;
  const userInfo = userQuery.data;
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Profile</h1>

      <div className="mt-9">
        <Profile user={userInfo} />
      </div>
    </>
  );
}
