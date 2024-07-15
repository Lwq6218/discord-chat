import AnswerTab from '@/components/shared/AnswerTab';
import ProfileLink from '@/components/shared/ProfileLink';
import QuestionTab from '@/components/shared/QuestionTab';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getJoinedDate } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { getUserById } from '@/services/api/user';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

export default function ProfilePage() {
  const { profileId } = useParams();
  const { uid } = useAuth();
  const userQuery = useQuery({
    queryKey: ['user', profileId],
    queryFn: () => getUserById(profileId!),
  });
  const userInfo = userQuery.data;
  const { t } = useTranslation();
  if (!userInfo) return null;
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <img
            src={userInfo.imageUrl}
            alt="profile picture"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{userInfo.name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{userInfo.nickName}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {userInfo && (
                <ProfileLink
                  imgUrl="/assets/icons/calendar.svg"
                  title={getJoinedDate(new Date(userInfo.createTime!))}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {uid === userInfo.id && (
            <Link to={`/devflow/profile/edit/${uid}`}>
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                {t('Edit Profile')}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* <Stats
        reputation={userInfo.reputation}
        totalQuestions={userInfo.totalQuestions}
        totalAnswers={userInfo.totalAnswers}
        badges={userInfo.badgeCounts}
      /> */}

      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              {t('Top Posts')}
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              {t('Answers')}
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <QuestionTab userId={userInfo.id} />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <AnswerTab
              //   searchParams={searchParams}
              userId={userInfo.id}
              uid={uid!}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
