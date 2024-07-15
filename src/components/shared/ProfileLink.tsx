import { Link } from 'react-router-dom';

interface Props {
  imgUrl: string;
  href?: string;
  title: string;
}
export default function ProfileLink({ imgUrl, href, title }: Props) {
  return (
    <div className="flex-center gap-1">
      <img src={imgUrl} alt="icon" width={20} height={20} />
      {href ? (
        <Link
          to={href}
          target="_blank"
          className="paragraph-medium text-blue-500"
        >
          {title}
        </Link>
      ) : (
        <p className="paragraph-medium text-dark400_light700">{title}</p>
      )}
    </div>
  );
}
