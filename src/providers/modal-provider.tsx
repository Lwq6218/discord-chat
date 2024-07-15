import CreateChannelModal from '@/components/modal/create-channel-modal';
import CreateServerModel from '@/components/modal/create-server-modal';
import DeleteChannelModal from '@/components/modal/delete-channel-modal';
import DeleteMessageModal from '@/components/modal/delete-message-modal';
import DeleteServerModal from '@/components/modal/delete-server-modal';
import EditChannelModal from '@/components/modal/edit-channel-modal';
import EditServerModel from '@/components/modal/edit-server-modal';
import InviteCodeModal from '@/components/modal/invite-code-modal';
import LeaveServerModal from '@/components/modal/leave-server-modal';
import MembersModal from '@/components/modal/members-modal';
import MessageFileModel from '@/components/modal/message-file-modal';

export const ModalProvider = () => {
  return (
    <>
      <CreateServerModel />
      <EditServerModel />
      <CreateChannelModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MembersModal />
      <InviteCodeModal />
      <DeleteMessageModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <MessageFileModel />
    </>
  );
};
