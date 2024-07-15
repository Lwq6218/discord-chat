import { useAuth } from '@/providers/auth-provider';
import { addMemberByInviteCode } from '@/services/api/member';
import { getServerByInviteCode } from '@/services/api/server';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const InviteCodePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  // 校验用户是否登录，如果没有登录则跳转到登录页面
  if (!isAuthenticated) {
    navigate('/user/sign-in');
  }

  // 校验有没有邀请码，如果没有重定向到首页
  if (!params.inviteCode) {
    navigate('/');
  }

  // 校验邀请码是否有效，如果服务器存在并且拥有者是当前用户则重定向到服务器页面

  useEffect(() => {
    const fetchExistingServer = async () => {
      try {
        const existingServer = await getServerByInviteCode(params.inviteCode);
        if (existingServer) {
          navigate(`/servers/${existingServer.id}`);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchServer = async () => {
      try {
        const serverId = await addMemberByInviteCode(params.inviteCode);
        queryClient.invalidateQueries({ queryKey: ['servers'] });
        queryClient.invalidateQueries({ queryKey: ['members'] });
        navigate(`/servers/${serverId}`);
      } catch (error) {
        console.log(error);
      }
    };
    fetchExistingServer();
    fetchServer();
  }, [params.inviteCode, navigate, queryClient]);

  //邀请码有效，更新服务器信息添加用户到服务器,跳转到服务器页面
  return <div>InviteCodePage</div>;
};

export default InviteCodePage;
