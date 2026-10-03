import React, { useState, useEffect } from 'react';
import { Flame, Star, Trophy, Lock, Play, RefreshCw, CheckCircle, XCircle, ArrowRight, Award } from 'lucide-react';

export default function LearningProgress() {
  const [stats, setStats] = useState({ streak: 0, xp: 0, badges: 0 });
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonState, setLessonState] = useState('question'); // 'question', 'correct', 'incorrect'
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const fetchProgress = () => {
    setLoading(true);
    fetch("http://localhost:8000/api/progress")
      .then(r => r.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Backend offline", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const completeLesson = () => {
    fetch("http://localhost:8000/api/progress/add_xp", { method: "POST" })
      .then(r => r.json())
      .then(data => {
        setStats(data);
        setTimeout(() => {
          setActiveLesson(null);
        }, 3000);
      })
      .catch(err => console.error("Error adding XP", err));
  };

  const currentLevel = Math.floor(stats.xp / 500) + 1;
  const xpToNext = 500 - (stats.xp % 500);
  const progressPercent = ((stats.xp % 500) / 500) * 100;

  const lessons = [
    {
      id: 1,
      title: "Python Basics: API Integration",
      icon: "py",
      xp: 50,
      locked: false,
      question: "Which Python function is used to output text to the screen?",
      options: ["console.log()", "print()", "echo()", "display()"],
      answer: 1
    },
    {
      id: 2,
      title: "Web Design: HTML Forms",
      icon: "</>",
      xp: 100,
      locked: currentLevel < 2,
      question: "Which HTML tag is used to create a text input field?",
      options: ["<text>", "<input type='text'>", "<textbox>", "<form>"],
      answer: 1
    }
  ];

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    if (index === activeLesson.answer) {
      setLessonState('correct');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Correct! Great job."));
      }
      completeLesson();
    } else {
      setLessonState('incorrect');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Not quite. Try again."));
      }
      setTimeout(() => {
        setLessonState('question');
        setSelectedAnswer(null);
      }, 2000);
    }
  };

  if (activeLesson) {
    return (
      <div className="flex flex-col h-full space-y-6">
        <div className="bg-nx-panel border-l-8 border-[#3b82f6] rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black mb-1">Interactive Lesson</h2>
            <p className="text-nx-text-muted font-medium">{activeLesson.title}</p>
          </div>
          <button 
            onClick={() => setActiveLesson(null)}
            className="text-nx-text-muted hover:text-nx-text font-bold"
          >
            Cancel Lesson
          </button>
        </div>

        <div className="flex-1 bg-nx-panel border border-nx-border rounded-xl shadow-sm flex flex-col items-center justify-center p-12">
          
          {lessonState === 'question' && (
            <div className="w-full max-w-3xl space-y-8 animate-in fade-in zoom-in duration-300">
              <h3 className="text-4xl font-black text-center mb-10 leading-tight">
                {activeLesson.question}
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                {activeLesson.options.map((opt, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="border-4 border-nx-border hover:border-[#3b82f6] rounded-2xl p-6 text-2xl font-bold shadow-sm hover:shadow-md transition-all active:scale-95 text-left bg-gray-50 hover:bg-blue-50"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {lessonState === 'incorrect' && (
            <div className="flex flex-col items-center text-red-500 animate-in shake">
              <XCircle className="w-32 h-32 mb-6" />
              <h3 className="text-4xl font-black">Oops! That's not right.</h3>
              <p className="text-xl font-bold mt-2 text-gray-500">Try again...</p>
            </div>
          )}

          {lessonState === 'correct' && (
            <div className="flex flex-col items-center text-emerald-500 animate-in zoom-in duration-500">
              <div className="relative">
                <CheckCircle className="w-40 h-40 mb-6 relative z-10" />
                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              </div>
              <h3 className="text-5xl font-black mb-4">Correct!</h3>
              <div className="bg-emerald-100 text-emerald-800 px-8 py-4 rounded-full font-black text-2xl flex items-center shadow-lg transform scale-110">
                <Star className="w-8 h-8 mr-3 text-yellow-500 fill-yellow-500" />
                +{activeLesson.xp} XP Earned!
              </div>
              <p className="text-lg font-bold mt-8 text-gray-500 animate-pulse">Saving to backend database...</p>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-8">
      <div className="bg-nx-panel border-l-8 border-nx-warning rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black mb-1">My Learning Progress</h2>
          <p className="text-nx-text-muted font-medium text-lg">Interactive quizzes directly sync your XP with the SQLite backend.</p>
        </div>
        <button onClick={fetchProgress} className="p-3 bg-nx-border rounded-full hover:bg-gray-300 transition-colors shadow-sm">
          <RefreshCw className={`w-5 h-5 text-nx-text-muted ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        
        {/* Level Card */}
        <div className="col-span-4 bg-nx-panel border-4 border-nx-primary rounded-xl p-8 shadow-md flex items-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-nx-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
           <div className="w-24 h-24 bg-nx-primary text-white rounded-full flex items-center justify-center font-black text-4xl mr-8 shadow-inner border-4 border-blue-200">
             {currentLevel}
           </div>
           <div className="flex-1">
             <div className="flex justify-between items-end mb-2">
               <h3 className="text-2xl font-black text-nx-primary tracking-widest uppercase">Learner Level {currentLevel}</h3>
               <span className="font-bold text-gray-500">{xpToNext} XP to next level</span>
             </div>
             <div className="w-full bg-blue-100 rounded-full h-6 shadow-inner overflow-hidden">
                <div 
                  className="bg-nx-primary h-6 transition-all duration-1000 ease-out flex items-center justify-end px-2" 
                  style={{ width: `${progressPercent}%` }}
                >
                  <span className="text-white text-[10px] font-black">{Math.round(progressPercent)}%</span>
                </div>
             </div>
           </div>
        </div>

        <div className="bg-nx-panel border border-nx-border border-b-4 border-b-orange-400 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
             <Flame className="w-8 h-8 text-orange-500" />
           </div>
           <div className="text-4xl font-black mb-1">{stats.streak}</div>
           <div className="text-sm font-bold text-nx-text-muted tracking-widest uppercase">Day Streak</div>
        </div>
        
        <div className="col-span-2 bg-nx-panel border border-nx-border border-b-4 border-b-yellow-400 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
             <Star className="w-8 h-8 text-yellow-500" />
           </div>
           <div className="text-5xl font-black mb-1 transition-all duration-500 ease-out">{stats.xp.toLocaleString()}</div>
           <div className="text-sm font-bold text-nx-text-muted tracking-widest uppercase">Total Lifetime XP</div>
        </div>

        <div className="bg-nx-panel border border-nx-border border-b-4 border-b-purple-400 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
           <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
             <Award className="w-8 h-8 text-purple-500" />
           </div>
           <div className="text-4xl font-black mb-1">{stats.badges}</div>
           <div className="text-sm font-bold text-nx-text-muted tracking-widest uppercase">Badges Earned</div>
        </div>
      </div>

      <div className="flex-1 bg-transparent flex flex-col">
        <h3 className="text-xl font-black mb-6 flex items-center">Interactive Curriculum</h3>
        
        <div className="space-y-4">
          {lessons.map(lesson => (
            <div key={lesson.id} className={`bg-nx-panel border ${lesson.locked ? 'border-nx-border opacity-70' : 'border-nx-primary shadow-md hover:shadow-lg hover:-translate-y-1'} rounded-xl p-6 flex items-center justify-between transition-all`}>
               <div className="flex items-center">
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-6 font-serif italic text-2xl shadow-inner ${lesson.locked ? 'bg-gray-200 text-gray-400' : 'bg-nx-primary text-white'}`}>
                   {lesson.icon}
                 </div>
                 <div>
                   <h4 className={`text-xl font-black mb-1 ${lesson.locked ? 'text-gray-500' : ''}`}>{lesson.title}</h4>
                   <p className={`${lesson.locked ? 'text-gray-400' : 'text-nx-text-muted'} font-medium`}>
                     {lesson.locked ? `Reach Level ${currentLevel + 1} to unlock.` : 'Complete the interactive quiz to earn XP.'}
                   </p>
                 </div>
               </div>
               <div className="flex flex-col items-end">
                 {!lesson.locked ? (
                   <>
                     <span className="text-nx-primary font-black text-sm mb-2">+{lesson.xp} XP</span>
                     <button 
                       onClick={() => {
                         setLessonState('question');
                         setSelectedAnswer(null);
                         setActiveLesson(lesson);
                       }}
                       className="bg-nx-primary hover:bg-nx-primary-hover text-white px-8 py-3 rounded-lg font-bold shadow-sm transition-transform active:scale-95 flex items-center"
                     >
                       Start Lesson <ArrowRight className="w-5 h-5 ml-2" />
                     </button>
                   </>
                 ) : (
                   <div className="flex items-center text-gray-400 font-bold px-6 py-2">
                     <Lock className="w-5 h-5 mr-2" /> Locked
                   </div>
                 )}
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
