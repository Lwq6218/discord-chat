import SettingAppearance from '@/components/setting/setting-appearance';
import SettingsProfilePage from '@/components/setting/setting-profile';
import NotFoundPage from '@/pages/404-page';
import AskQuestionPage from '@/pages/ask-uestion-page';
import AuthPage from '@/pages/auth-page';
import ChannelPage from '@/pages/chennel-page';
import CollectionPage from '@/pages/collection-page';
import CommunityPage from '@/pages/community-page';
import ConversationPage from '@/pages/conversation-page';
import DevflowPage from '@/pages/devflow-page';
import HomePage from '@/pages/home-page';
import InviteCodePage from '@/pages/invte-page';
import ProfileEditPage from '@/pages/profile-edit-page';
import ProfilePage from '@/pages/profile-page';
import QuestionDetailPage from '@/pages/question-detail-page';
import QuestionEditPage from '@/pages/question-edit-page';
import QuestionsPage from '@/pages/questions-page';
import ServerPage from '@/pages/server-page';
import SettingPage from '@/pages/setting-page';
import SignInPage from '@/pages/sign-in';
import SignUpPage from '@/pages/sign-up';
import TagsPage from '@/pages/tags-page';
import ProtectedRoute from '@/routes/protected-route';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const Router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <HomePage />,
        children: [
          {
            path: 'servers/:serverId',
            element: <ServerPage />,
            children: [
              {
                path: 'channels/:channelId',
                element: <ChannelPage />,
              },
              {
                path: 'conversations/:memberId',
                element: <ConversationPage />,
              },
            ],
          },
          {
            element: <DevflowPage />,
            path: 'devflow',
            children: [
              {
                path: 'community',
                element: <CommunityPage />,
              },
              {
                path: 'collection',
                element: <CollectionPage />,
              },
              {
                path: 'tags',
                element: <TagsPage />,
              },

              {
                path: 'profile/:profileId',
                element: <ProfilePage />,
              },
              {
                path: 'profile/edit/:profileId',
                element: <ProfileEditPage />,
              },
              {
                path: 'question/:questionId',
                element: <QuestionDetailPage />,
              },
              {
                path: 'question/edit/:questionId',
                element: <QuestionEditPage />,
              },
              {
                path: 'questions',
                element: <QuestionsPage />,
              },
              {
                path: 'ask-question',
                element: <AskQuestionPage />,
              },
            ],
          },
          {
            path: 'invite/:inviteCode',
            element: <InviteCodePage />,
          },
        ],
      },
    ],
  },
  {
    element: <AuthPage />,
    children: [
      {
        path: '/user/sign-in',
        element: <SignInPage />,
      },
      {
        path: '/user/sign-up',
        element: <SignUpPage />,
      },
    ],
  },
  {
    path: 'settings',
    element: <SettingPage />,
    children: [
      { path: 'profile', element: <SettingsProfilePage /> },
      { path: 'appearance', element: <SettingAppearance /> },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const AppRouter = () => <RouterProvider router={Router} />;
