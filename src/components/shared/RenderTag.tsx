import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface Props {
  _id: string;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}
export default function RenderTag({
  _id,
  name,
  totalQuestions,
  showCount,
}: Props) {
  return (
    <>
      <Link to={`/tags/${_id}`} className="flex justify-between gap-2">
        <Badge className="subtle-medium text-light400_light500 background-light800_dark300 rounded-md border-none px-4 py-2 uppercase">
          {name}
        </Badge>
        {showCount && (
          <p className="small-medium text-dark500_light700">{totalQuestions}</p>
        )}
      </Link>
    </>
  );
}
