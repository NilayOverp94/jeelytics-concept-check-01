import { CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MCQQuestion } from '@/types/jee';
import DOMPurify from 'dompurify';

interface QuestionReviewProps {
  questions: MCQQuestion[];
  userAnswers: string[];
  correctAnswers: string[];
  useAI?: boolean;
}

export function QuestionReview({ questions, userAnswers, correctAnswers, useAI = false }: QuestionReviewProps) {
  // Helper function to safely render HTML content for AI questions
  const createSafeMarkup = (html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  };
  return (
    <Card className="card-jee mb-8 animate-scale-in">
      <CardHeader>
        <CardTitle>Question Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const correctAnswer = correctAnswers[index];
          const isCorrect = userAnswer && userAnswer === correctAnswer;
          const userOption = question.options.find(opt => opt.label === userAnswer);
          const correctOption = question.options.find(opt => opt.label === correctAnswer);

          return (
            <div key={`question-${index}-${question.id || question.question.slice(0,10)}`} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  {useAI ? (
                    <div 
                      className="font-medium mb-2"
                      dangerouslySetInnerHTML={createSafeMarkup(`Question ${index + 1}: ${question.question}`)}
                    />
                  ) : (
                    <div className="font-medium mb-2">
                      Question {index + 1}: {question.question}
                    </div>
                  )}
                  <div className="space-y-1 text-sm">
                    <div className={`${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      Your answer: {userAnswer ? (
                        useAI ? (
                          <span>
                            {userAnswer}. <span dangerouslySetInnerHTML={createSafeMarkup(userOption?.text || '')} />
                          </span>
                        ) : (
                          `${userAnswer}. ${userOption?.text}`
                        )
                      ) : 'Not answered'}
                    </div>
                    {!isCorrect && (
                      <div className="text-green-600 dark:text-green-400">
                        Correct answer: {correctAnswer}. {useAI ? (
                          <span dangerouslySetInnerHTML={createSafeMarkup(correctOption?.text || '')} />
                        ) : (
                          correctOption?.text
                        )}
                      </div>
                    )}
                    <div className="text-muted-foreground bg-muted/50 p-2 rounded">
                      <strong>Explanation:</strong> {useAI ? (
                        <span dangerouslySetInnerHTML={createSafeMarkup(question.explanation)} />
                      ) : (
                        question.explanation
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}