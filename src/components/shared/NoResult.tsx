import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  description: string;
  link?: string;
  linkTitle?: string;
}
export default function NoResult({
  title,
  description,
  link,
  linkTitle,
}: Props) {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <img
        src="/assets/images/light-illustration.png"
        alt="No result illustration"
        width={270}
        height={200}
        className="block object-contain dark:hidden"
      />

      <img
        src="/assets/images/dark-illustration.png"
        alt="No result illustration"
        width={270}
        height={200}
        className="hidden object-contain dark:flex"
      />
      <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
        {description}
      </p>
      {link && linkTitle && (
        <Link to={link}>
          <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900">
            {linkTitle}
          </Button>
        </Link>
      )}
    </div>
  );
}
