import { useState, useRef, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Layout from '../../components/Layout';

const supabaseModules = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_MODULES || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_MODULES || ''
);

function deslugify(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function TestEnvironmentPage({ moduleName, questions }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testSessionId, setTestSessionId] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Timer state
  const [startTime, setStartTime] = useState(null);

  // Set the start time when the component mounts
  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  if (status === 'loading') {
    return <Layout><p>Loading session...</p></Layout>;
  }

  if (!session) {
    return (
      <Layout>
        <p className="text-gray-700">You must be signed in to view this page.</p>
        <button
          onClick={() => signIn()}
          className="bg-gray-700 text-white px-4 py-2 rounded mt-4"
        >
          Sign In
        </button>
      </Layout>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Layout>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{moduleName} Test</h2>
        <p>No questions found for this module.</p>
      </Layout>
    );
  }

  const question = questions[currentIndex];
  const totalQuestions = questions.length;
  const questionNumber = currentIndex + 1;

  // Start test session and associate it with the logged-in user's user_id
  const startTestSession = async () => {
    if (!session?.user) return null;

    const testSessionData = {
      user_id: session.user.id,
      module_id: question.module_id,
      start_time: new Date(),
      question_count: totalQuestions,
    };

    const { data, error } = await supabaseModules
      .from('test_sessions')
      .insert([testSessionData])
      .select()
      .single();

    if (error) {
      console.error('🔥 Failed to start test session:', error);
      return null;
    }

    setTestSessionId(data.id);
    return data.id;
  };

  const handleSelectAnswer = (answer) => {
    if (!isSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      alert('Please select an answer first!');
      return;
    }

    setIsSubmitted(true);

    const isCorrect = selectedAnswer === question.correct_answer;
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    }

    let sessionId = testSessionId;
    if (!sessionId) {
      sessionId = await startTestSession();
      if (!sessionId) return;
    }

    await supabaseModules.from('test_answers').insert([
      {
        test_session_id: sessionId,
        user_id: session.user.id,
        question_id: question.id,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        answered_at: new Date(),
      },
    ]);

    // If last question, finish test session & update with time_spent
    if (currentIndex === totalQuestions - 1) {
      const finalScore = Math.round(
        ((correctAnswers + (isCorrect ? 1 : 0)) / totalQuestions) * 100
      );
      const endTime = Date.now();
      const timeSpent = Math.round((endTime - startTime) / 1000); // seconds

      const { error: updateError } = await supabaseModules
        .from('test_sessions')
        .update({
          end_time: new Date(),
          score: finalScore,
          time_spent: timeSpent,
        })
        .eq('id', sessionId);

      if (updateError) {
        console.error('❌ Failed to update test session:', updateError);
      } else {
        setIsRedirecting(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    }
  };

  const handleNext = () => {
    setSelectedAnswer('');
    setIsSubmitted(false);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          {moduleName} Test
        </h2>

        <div className="mb-4">
          <div className="w-full bg-gray-200 h-3 rounded-full">
            <div
              className="bg-gray-700 h-3 rounded-full"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-600 mt-2">
            Question {questionNumber} of {totalQuestions}
          </p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-lg font-medium text-gray-800 mb-4">{question.question_text}</p>

          <div className="space-y-3">
            {['A', 'B', 'C'].map((choice) => {
              const choiceText = question[`answer_${choice.toLowerCase()}`];
              return (
                <label
                  key={choice}
                  className={`block p-3 border rounded-lg cursor-pointer transition duration-200 ${
                    selectedAnswer === choice ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-300'
                  } ${
                    isSubmitted && choice === question.correct_answer
                      ? 'border-green-500 bg-green-100'
                      : isSubmitted && selectedAnswer === choice
                      ? 'border-red-500 bg-red-100'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={choice}
                    className="hidden"
                    checked={selectedAnswer === choice}
                    onChange={() => handleSelectAnswer(choice)}
                  />
                  <span className="font-bold mr-2">{choice})</span>
                  {choiceText}
                </label>
              );
            })}
          </div>

          {!isSubmitted ? (
            <button
              className="mt-6 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-blue-900 w-full"
              onClick={handleSubmit}
            >
              Submit Answer
            </button>
          ) : (
            <div className="mt-6 text-center">
              <p className={`text-lg font-semibold ${selectedAnswer === question.correct_answer ? 'text-green-600' : 'text-red-600'}`}>
                {selectedAnswer === question.correct_answer ? 'Correct!' : 'Incorrect.'}
              </p>
              <p className="text-gray-700 mt-2 italic">Explanation: {question.explanation}</p>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  className="mt-4 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-blue-900 w-full"
                  onClick={handleNext}
                >
                  Next Question
                </button>
              ) : (
                <p className="mt-4 text-gray-800 font-semibold">Test completed! Redirecting...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// Server-side: fetch module & questions
export async function getServerSideProps(context) {
  const { slug } = context.params;
  const moduleName = deslugify(slug);

  const { data: moduleData, error: moduleError } = await supabaseModules
    .from('modules')
    .select('id')
    .eq('module_name', moduleName)
    .single();

  if (moduleError || !moduleData) {
    return { props: { moduleName, questions: [] } };
  }

  const { data: questions, error: questionsError } = await supabaseModules
    .from('questions')
    .select('*')
    .eq('module_id', moduleData.id);

  return {
    props: { moduleName, questions: questions || [] },
  };
}
