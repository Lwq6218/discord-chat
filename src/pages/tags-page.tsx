import Filter from '@/components/shared/Filter';

import NoResult from '@/components/shared/NoResult';
import Pagination from '@/components/shared/Pagination';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { TagFilters } from '@/constants/filter';
import { listTags } from '@/services/api/tag';
import { Page, Tag } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

export default function TagsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState<Page<Tag>>();
  const [isLoading, setIsLoading] = useState(true);

  const tagParams = useMemo(
    () => ({
      filter: searchParams.get('filter'),
      pageNum: searchParams.get('page'),
      q: searchParams.get('q'),
    }),
    [searchParams]
  );
  const tagsQuery = useQuery({
    queryKey: ['tags', tagParams],
    queryFn: () => listTags(tagParams),
  });

  useEffect(() => {
    if (tagsQuery.data) {
      setPage(tagsQuery.data);
      setIsLoading(false);
    }
  }, [tagsQuery.data]);

  if (isLoading) return null;
  const tags = page?.list ?? [];
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{t('All Tags')}</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/devflow/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for tags"
          otherClasses="flex-1"
        />

        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Link
              to={`/tags/${tag.id}`}
              key={tag.id}
              className="shadow-light100_darknone"
            >
              <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                <div className="background-light800_dark400 w-fit rounded-xl px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>

                <p className="small-medium text-dark400_light500 mt-3.5">
                  <span className="body-semibold primary-text-gradient mr-2.5">
                    {tag.questionCount}+
                  </span>
                  {t('Questions')}
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title={t('No Tags Found')}
            description={t('It looks like there are no tags found.')}
            link="/ask-question"
            linkTitle="Ask a question"
          />
        )}
      </section>

      <div className="mt-10">
        {page && (
          <Pagination
            pages={+page.pages}
            total={+page.total}
            pageNum={+page.pageNum}
          />
        )}
      </div>
    </>
  );
}
