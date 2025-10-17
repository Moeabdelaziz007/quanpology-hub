import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Video, 
  Image, 
  MapPin, 
  Plane, 
  ShoppingCart, 
  Bot, 
  Settings,
  Mic,
  MicOff,
  Command,
  Search,
  Zap,
  Brain,
  Target,
  TrendingUp,
  BarChart3
} from 'lucide-react';

// Mini-App Interface
interface MiniApp {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  category: 'productivity' | 'creative' | 'intelligence' | 'communication';
  status: 'idle' | 'loading' | 'active' | 'error';
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large';
  description: string;
  aiCapabilities: string[];
}

// Desktop Layout Interface
interface DesktopLayout {
  wallpaper: string;
  miniApps: MiniApp[];
  activeApp: string | null;
  voiceEnabled: boolean;
  commandPaletteOpen: boolean;
}

const QuantumOS: React.FC = () => {
  const [layout, setLayout] = useState<DesktopLayout>({
    wallpaper: 'quantum-gradient',
    miniApps: [
      {
        id: 'ai-notes',
        name: 'AI Notes',
        icon: FileText,
        category: 'productivity',
        status: 'idle',
        position: { x: 50, y: 50 },
        size: 'medium',
        description: 'Smart note-taking with voice transcription',
        aiCapabilities: ['Voice-to-text', 'Auto-summarization', 'Smart tagging']
      },
      {
        id: 'ai-studio',
        name: 'AI Studio VE03',
        icon: Video,
        category: 'creative',
        status: 'idle',
        position: { x: 200, y: 50 },
        size: 'medium',
        description: 'Video editing with AI assistance',
        aiCapabilities: ['Auto-editing', 'Scene detection', 'Smart transitions']
      },
      {
        id: 'ai-gallery',
        name: 'AI Gallery Nano',
        icon: Image,
        category: 'creative',
        status: 'idle',
        position: { x: 350, y: 50 },
        size: 'medium',
        description: 'Photo management with AI tagging',
        aiCapabilities: ['Auto-tagging', 'Face recognition', 'Smart search']
      },
      {
        id: 'ai-maps',
        name: 'AI Maps',
        icon: MapPin,
        category: 'communication',
        status: 'idle',
        position: { x: 50, y: 200 },
        size: 'medium',
        description: 'Google Maps integration with AI navigation',
        aiCapabilities: ['Voice navigation', 'Smart routing', 'Traffic prediction']
      },
      {
        id: 'ai-travel',
        name: 'AI Travel Agency',
        icon: Plane,
        category: 'communication',
        status: 'idle',
        position: { x: 200, y: 200 },
        size: 'medium',
        description: 'Trip planning with AI recommendations',
        aiCapabilities: ['Personalized itineraries', 'Price optimization', 'Real-time updates']
      },
      {
        id: 'ai-market',
        name: 'AI Market',
        icon: ShoppingCart,
        category: 'intelligence',
        status: 'idle',
        position: { x: 350, y: 200 },
        size: 'medium',
        description: 'E-commerce intelligence with AI insights',
        aiCapabilities: ['Price tracking', 'Trend analysis', 'Smart recommendations']
      },
      {
        id: 'agents-kit',
        name: 'AgentsKit',
        icon: Bot,
        category: 'intelligence',
        status: 'idle',
        position: { x: 50, y: 350 },
        size: 'medium',
        description: 'Multi-agent system management',
        aiCapabilities: ['Agent orchestration', 'Performance monitoring', 'Workflow automation']
      },
      {
        id: 'mcp-kit',
        name: 'MCP Kit',
        icon: Settings,
        category: 'intelligence',
        status: 'idle',
        position: { x: 200, y: 350 },
        size: 'medium',
        description: 'Model Context Protocol tools',
        aiCapabilities: ['Context management', 'Tool integration', 'Protocol optimization']
      },
      {
        id: 'revenue-hub',
        name: 'Revenue Intelligence Hub',
        icon: Target,
        category: 'intelligence',
        status: 'active',
        position: { x: 350, y: 350 },
        size: 'large',
        description: 'Business analytics with AI insights',
        aiCapabilities: ['Lead analysis', 'Competitor monitoring', 'Revenue optimization']
      }
    ],
    activeApp: 'revenue-hub',
    voiceEnabled: false,
    commandPaletteOpen: false
  });

  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState('');

  // Voice Recognition
  useEffect(() => {
    if (isListening) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCommand(transcript);
        processVoiceCommand(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  }, [isListening]);

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('open') && lowerCommand.includes('notes')) {
      openMiniApp('ai-notes');
    } else if (lowerCommand.includes('open') && lowerCommand.includes('studio')) {
      openMiniApp('ai-studio');
    } else if (lowerCommand.includes('open') && lowerCommand.includes('maps')) {
      openMiniApp('ai-maps');
    } else if (lowerCommand.includes('analyze') && lowerCommand.includes('revenue')) {
      openMiniApp('revenue-hub');
    }
  };

  const openMiniApp = (appId: string) => {
    setLayout(prev => ({
      ...prev,
      activeApp: appId,
      miniApps: prev.miniApps.map(app => 
        app.id === appId ? { ...app, status: 'active' } : { ...app, status: 'idle' }
      )
    }));
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    setLayout(prev => ({ ...prev, voiceEnabled: !prev.voiceEnabled }));
  };

  const toggleCommandPalette = () => {
    setLayout(prev => ({ ...prev, commandPaletteOpen: !prev.commandPaletteOpen }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Quantum Background Effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Desktop Container */}
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold text-white">QuantumOS</h1>
            </div>
            <div className="text-gray-300 text-sm">
              The AI Desktop Experience
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Voice Control */}
            <button
              onClick={toggleVoice}
              className={`p-3 rounded-full transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            
            {/* Command Palette */}
            <button
              onClick={toggleCommandPalette}
              className="p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all duration-300"
            >
              <Command className="w-5 h-5" />
            </button>
            
            {/* AI Status */}
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">AI Active</span>
            </div>
          </div>
        </div>

        {/* Command Palette */}
        {layout.commandPaletteOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-5 h-5 text-white" />
                <input
                  type="text"
                  placeholder="Type a command or ask AI..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                  autoFocus
                />
              </div>
              <div className="text-gray-300 text-sm">
                Try: "Open AI Notes", "Analyze revenue data", "Create new project"
              </div>
            </div>
          </div>
        )}

        {/* Mini-Apps Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {layout.miniApps.map((app) => {
            const IconComponent = app.icon;
            return (
              <div
                key={app.id}
                onClick={() => openMiniApp(app.id)}
                className={`group cursor-pointer transition-all duration-300 ${
                  app.size === 'large' ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <div className={`relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-purple-400/50 hover:scale-105 transition-all duration-300 ${
                  app.status === 'active' ? 'ring-2 ring-purple-400 bg-purple-500/20' : ''
                }`}>
                  {/* App Icon */}
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-4 rounded-xl ${
                      app.category === 'productivity' ? 'bg-blue-500/20 text-blue-400' :
                      app.category === 'creative' ? 'bg-purple-500/20 text-purple-400' :
                      app.category === 'intelligence' ? 'bg-green-500/20 text-green-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </div>
                  
                  {/* App Info */}
                  <div className="text-center">
                    <h3 className="text-white font-semibold mb-2">{app.name}</h3>
                    <p className="text-gray-300 text-sm mb-3">{app.description}</p>
                    
                    {/* AI Capabilities */}
                    <div className="flex flex-wrap gap-1 justify-center">
                      {app.aiCapabilities.slice(0, 2).map((capability, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                        >
                          {capability}
                        </span>
                      ))}
                      {app.aiCapabilities.length > 2 && (
                        <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                          +{app.aiCapabilities.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="absolute top-3 right-3">
                    <div className={`w-3 h-3 rounded-full ${
                      app.status === 'active' ? 'bg-green-400 animate-pulse' :
                      app.status === 'loading' ? 'bg-yellow-400 animate-spin' :
                      app.status === 'error' ? 'bg-red-400' :
                      'bg-gray-400'
                    }`}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Voice Command Display */}
        {isListening && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl p-4 z-50">
            <div className="flex items-center gap-3 text-white">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <span>Listening... Say a command</span>
            </div>
          </div>
        )}

        {/* Quick Actions Bar */}
        <div className="fixed bottom-8 right-8 flex flex-col gap-3">
          <button className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300">
            <Zap className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300">
            <TrendingUp className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300">
            <BarChart3 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantumOS;
