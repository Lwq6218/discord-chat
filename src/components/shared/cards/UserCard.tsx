import RenderTag from '@/components/shared/RenderTag';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface Props {
  user: {
    id: string;
    imageUrl: string;
    name: string;
    nickName: string;
  };
}

export default function UserCard({ user }: Props) {
  const interactedTags = [
    { id: '1', name: 'Next' },
    { id: '2', name: 'Prism' },
    { id: '3', name: 'Docker' },
  ];
  return (
    <Link
      to={`/devflow/profile/${user.id}`}
      className="shadow-light100_darknone max-xs:min-w-full xs:w-[260px] w-full"
    >
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <img
          src={user.imageUrl}
          alt="user profile picture"
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">
            {user.name}
          </h3>
          <p className="body-regular text-dark500_light500 mt-2">
            @{user.nickName}
          </p>
        </div>
        <div className="mt-5">
          {interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags.map((tag) => (
                <RenderTag key={tag.id} _id={tag.id} name={tag.name} />
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </article>
    </Link>
  );
}
