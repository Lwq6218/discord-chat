import Filter from '@/components/shared/Filter';
import Pagination from '@/components/shared/Pagination';
import UserCard from '@/components/shared/cards/UserCard';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { UserFilters } from '@/constants/filter';
import { listUsers } from '@/services/api/user';
import { Page, Profile } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

function CommunityPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState<Page<Profile>>();
  const [isLoading, setIsLoading] = useState(true);
  const userParams = useMemo(
    () => ({
      filter: searchParams.get('filter'),
      pageNum: searchParams.get('page'),
      q: searchParams.get('q'),
    }),
    [searchParams]
  );
  const usersQuery = useQuery({
    queryKey: ['users', userParams],
    queryFn: () => listUsers(userParams),
  });
  useEffect(() => {
    if (usersQuery.data) {
      setPage(usersQuery.data);
      setIsLoading(false);
    }
  }, [usersQuery.data]);

  if (isLoading) return null;
  const users = page?.list ?? [];
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{t('All Users')}</h1>
      <Link
        to="/devflow/ask-question"
        className="flex justify-end max-sm:w-full"
      ></Link>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/devflow/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for users"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex gap-4">
        {users.length > 0 ? (
          users.map((user) => <UserCard key={user.id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>{t('No users yet')}</p>
            <Link
              to="/user/sign-up"
              className="mt-2 font-bold text-accent-blue"
            >
              {t('Join to be the first!')}
            </Link>
          </div>
        )}
      </section>
      <div className="mt-10">
        {page && (
          <Pagination
            pageNum={+page.pageNum}
            pages={+page.pages}
            total={+page.total}
          />
        )}
      </div>
    </>
  );
}

export default CommunityPage;
