import Filter from '@/components/shared/Filter';
import Pagination from '@/components/shared/Pagination';
import ParseHTML from '@/components/shared/ParseHTML';
import Votes from '@/components/shared/Votes';
import { AnswerFilters } from '@/constants/filter';
import { getTimestamp } from '@/lib/utils';
import { listAnswers } from '@/services/api/answer';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

export default function AllAnswers({ questionId, totalAnswers }: Props) {
  const { t } = useTranslation();
  const answersQUery = useQuery({
    queryKey: ['answers', questionId],
    queryFn: () => listAnswers(questionId),
  });

  const { data: page } = answersQUery;
  const answers = page?.list;
  if (!answers) return;
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {t('Answers')}
        </h3>

        {answers.length > 0 && <Filter filters={AnswerFilters} />}
      </div>

      <div>
        {answers.map((answer) => (
          <article key={answer.id} className="light-border border-b py-10">
            <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <Link
                to={`/devflow/profile/${answer.author.id}`}
                className="flex flex-1 items-start gap-1 sm:items-center"
              >
                <img
                  src={answer.author.imageUrl}
                  alt="user picture"
                  width={18}
                  height={18}
                  className="rounded-full object-cover max-sm:mt-0.5"
                />
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="body-semibold text-dark300_light700">
                    {answer.author.name}
                  </p>

                  <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
                    <span className="max-sm:hidden"> • </span> answered{' '}
                    {getTimestamp(new Date(answer.createTime))}
                  </p>
                </div>
              </Link>
              <div className="flex justify-end">
                <Votes
                  type="answer"
                  itemId={answer.id}
                  upvotes={answer.upvotes}
                  hasUpVoted={answer.hasUpVoted}
                  downvotes={answer.downvotes}
                  hasDownVoted={answer.hasDownVoted}
                />
              </div>
            </div>

            <ParseHTML data={answer.content} />
          </article>
        ))}
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
  );
}
