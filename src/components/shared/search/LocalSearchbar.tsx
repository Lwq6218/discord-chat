import { Input } from '@/components/ui/input';
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

interface Props {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}
export default function LocalSearchbar({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: Props) {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [search, setSearch] = useState(query || '');
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'q',
          value: search,
        });
        navigate(newUrl);
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: ['q'],
          });

          navigate(newUrl);
        }
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, route, pathname, navigate, searchParams, query]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses} `}
    >
      {iconPosition === 'left' && (
        <img
          className="cursor-pointer"
          src={imgSrc}
          alt={placeholder}
          width={24}
          height={24}
        />
      )}
      <Input
        type="text"
        placeholder={t(placeholder)}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
      />

      {iconPosition === 'right' && (
        <img
          className="cursor-pointer"
          src={imgSrc}
          alt={placeholder}
          width={24}
          height={24}
        />
      )}
    </div>
  );
}
