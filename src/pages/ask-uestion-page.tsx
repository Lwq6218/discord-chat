import Question from '@/components/shared/form/Question';
import { useTranslation } from 'react-i18next';

export default function AskQuestionPage() {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">{t('Ask a Question')}</h1>
      <div className="mt-9">
        <Question type="Add" />
      </div>
    </div>
  );
}
