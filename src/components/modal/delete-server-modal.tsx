import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const DeleteServerModal = () => {
  const { t } = useTranslation();
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === 'deleteServer';
  const { server } = data;
  const [isLoading, SetIsLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      return axios.delete(`/server/${server?.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      navigate('/devflow/questions');
    },
  });
  const onClick = async () => {
    try {
      SetIsLoading(true);
      mutation.mutate();
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
      SetIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            {t('Delete Server')}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {t('Are you sure want to delete this?')}
            <br />
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>{' '}
            {t('will be permanently deleted.')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              {t('Cancel')}
            </Button>
            <Button disabled={isLoading} variant="primary" onClick={onClick}>
              {t('Confirm')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;
