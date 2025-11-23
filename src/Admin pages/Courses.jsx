import React from 'react';
import { BookOpen, FileText, Video, Users, TrendingUp, Star, Clock } from 'lucide-react';

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: 'Contract Law Fundamentals',
      instructor: 'Dr. Rajesh Kumar',
      enrolled: 1234,
      rating: 4.8,
      duration: '12 hours',
      lessons: 45,
      status: 'published',
      revenue: 245600,
      thumbnail: '📚'
    },
    {
      id: 2,
      title: 'Criminal Procedure Code',
      instructor: 'Adv. Priya Sharma',
      enrolled: 989,
      rating: 4.6,
      duration: '10 hours',
      lessons: 38,
      status: 'published',
      revenue: 198900,
      thumbnail: '⚖️'
    },
    {
      id: 3,
      title: 'Constitutional Law',
      instructor: 'Prof. Amit Patel',
      enrolled: 876,
      rating: 4.9,
      duration: '15 hours',
      lessons: 52,
      status: 'published',
      revenue: 175200,
      thumbnail: '📜'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
          Course Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage all courses and learning content
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
            <div className="text-5xl mb-4">{course.thumbnail}</div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{course.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">by {course.instructor}</p>
            
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Enrolled</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white">{course.enrolled}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Rating</p>
                <p className="text-lg font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{course.rating}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{course.duration}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Revenue</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">₹{(course.revenue / 1000).toFixed(0)}K</p>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium">
                Edit Course
              </button>
              <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
