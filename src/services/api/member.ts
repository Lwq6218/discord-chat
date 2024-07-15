import axios from '@/services/axios-request';
import { Member } from '@/types';

export async function getMemberByServerId(serverId?: string): Promise<Member> {
  try {
    const { data } = await axios.get(`/member/${serverId}`);
    console.log('data:', data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function listMembersByServerId(
  serverId?: string
): Promise<Member[]> {
  try {
    const { data } = await axios.get(`/member/list/${serverId}`);
    console.log('data:', data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function listMembersWithProfile(
  serverId?: string
): Promise<Member[]> {
  try {
    const { data } = await axios.get(`/member/list/with_profile/${serverId}`);
    console.log('data:', data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function addMemberByInviteCode(
  inviteCode?: string
): Promise<string> {
  try {
    const { data } = await axios.post(`/member/invite/${inviteCode}`);
    console.log('data:', data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
