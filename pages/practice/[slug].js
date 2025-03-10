import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';
import Layout from '../../components/Layout';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// "deslugify" helper if you store your module name in the DB
function deslugify(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function TestEnvironmentPage({ moduleName, questions }) {
  const { data: session, status } = useSession();

  // We store current question index
  const [currentIndex, setCurrentIndex] = useState(0);
  // The user’s selected answer for the *current* question (A/B/C or "")
  const [selectedAnswer, setSelectedAnswer] = useState('');
  // Whether the user has submitted their answer for the current question
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (status === 'loading') {
    return (
      <Layout>
        <p>Loading session...</p>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <p className="text-gray-700">You must be signed in to view this page.</p>
        <button
          onClick={() => signIn()}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          Sign In
        </button>
      </Layout>
    );
  }

  // If no questions found, just show a message
  if (!questions || questions.length === 0) {
    return (
      <Layout>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {moduleName} Test
        </h2>
        <p>No questions found for this module.</p>
      </Layout>
    );
  }

  // Current question object
  const question = questions[currentIndex];

  // total question count
  const totalQuestions = questions.length;
  // 1-based index for display
  const questionNumber = currentIndex + 1;

  // Called when user selects A, B, or C
  const handleSelectAnswer = (answer) => {
    // If we haven't submitted, let them change the selection
    if (!isSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  // Called when user clicks "Submit"
  const handleSubmit = () => {
    if (!selectedAnswer) {
      alert('Please select an answer first!');
      return;
    }
    setIsSubmitted(true);
  };

  // Move to the next question
  const handleNext = () => {
    // Reset states for the next question
    setSelectedAnswer('');
    setIsSubmitted(false);
    setCurrentIndex((prev) => prev + 1);
  };

  // Determine if the user was correct
  const isCorrect = selectedAnswer === question.correct_answer;

  return (
    <Layout>
      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        {moduleName} Test
      </h2>
      {/* Simple progress indicator */}
      <p className="mb-6 text-gray-600">
        Question {questionNumber} of {totalQuestions}
      </p>

      <div className="bg-white p-6 rounded shadow max-w-2xl">
        {/* Question prompt */}
        <p className="text-lg font-medium text-gray-800 mb-4">
          {question.question_text}
        </p>

        {/* Multiple-choice options */}
        <div className="space-y-2">
          {['A', 'B', 'C'].map((choice) => {
            const choiceText = question[`answer_${choice.toLowerCase()}`]; // answer_a, answer_b, answer_c
            return (
              <label
                key={choice}
                className={`block p-3 border rounded cursor-pointer transition ${
                  selectedAnswer === choice
                    ? 'bg-blue-50 border-blue-400'
                    : 'bg-gray-50 border-gray-300'
                } ${
                  isSubmitted && choice === question.correct_answer
                    ? 'border-green-500'
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

        {/* Submit / Next buttons */}
        {!isSubmitted ? (
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Submit
          </button>
        ) : (
          <div className="mt-4">
            {/* Show correctness */}
            <p
              className={`text-lg font-semibold ${
                isCorrect ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isCorrect ? 'Correct!' : 'Incorrect.'}
            </p>
            {/* Show explanation */}
            <p className="text-gray-700 mt-2 italic">
              Explanation: {question.explanation}
            </p>

            {currentIndex < totalQuestions - 1 ? (
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleNext}
              >
                Next Question
              </button>
            ) : (
              <p className="mt-4 text-gray-800 font-semibold">
                You’ve reached the end of this test!
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

// -------------- SERVER-SIDE LOGIC -------------- //
export async function getServerSideProps(context) {
  const { slug } = context.params;
  // If you store module_name in the DB, e.g. "Statistics", "Probability Concepts", do this:
  const moduleName = deslugify(slug);

  // 1) Lookup the module in "modules" table by module_name => get ID
  const { data: moduleData, error: moduleError } = await supabase
    .from('modules')
    .select('id')
    .eq('module_name', moduleName)
    .single();

  if (moduleError || !moduleData) {
    console.error('Module not found:', moduleError);
    // No module => no questions
    return {
      props: {
        moduleName,
        questions: []
      }
    };
  }

  // 2) Fetch that module's questions
  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .eq('module_id', moduleData.id);

  if (questionsError) {
    console.error('Error fetching questions:', questionsError);
    return {
      props: {
        moduleName,
        questions: []
      }
    };
  }

  return {
    props: {
      moduleName,
      questions: questions || []
    }
  };
}
