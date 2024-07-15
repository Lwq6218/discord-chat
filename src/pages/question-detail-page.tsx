import AllAnswers from '@/components/shared/AllAnswers';
import Metric from '@/components/shared/Metric';
import ParseHTML from '@/components/shared/ParseHTML';
import RenderTag from '@/components/shared/RenderTag';
import Votes from '@/components/shared/Votes';
import Answer from '@/components/shared/form/Answer';
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { getQuestionById } from '@/services/api/question';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { t } from 'i18next';
import { Link, useParams } from 'react-router-dom';

export default function QuestionDetailPage() {
  const { questionId } = useParams();
  const { uid } = useAuth();
  const questionQuery = useQuery({
    queryKey: ['question', questionId],
    queryFn: () => getQuestionById(questionId!),
  });
  const hasUpvotedQuery = useQuery({
    queryKey: ['hasUpVoted', questionId],
    queryFn: () =>
      axios.post(`/action/hasUpVoted`, {
        type: 'question',
        questionId,
      }),
  });
  const hasDownvotedQuery = useQuery({
    queryKey: ['hasDownVoted', questionId],
    queryFn: () =>
      axios.post(`/action/hasDownVoted`, {
        type: 'question',
        questionId,
      }),
  });
  const hasSavedQuery = useQuery({
    queryKey: ['hasSaved', questionId],
    queryFn: () =>
      axios.post(`/action/hasSaved`, {
        type: 'question',
        questionId,
      }),
  });
  const hasDownvoted = hasDownvotedQuery.data?.data;
  const hasUpvoted = hasUpvotedQuery.data?.data;
  const hasSaved = hasSavedQuery.data?.data;
  const { data: question } = questionQuery;
  if (!question) return;
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            to={`/devflow/profile/${question.author.id}`}
            className="flex items-center justify-start gap-1"
          >
            <img
              src={question.author.imageUrl}
              className="rounded-full"
              width={22}
              height={22}
              alt="profile"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              itemId={question.id}
              upvotes={question.upvotes}
              hasUpVoted={hasUpvoted}
              downvotes={question.downvotes}
              hasDownVoted={hasDownvoted}
              hasSaved={hasSaved}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimestamp(new Date(question.createTime))}`}
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={formatAndDivideNumber(question.answerCount)}
          title={t('Answers')}
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={question.content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <RenderTag
            key={tag.id}
            _id={tag.id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={question.id}
        userId={uid!}
        totalAnswers={question.answerCount}
        // page={searchParams?.page}
        // filter={searchParams?.filter}
      />

      <Answer questionId={question.id} />
    </>
  );
}
