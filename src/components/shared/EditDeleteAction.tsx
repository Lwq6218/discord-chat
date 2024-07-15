import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/providers/auth-provider';
import { deleteAnswer } from '@/services/api/answer';
import { deleteQuestion } from '@/services/api/question';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Props {
  type: 'question' | 'answer';
  itemId: string;
}

export default function EditDeleteAction({ type, itemId }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { uid } = useAuth();
  const queryClient = useQueryClient();
  const handleEdit = () => {
    navigate(`/devflow/question/edit/${itemId}`);
  };
  const deleteQuestionMutation = useMutation({
    mutationFn: () => deleteQuestion(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['savedQuestions'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
  const deleteAnswerMutation = useMutation({
    mutationFn: () => deleteAnswer(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers', uid] });
    },
  });
  const handleDelete = async () => {
    if (type === 'question') {
      // Delete question
      deleteQuestionMutation.mutate();
    }
    if (type === 'answer') {
      // Delete answer
      deleteAnswerMutation.mutate();
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 max-sm:w-full">
      {type === 'question' && (
        <img
          src="/assets/icons/edit.svg"
          alt="Edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
      <AlertDialog>
        <AlertDialogTrigger className="size-14">
          <img
            src="/assets/icons/trash.svg"
            alt="Delete"
            width={14}
            height={14}
            className="cursor-pointer object-contain"
          />
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light900_dark300 text-dark200_light900">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Are you absolutely sure?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                'This action cannot be undone. This will permanently delete your account and remove your data from our servers.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white"
              onClick={handleDelete}
            >
              {t('Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
