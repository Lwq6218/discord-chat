import QuestionCard from '@/components/shared/cards/QuestionCard';
import NoResult from '@/components/shared/NoResult';
import Pagination from '@/components/shared/Pagination';
import { listQuestionsByUserId } from '@/services/api/question';
import { Page, Question } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

interface Props {
  userId: string;
}
export default function QuestionTab({ userId }: Props) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const questionParams = useMemo(
    () => ({
      pageNum: searchParams.get('page'),
    }),
    [searchParams]
  );
  const [page, setPage] = useState<Page<Question>>();
  const [isLoading, setIsLoading] = useState(true);
  const questionQuery = useQuery({
    queryKey: ['questions', userId, questionParams],
    queryFn: () => listQuestionsByUserId(userId, questionParams),
  });
  useEffect(() => {
    if (questionQuery.data) {
      setPage(questionQuery.data);
      setIsLoading(false);
    }
  }, [questionQuery.data]);

  if (isLoading) return null;
  const questions = page?.list ?? [];
  return (
    <>
      {questions.length > 0 ? (
        questions.map((question) => (
          <QuestionCard
            key={question.id}
            id={question.id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes}
            downvotes={question.downvotes}
            answerCount={question.answerCount}
            createTime={new Date(question.createTime)}
          />
        ))
      ) : (
        <NoResult
          description={t(
            'Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡'
          )}
          title={t("There's no question to show")}
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
