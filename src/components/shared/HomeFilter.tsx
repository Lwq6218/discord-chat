import { HomePageFilters } from '@/constants/filter';
import { Button } from '../ui/button';
import { formUrlQuery } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function HomeFilter() {
  const [searchParams] = useSearchParams();
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: null,
      });
      navigate(newUrl);
    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: item.toLowerCase(),
      });
      navigate(newUrl);
    }
  };
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((filter) => (
        <Button
          key={filter.value}
          onClick={() => {}}
          onClickCapture={() => handleTypeClick(filter.value)}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === filter.value
              ? 'bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400'
              : 'bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300'
          }`}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
}
