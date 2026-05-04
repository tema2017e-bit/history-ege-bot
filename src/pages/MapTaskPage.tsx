import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopBar } from '../components/ui/TopBar';
import MapViewer from '../components/map/MapViewer';
import { getMapById } from '../data/mapData';
import { getMapQuestion, getMapHint, getCorrectZoneId, GeneratedMapQuestion } from '../utils/mapQuestionEngine';
import { MapZone } from '../types/mapTypes';

type AnswerState = 'idle' | 'correct' | 'wrong';

const MapTaskPage: React.FC = () => {
  const { mapId } = useParams<{ mapId: string }>();
  const navigate = useNavigate();
  const map = getMapById(mapId || '');

  const [question, setQuestion] = useState<GeneratedMapQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const generateNewQuestion = useCallback(() => {
    if (!map) return;
    const q = getMapQuestion(map);
    setQuestion(q);
    setSelectedAnswer(null);
    setAnswerState('idle');
    setShowHint(false);
  }, [map]);

  useEffect(() => {
    if (map) generateNewQuestion();
  }, [map, generateNewQuestion]);

  if (!map || !question) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-surface-400 text-lg mb-2">😕</p>
          <p className="text-surface-500">Карта не найдена</p>
          <button
            onClick={() => navigate('/maps')}
            className="mt-4 text-primary-500 hover:text-primary-600 font-medium text-sm"
          >
            ← К списку карт
          </button>
        </div>
      </div>
    );
  }

  const handleOptionClick = (option: string) => {
    if (answerState !== 'idle') return;
    setSelectedAnswer(option);
    const isCorrect = option === question.correctAnswer;
    setAnswerState(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setCorrectCount(prev => prev + 1);
    setQuestionCount(prev => prev + 1);
  };

  const handleZoneClick = (zone: MapZone) => {
    if (answerState !== 'idle') return;
    if (!question.relatedZoneId) return;
    setSelectedAnswer(zone.meaning);
    const isCorrect = zone.id === question.relatedZoneId;
    setAnswerState(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setCorrectCount(prev => prev + 1);
    setQuestionCount(prev => prev + 1);
  };

  const handleHint = () => {
    if (!showHint) {
      setHintText(getMapHint(map, question));
    }
    setShowHint(!showHint);
  };

  const correctZoneId = answerState === 'correct' ? getCorrectZoneId(question) : undefined;
  const wrongZoneId = answerState === 'wrong' && question.relatedZoneId
    ? (selectedAnswer === question.correctAnswer ? undefined : question.relatedZoneId)
    : undefined;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 pb-24">
      <TopBar />

      <div className="max-w-lg mx-auto px-4 pt-4 pb-40">
        {/* Хедер с навигацией и счётом */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate('/maps')}
            className="flex items-center gap-1 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Карты
          </button>
          <div className="flex items-center gap-3 text-xs text-surface-400">
            {questionCount > 0 && (
              <span className="bg-surface-100 dark:bg-surface-800 px-2.5 py-1 rounded-full">
                ✅ {correctCount}/{questionCount}
              </span>
            )}
          </div>
        </div>

        {/* Инфо о карте */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-3 mb-4">
          <div className="flex items-center gap-2">
            <span>🗺️</span>
            <div>
              <h2 className="font-semibold text-surface-800 dark:text-surface-100 text-sm">{map.title}</h2>
              <p className="text-xs text-surface-400">{map.period} · {map.zones.length} обозначений</p>
            </div>
          </div>
        </div>

        {/* Вопрос */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-4 mb-3">
          <p className="text-sm font-semibold text-surface-800 dark:text-surface-100 leading-relaxed">
            {question.prompt}
          </p>
        </div>

        {/* Карта */}
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 overflow-hidden mb-3">
          <MapViewer
            map={map}
            onZoneClick={handleZoneClick}
            highlightCorrect={correctZoneId}
            highlightWrong={wrongZoneId}
          />
        </div>

        {/* Варианты ответов */}
        <div className="space-y-2 mb-3">
          {question.options.map((option, i) => {
            let btnClass = 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-700';
            if (answerState === 'correct' && option === question.correctAnswer) {
              btnClass = 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300';
            } else if (answerState === 'wrong' && option === selectedAnswer) {
              btnClass = 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300';
            } else if (answerState === 'wrong' && option === question.correctAnswer) {
              btnClass = 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300';
            }

            return (
              <button
                key={i}
                onClick={() => handleOptionClick(option)}
                disabled={answerState !== 'idle'}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all ${btnClass} ${
                  answerState === 'idle' ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'
                }`}
              >
                <span className="text-sm font-medium">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Подсказка */}
        <button
          onClick={handleHint}
          className="w-full text-sm text-primary-500 hover:text-primary-600 font-medium mb-3 py-2 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
        >
          {showHint ? 'Скрыть подсказку' : '💡 Показать подсказку'}
        </button>
        {showHint && (
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-3 mb-3">
            <p className="text-sm text-primary-700 dark:text-primary-300">{hintText}</p>
          </div>
        )}

        {/* Объяснение после ответа */}
        {answerState !== 'idle' && (
          <div className={`rounded-xl p-4 mb-3 ${
            answerState === 'correct'
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <p className={`font-bold mb-1 text-sm ${
              answerState === 'correct' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}>
              {answerState === 'correct' ? '✓ Правильно!' : '✗ Неправильно'}
            </p>
            <p className="text-xs text-surface-600 dark:text-surface-300 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Кнопка "Далее" */}
        {answerState !== 'idle' && (
          <button
            onClick={generateNewQuestion}
            className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white py-3 rounded-xl font-medium text-sm transition-colors"
          >
            Следующий вопрос →
          </button>
        )}
      </div>
    </div>
  );
};

export default MapTaskPage;