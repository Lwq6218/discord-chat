import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import Pagination from '@/components/shared/Pagination';
import QuestionCard from '@/components/shared/cards/QuestionCard';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { QuestionFilters } from '@/constants/filter';
import { listSavedQuestions } from '@/services/api/question';
import { Page, Question } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

export default function CollectionPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const questionParams = useMemo(
    () => ({
      filter: searchParams.get('filter'),
      pageNum: searchParams.get('page'),
      q: searchParams.get('q'),
    }),
    [searchParams]
  );

  const [page, setPage] = useState<Page<Question>>();
  const [isLoading, setIsLoading] = useState(true);

  const questionQuery = useQuery({
    queryKey: ['savedQuestions', questionParams],
    queryFn: () => listSavedQuestions(questionParams),
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
      <h1 className="h1-bold text-dark100_light900">{t('Saved Questions')}</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/devflow/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
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
            title={t("There's no saved question to show")}
            description={t(
              'Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡'
            )}
            link="/devflow/ask-question"
            linkTitle={t('Ask a Question')}
          />
        )}
      </div>
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
