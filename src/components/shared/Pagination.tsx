import { Button } from '@/components/ui/button';
import { formUrlQuery } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Props {
  pageNum: number;
  pages: number;
  total: number;
}
export default function Pagination({ pageNum, pages }: Props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const isNext = pageNum < pages;
  const handleNavigation = (direction: string) => {
    const nextPageNumber = direction === 'next' ? pageNum + 1 : pageNum - 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: nextPageNumber.toString(),
    });
    navigate(newUrl);
  };
  if (!isNext && pageNum === 1) return null;
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        disabled={pageNum === 1}
        onClick={() => handleNavigation('prev')}
      >
        <p className="body-medium text-dark200_light800 body-medium">
          {t('Prev')}
        </p>
      </Button>
      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNum}</p>
      </div>

      <Button
        className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        disabled={!isNext}
        onClick={() => handleNavigation('next')}
      >
        {t('Next')}
      </Button>
    </div>
  );
}
