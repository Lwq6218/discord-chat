import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useModal } from '@/hooks/use-modal-store';
import { useOrigin } from '@/hooks/use-origin';
import axios from 'axios';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const InviteCodeModal = () => {
  const { t } = useTranslation();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const orgin = useOrigin();
  const isModalOpen = isOpen && type === 'invite';
  const { server } = data;
  const [copied, setCopied] = useState(false);
  const [isLoading, SetIsLoading] = useState(false);

  const inviteUrl = `${orgin}/invite/${server?.inviteCode}`;
  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  const onNew = async () => {
    try {
      SetIsLoading(true);
      const response = await axios.patch(`/server/${server?.id}/invite-code`);
      onOpen('invite', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      SetIsLoading(false);
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            {t('Invite Friends')}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {t(
              'Share your server with a invite link. You can generate a new one.'
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          <Label className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
            {t('Server invite link')}
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              disabled={isLoading}
              className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button disabled={isLoading} size="icon" onClick={onCopy}>
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
          <Button
            disabled={isLoading}
            onClick={onNew}
            variant="link"
            size="sm"
            className="mt-4 text-xs text-zinc-500"
          >
            {t('Generate a new link')}
            <RefreshCw className="ml-2 size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteCodeModal;
