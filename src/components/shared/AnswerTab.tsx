import AnswerCard from '@/components/shared/cards/AnswerCard';
import NoResult from '@/components/shared/NoResult';
import Pagination from '@/components/shared/Pagination';
import { listAnswersByUserId } from '@/services/api/answer';
import { Answer, Page } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

interface Props {
  userId: string;
  uid: string;
}
export default function AnswerTab({ userId, uid }: Props) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const answerParams = useMemo(
    () => ({
      pageNum: searchParams.get('page'),
    }),
    [searchParams]
  );
  const answersQuery = useQuery({
    queryKey: ['answers', userId, answerParams],
    queryFn: () => listAnswersByUserId(userId, answerParams),
  });
  const [page, setPage] = useState<Page<Answer>>();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (answersQuery.data) {
      setPage(answersQuery.data);
      setIsLoading(false);
    }
  }, [answersQuery.data]);
  if (isLoading) return null;
  const answers = page?.list ?? [];
  return (
    <>
      {answers.length > 0 ? (
        answers.map((answer) => (
          <AnswerCard
            key={answer.id}
            id={answer.id}
            uid={uid}
            questionId={answer.questionId}
            content={answer.content}
            author={answer.author}
            upvotes={answer.upvotes}
            downvotes={answer.downvotes}
            createdTime={answer.createTime}
          />
        ))
      ) : (
        <NoResult
          description={t(
            'Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡'
          )}
          title={t("There's no answer to show")}
        />
      )}
      <div className="mt-10">
        {page && (
          <Pagination
            pageNum={+page.pageNum}
            pages={+page.pages}
            total={+page.total}
          />
        )}
      </div>
    </>
  );
}
