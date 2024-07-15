import Question from '@/components/shared/form/Question';
import { getQuestionById } from '@/services/api/question';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export default function QuestionEditPage() {
  const { questionId } = useParams();
  const questionQuery = useQuery({
    queryKey: ['question', questionId],
    queryFn: () => getQuestionById(questionId!),
  });
  const { data: question } = questionQuery;
  if (!question) return null;
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-9">
        <Question type="Edit" question={question} />
      </div>
    </>
  );
}
