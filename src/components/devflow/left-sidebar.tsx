import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

export default function LeftSidebar() {
  const { uid, signOut } = useAuth();
  const { t } = useTranslation();
  const pathname = useLocation().pathname;
  const sidebarLinks = [
    {
      imgURL: '/assets/icons/home.svg',
      route: 'questions',
      label: t('Questions'),
    },
    {
      imgURL: '/assets/icons/users.svg',
      route: 'community',
      label: t('Community'),
    },
    {
      imgURL: '/assets/icons/star.svg',
      route: 'collection',
      label: t('Collections'),
    },
    {
      imgURL: '/assets/icons/tag.svg',
      route: 'tags',
      label: t('Tags'),
    },
    {
      imgURL: '/assets/icons/user.svg',
      route: `profile/${uid}`,
      label: t('Profile'),
    },
    {
      imgURL: '/assets/icons/question.svg',
      route: 'ask-question',
      label: t('Ask a Question'),
    },
  ];
  return (
    <section className="custom-scrollbar flex h-screen flex-col justify-between overflow-y-auto border-r bg-[#f2F3F5] p-6 pt-36 shadow-light-300 dark:bg-[#2B2D31] dark:shadow-none lg:w-[266px]">
      <div className="flex flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;
          if (item.route === '/profile') {
            if (uid) {
              item.route = `${item.route}/${uid}`;
            } else {
              return null;
            }
          }
          return (
            <Link
              key={item.route}
              to={item.route}
              className={`${
                isActive
                  ? 'primary-gradient rounded-lg text-light-900'
                  : 'text-dark300_light900'
              } flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <img
                className={`${isActive ? '' : 'invert-colors'}`}
                src={item.imgURL}
                width={20}
                height={20}
                alt={item.label}
              />

              <p
                className={`${isActive ? 'base-bold' : 'base-medium'} max-lg:hidden`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
      <Button
        className="small-medium btn-tertiary text-dark400_light900 light-border-2 mb-10 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
        onClick={(e) => {
          e.stopPropagation();
          signOut();
        }}
      >
        <span className="max-lg:hidden">{t('Sign out')}</span>
        <img
          src="/assets/icons/sign-up.svg"
          width={20}
          height={20}
          alt="sign out"
          className="invert-colors lg:hidden"
        />
      </Button>
    </section>
  );
}
