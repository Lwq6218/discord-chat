import EditDeleteAction from '@/components/shared/EditDeleteAction';
import Metric from '@/components/shared/Metric';
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface Props {
  uid?: string | null;
  id: string;
  questionId: string;
  content: string;
  author: {
    id: string;
    name: string;
    imageUrl: string;
  };
  downvotes: number;
  upvotes: number;
  createdTime: Date;
}

const AnswerCard = ({
  uid,
  id,
  questionId,
  content,
  author,
  upvotes,
  downvotes,
  createdTime,
}: Props) => {
  const showActionButtons = uid && uid === author.id;

  return (
    <div className="card-wrapper rounded-[10px] px-11 py-9">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(new Date(createdTime))}
          </span>
          <Link
            to={`/devflow/question/${questionId}/#${id}`}
            className="card-wrapper rounded-[10px] px-11 py-9"
          >
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {content}
            </h3>
          </Link>
        </div>
        {showActionButtons && <EditDeleteAction type="answer" itemId={id} />}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.imageUrl}
          alt="user avatar"
          value={author.name}
          title={` • asked ${getTimestamp(new Date(createdTime))}`}
          href={`/profile/${author.id}`}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />

        <div className="flex-center gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="like icon"
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
        </div>
      </div>
    </div>
  );
};

export default AnswerCard;
