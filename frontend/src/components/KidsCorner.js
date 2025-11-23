import React, { useState } from "react";
import { 
  Gamepad2,
  BookOpen,
  Palette,
  Play,
  Clock,
  Users,
  Shield,
  Download,
  Star,
  Volume2,
  Heart,
  Sparkles,
  Target,
  Award,
  ChevronRight,
  Camera,
  Smartphone,
  FileText,
  Lock,
  CheckCircle,
  Baby,
  Lightbulb,
  Gift
} from 'lucide-react';

const KidsCorner = () => {
  const [activeTab, setActiveTab] = useState("games");
  const [playingStory, setPlayingStory] = useState(null);

  const games = [
    {
      id: 1,
      title: "Order in the Court!",
      icon: Target,
      description: "Match the laws with their meanings in this fun memory game.",
      age: "6+",
      players: "1-2",
      difficulty: "Easy",
      rating: 4.8,
      completionTime: "15 min",
      isNew: true,
      category: "Memory"
    },
    {
      id: 2,
      title: "Right or Wrong?",
      icon: CheckCircle,
      description: "Decide if actions are right or wrong according to basic laws.",
      age: "5+",
      players: "1",
      difficulty: "Beginner",
      rating: 4.9,
      completionTime: "10 min",
      isNew: false,
      category: "Decision"
    },
    {
      id: 3,
      title: "Legal Eagle Adventure",
      icon: Sparkles,
      description: "Help Legal Eagle solve puzzles to restore justice in the city.",
      age: "8+",
      players: "1",
      difficulty: "Medium",
      rating: 4.7,
      completionTime: "25 min",
      isNew: true,
      category: "Adventure"
    }
  ];

  const stories = [
    {
      id: 1,
      title: "The Honest Judge",
      icon: Award,
      description: "A story about a judge who always tells the truth, no matter what.",
      duration: "5 min",
      moral: "Honesty",
      rating: 4.9,
      isAudioAvailable: true,
      ageGroup: "5-8 years",
      category: "Values"
    },
    {
      id: 2,
      title: "The Little Lawyer",
      icon: Heart,
      description: "A young girl helps her neighbors solve problems using fairness.",
      duration: "7 min",
      moral: "Justice",
      rating: 4.8,
      isAudioAvailable: true,
      ageGroup: "6-10 years",
      category: "Justice"
    },
    {
      id: 3,
      title: "The Rights Rangers",
      icon: Shield,
      description: "Superheroes who protect children's rights around the world.",
      duration: "10 min",
      moral: "Rights",
      rating: 4.7,
      isAudioAvailable: true,
      ageGroup: "8-12 years",
      category: "Rights"
    }
  ];

  const activities = [
    {
      id: 1,
      title: "Color Your Rights",
      icon: Palette,
      description: "Download and color pages about children's rights and laws.",
      type: "Printable",
      difficulty: "All Ages",
      downloadCount: "12K+",
      category: "Creative"
    },
    {
      id: 2,
      title: "AR Court Tour",
      icon: Smartphone,
      description: "Point your camera to see a virtual courtroom come to life!",
      type: "Augmented Reality",
      difficulty: "8+",
      downloadCount: "8K+",
      category: "Technology"
    },
    {
      id: 3,
      title: "Lawyer Dress Up",
      icon: Gift,
      description: "Dress up virtual characters in different legal professions.",
      type: "Interactive",
      difficulty: "6+",
      downloadCount: "15K+",
      category: "Role Play"
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
      case 'Easy':
      case 'All Ages':
        return 'bg-green-100 text-green-700';
      case 'Medium':
      case '6+':
      case '8+':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Memory': return Target;
      case 'Decision': return CheckCircle;
      case 'Adventure': return Sparkles;
      case 'Values': return Heart;
      case 'Justice': return Award;
      case 'Rights': return Shield;
      case 'Creative': return Palette;
      case 'Technology': return Smartphone;
      case 'Role Play': return Gift;
      default: return Star;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "games":
        return (
          <div className="pro-grid lg:grid-cols-3 md:grid-cols-2 pro-gap-6">
            {games.map(item => {
              const IconComponent = item.icon;
              const CategoryIcon = getCategoryIcon(item.category);
              return (
                <div key={item.id} className="pro-card group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden">
                  {item.isNew && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white pro-text-xs px-3 py-1 pro-rounded-lg font-bold z-10">
                      NEW!
                    </div>
                  )}
                  
                  <div className="pro-p-6">
                    <div className="pro-flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 pro-rounded-xl pro-flex-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-purple-600" />
                      </div>
                      <div className="pro-flex items-center pro-gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="pro-text-sm font-medium text-gray-700">{item.rating}</span>
                      </div>
                    </div>
                    
                    <h4 className="pro-heading-md text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="pro-text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                    
                    <div className="pro-flex flex-wrap items-center pro-gap-2 mb-4">
                      <span className={`pro-text-xs px-2 py-1 pro-rounded-lg font-medium ${getDifficultyColor(item.difficulty)}`}>
                        {item.difficulty}
                      </span>
                      <span className="pro-text-xs px-2 py-1 bg-blue-100 text-blue-700 pro-rounded-lg font-medium">
                        {item.category}
                      </span>
                    </div>
                    
                    <div className="pro-flex items-center justify-between pro-text-xs text-gray-500 mb-4">
                      <div className="pro-flex items-center pro-gap-1">
                        <Baby className="w-3 h-3" />
                        Age {item.age}
                      </div>
                      <div className="pro-flex items-center pro-gap-1">
                        <Users className="w-3 h-3" />
                        {item.players} player{item.players !== '1' ? 's' : ''}
                      </div>
                      <div className="pro-flex items-center pro-gap-1">
                        <Clock className="w-3 h-3" />
                        {item.completionTime}
                      </div>
                    </div>
                    
                    <button className="w-full pro-btn bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 pro-flex items-center justify-center pro-gap-2">
                      <Play className="w-4 h-4" />
                      Play Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      
      case "stories":
        return (
          <div className="pro-grid lg:grid-cols-3 md:grid-cols-2 pro-gap-6">
            {stories.map(item => {
              const IconComponent = item.icon;
              return (
                <div key={item.id} className="pro-card group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden">
                  <div className="pro-p-6">
                    <div className="pro-flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-cyan-200 pro-rounded-xl pro-flex-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="pro-flex items-center pro-gap-2">
                        {item.isAudioAvailable && (
                          <div className="w-8 h-8 bg-green-100 pro-rounded-lg pro-flex-center">
                            <Volume2 className="w-4 h-4 text-green-600" />
                          </div>
                        )}
                        <div className="pro-flex items-center pro-gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="pro-text-sm font-medium text-gray-700">{item.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="pro-heading-md text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="pro-text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                    
                    <div className="pro-flex flex-wrap items-center pro-gap-2 mb-4">
                      <span className="pro-text-xs px-2 py-1 bg-purple-100 text-purple-700 pro-rounded-lg font-medium">
                        Moral: {item.moral}
                      </span>
                      <span className="pro-text-xs px-2 py-1 bg-orange-100 text-orange-700 pro-rounded-lg font-medium">
                        {item.category}
                      </span>
                    </div>
                    
                    <div className="pro-flex items-center justify-between pro-text-xs text-gray-500 mb-4">
                      <div className="pro-flex items-center pro-gap-1">
                        <Clock className="w-3 h-3" />
                        {item.duration}
                      </div>
                      <div className="pro-flex items-center pro-gap-1">
                        <Baby className="w-3 h-3" />
                        {item.ageGroup}
                      </div>
                    </div>
                    
                    <div className="pro-flex pro-gap-2">
                      <button 
                        className="flex-1 pro-btn bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:from-blue-600 hover:to-cyan-600 pro-flex items-center justify-center pro-gap-2"
                        onClick={() => setPlayingStory(item.id)}
                      >
                        <BookOpen className="w-4 h-4" />
                        Read
                      </button>
                      {item.isAudioAvailable && (
                        <button className="pro-btn pro-btn-ghost pro-flex items-center justify-center pro-gap-2 w-auto px-4">
                          <Volume2 className="w-4 h-4" />
                          Listen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      
      case "activities":
        return (
          <div className="pro-grid lg:grid-cols-3 md:grid-cols-2 pro-gap-6">
            {activities.map(item => {
              const IconComponent = item.icon;
              return (
                <div key={item.id} className="pro-card group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden">
                  <div className="pro-p-6">
                    <div className="pro-flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-200 to-emerald-200 pro-rounded-xl pro-flex-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="pro-text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 pro-rounded-lg">
                        {item.downloadCount} downloads
                      </div>
                    </div>
                    
                    <h4 className="pro-heading-md text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      {item.title}
                    </h4>
                    <p className="pro-text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                    
                    <div className="pro-flex flex-wrap items-center pro-gap-2 mb-4">
                      <span className="pro-text-xs px-2 py-1 bg-indigo-100 text-indigo-700 pro-rounded-lg font-medium">
                        {item.type}
                      </span>
                      <span className={`pro-text-xs px-2 py-1 pro-rounded-lg font-medium ${getDifficultyColor(item.difficulty)}`}>
                        {item.difficulty}
                      </span>
                      <span className="pro-text-xs px-2 py-1 bg-pink-100 text-pink-700 pro-rounded-lg font-medium">
                        {item.category}
                      </span>
                    </div>
                    
                    <button className="w-full pro-btn bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 hover:from-green-600 hover:to-emerald-600 pro-flex items-center justify-center pro-gap-2">
                      {item.type === 'Printable' ? <Download className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {item.type === 'Printable' ? 'Download' : 'Explore'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <section className="pro-section bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="pro-container">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 pro-rounded-xl pro-flex-center mx-auto mb-6 relative overflow-hidden">
            <BookOpen className="w-10 h-10 text-white z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 animate-pulse"></div>
          </div>
          <h2 className="pro-heading-section text-gray-900 mb-4">
            Law Adventures for Kids
          </h2>
          <p className="pro-text-lead text-gray-600 max-w-3xl mx-auto mb-8">
            Fun and educational activities to help children understand laws, rights, and justice 
            in an age-appropriate and engaging way.
          </p>
          
          {/* Fun Stats */}
          <div className="pro-grid md:grid-cols-4 pro-gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 pro-rounded-xl pro-flex-center mx-auto mb-3">
                <Gamepad2 className="w-8 h-8 text-purple-600" />
              </div>
              <div className="pro-heading-lg font-bold text-gray-900">{games.length}</div>
              <div className="pro-text-sm text-gray-600">Fun Games</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 pro-rounded-xl pro-flex-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div className="pro-heading-lg font-bold text-gray-900">{stories.length}</div>
              <div className="pro-text-sm text-gray-600">Stories</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 pro-rounded-xl pro-flex-center mx-auto mb-3">
                <Palette className="w-8 h-8 text-green-600" />
              </div>
              <div className="pro-heading-lg font-bold text-gray-900">{activities.length}</div>
              <div className="pro-text-sm text-gray-600">Activities</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-orange-100 pro-rounded-xl pro-flex-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="pro-heading-lg font-bold text-gray-900">100%</div>
              <div className="pro-text-sm text-gray-600">Safe Content</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pro-flex justify-center mb-12">
          <div className="pro-flex bg-white pro-rounded-xl shadow-lg border border-gray-200 pro-p-2">
            <button
              className={`pro-flex items-center pro-gap-3 px-6 py-3 pro-rounded-lg transition-all duration-300 ${
                activeTab === "games" 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab("games")}
            >
              <Gamepad2 className="w-5 h-5" />
              <span className="font-medium">Games</span>
            </button>
            <button
              className={`pro-flex items-center pro-gap-3 px-6 py-3 pro-rounded-lg transition-all duration-300 ${
                activeTab === "stories" 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab("stories")}
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Stories</span>
            </button>
            <button
              className={`pro-flex items-center pro-gap-3 px-6 py-3 pro-rounded-lg transition-all duration-300 ${
                activeTab === "activities" 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab("activities")}
            >
              <Palette className="w-5 h-5" />
              <span className="font-medium">Activities</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="mb-16">
          {renderContent()}
        </div>

        {/* Safety Notice */}
        <div className="pro-dashboard-card bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-12">
          <div className="pro-flex items-center pro-gap-6">
            <div className="w-16 h-16 bg-green-500 pro-rounded-xl pro-flex-center flex-shrink-0">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="pro-heading-lg text-gray-900 mb-2 pro-flex items-center pro-gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Safe & Educational Content
              </h4>
              <p className="pro-text-body text-gray-700 mb-4">
                All content is child-friendly, ad-free, and designed with educational experts. 
                Parents can feel confident that their children are learning in a safe environment.
              </p>
              <div className="pro-flex flex-wrap items-center pro-gap-4">
                <div className="pro-flex items-center pro-gap-2 pro-text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  Age-appropriate content
                </div>
                <div className="pro-flex items-center pro-gap-2 pro-text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  No advertisements
                </div>
                <div className="pro-flex items-center pro-gap-2 pro-text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  Expert-designed activities
                </div>
                <div className="pro-flex items-center pro-gap-2 pro-text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  Privacy-focused
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parent Resources */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 pro-rounded-xl pro-p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 pro-rounded-xl pro-flex-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h3 className="pro-heading-xl text-gray-900 mb-3">For Parents & Teachers</h3>
            <p className="pro-text-body text-gray-700 max-w-2xl mx-auto">
              Access comprehensive resources to support your child's legal education journey. 
              Everything you need to guide them through understanding rights and responsibilities.
            </p>
          </div>
          
          <div className="pro-grid md:grid-cols-3 pro-gap-4">
            <button className="pro-btn pro-btn-primary bg-gradient-to-r from-blue-500 to-purple-500 border-0 hover:from-blue-600 hover:to-purple-600 pro-flex items-center justify-center pro-gap-2">
              <Download className="w-5 h-5" />
              Activity Guide
            </button>
            <button className="pro-btn pro-btn-primary bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:from-purple-600 hover:to-pink-600 pro-flex items-center justify-center pro-gap-2">
              <FileText className="w-5 h-5" />
              Lesson Plans
            </button>
            <button className="pro-btn pro-btn-primary bg-gradient-to-r from-green-500 to-blue-500 border-0 hover:from-green-600 hover:to-blue-600 pro-flex items-center justify-center pro-gap-2">
              <Shield className="w-5 h-5" />
              Safety Resources
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="pro-text-sm text-gray-600">
              Need help getting started? 
              <button className="text-blue-600 hover:text-blue-700 font-medium ml-1 hover:underline">
                Contact our education team
                <ChevronRight className="w-4 h-4 inline ml-1" />
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KidsCorner;