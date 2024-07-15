import EditDeleteAction from '@/components/shared/EditDeleteAction';
import Metric from '@/components/shared/Metric';
import RenderTag from '@/components/shared/RenderTag';
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { Link } from 'react-router-dom';

interface Props {
  id: string;
  title: string;
  tags: {
    id: string;
    name: string;
  }[];

  author: {
    id: string;
    name: string;
    imageUrl: string;
  };
  upvotes: number;
  downvotes: number;
  answerCount: number;
  createTime: Date;
}
export default function QuestionCard({
  id,
  title,
  tags,
  downvotes,
  upvotes,
  author,
  answerCount,
  createTime,
}: Props) {
  const { uid } = useAuth();
  const showActionButtons = uid && uid === author.id;
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:p-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createTime)}
          </span>
          <Link to={`/devflow/question/${id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        {showActionButtons && <EditDeleteAction type="question" itemId={id} />}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag _id={tag.id} key={tag.id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.imageUrl}
          alt="Author"
          value={author.name}
          title={` - asked ${getTimestamp(createTime)}`}
          href={`/profile/${author.id}`}
          isAuthor={true}
          textStyles="body-medium text-dark400_light700"
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={formatAndDivideNumber(upvotes)}
            title="Votes"
            textStyles="small-medium text-dark400_light800"
          />

          <Metric
            imgUrl="/assets/icons/dislike.svg"
            alt="Upvotes"
            value={formatAndDivideNumber(downvotes)}
            title="Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Answers"
            value={formatAndDivideNumber(answerCount)}
            title="Answers"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
}
