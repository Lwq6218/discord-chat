import { formatAndDivideNumber } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Props {
  type: 'question' | 'answer';
  itemId: string;
  upvotes: number;
  hasUpVoted: boolean;
  downvotes: number;
  hasDownVoted: boolean;
  hasSaved?: boolean;
}

export default function Votes({
  type,
  itemId,
  upvotes,
  hasUpVoted,
  downvotes,
  hasDownVoted,
  hasSaved,
}: Props) {
  const queryClient = useQueryClient();
  const upvoteMutation = useMutation({
    mutationKey: ['upvoteQuestion'],
    mutationFn: () => {
      return axios.post('/action/upvote', {
        questionId: itemId,
        answerId: itemId,
        type,
        hasUpVoted,
        hasDownVoted,
      });
    },
    onSuccess: () => {
      type === 'question' &&
        queryClient.invalidateQueries({ queryKey: ['hasUpVoted', itemId] });
      type === 'question' &&
        queryClient.invalidateQueries({ queryKey: [type, itemId] });
      type === 'answer' &&
        queryClient.invalidateQueries({ queryKey: ['answers'] });
    },
  });

  const downupvoteMutation = useMutation({
    mutationKey: ['upvoteQuestion'],
    mutationFn: () => {
      return axios.post('/action/downvote', {
        questionId: itemId,
        answerId: itemId,
        type,
        hasUpVoted,
        hasDownVoted,
      });
    },
    onSuccess: () => {
      type === 'question' &&
        queryClient.invalidateQueries({ queryKey: ['hasDownVoted', itemId] });
      type === 'question' &&
        queryClient.invalidateQueries({ queryKey: [type, itemId] });
      type === 'answer' &&
        queryClient.invalidateQueries({ queryKey: ['answers'] });
    },
  });
  const saveMutation = useMutation({
    mutationKey: ['saveQuestion'],
    mutationFn: () => {
      return axios.post('/action/star', {
        questionId: itemId,
        hasSaved,
      });
    },
    onSuccess: () => {
      type === 'question' &&
        queryClient.invalidateQueries({ queryKey: ['hasSaved', itemId] });
      type === 'question' &&
        queryClient.invalidateQueries({ queryKey: ['savedQuestions'] });
    },
  });
  const handleVote = async (action: string) => {
    if (action === 'upvote') {
      upvoteMutation.mutate();
    }
    if (action === 'downvote') {
      downupvoteMutation.mutate();
    }
  };

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <img
            src={
              hasUpVoted
                ? '/assets/icons/upvoted.svg'
                : '/assets/icons/upvote.svg'
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote('upvote')}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <img
            src={
              hasDownVoted
                ? '/assets/icons/downvoted.svg'
                : '/assets/icons/downvote.svg'
            }
            width={18}
            height={18}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote('downvote')}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {type === 'question' && (
        <img
          src={
            hasSaved
              ? '/assets/icons/star-filled.svg'
              : '/assets/icons/star-red.svg'
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={() => saveMutation.mutate()}
        />
      )}
    </div>
  );
}
