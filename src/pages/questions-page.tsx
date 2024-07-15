import Filter from '@/components/shared/Filter';
import HomeFilter from '@/components/shared/HomeFilter';
import NoResult from '@/components/shared/NoResult';
import Pagination from '@/components/shared/Pagination';
import QuestionCard from '@/components/shared/cards/QuestionCard';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filter';
import { listQuestions } from '@/services/api/question';
import { Page, Question } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

export default function QuestionsPage() {
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
    queryKey: ['questions', questionParams],
    queryFn: () => listQuestions(questionParams),
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
      <div className="flex h-full flex-col max-sm:ml-[24px]">
        <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="h1-bold text-dark100_light900">
            {t('All Questions')}
          </h1>
          <Link
            to="/devflow/ask-question"
            className="flex justify-end max-sm:w-full"
          >
            <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
              {t('Ask a Question')}
            </Button>
          </Link>
        </div>
        <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <LocalSearchbar
            route="/devflow/questions"
            iconPosition="left"
            imgSrc="/assets/icons/search.svg"
            placeholder="Search for questions"
            otherClasses="flex-1"
          />
          <Filter
            filters={HomePageFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
            containerClasses="hidden max-md:flex"
          />
        </div>
        <HomeFilter />
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
              description={t(
                'Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡'
              )}
              title={t("There's no question to show")}
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
      </div>
    </>
  );
}
