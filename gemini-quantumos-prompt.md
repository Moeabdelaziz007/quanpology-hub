# QUANTUMOS AI DESKTOP - COMPREHENSIVE DEVELOPMENT PROMPT

## PROJECT OVERVIEW
You are building "QuantumOS - The AI Desktop" - a revolutionary voice-first AI operating system with intelligent mini-apps. This is a React/TypeScript web application that mimics a desktop OS experience with AI-powered applications.

## CORE ARCHITECTURE

### 1. DESKTOP LAYOUT SYSTEM
```typescript
// Desktop Container Structure
interface DesktopLayout {
  wallpaper: string;
  taskbar: TaskbarConfig;
  miniApps: MiniApp[];
  aiAssistant: AIAssistantConfig;
  commandPalette: CommandPaletteConfig;
}

// Mini-App Card System
interface MiniApp {
  id: string;
  name: string;
  icon: ReactComponent;
  category: 'productivity' | 'creative' | 'intelligence' | 'communication';
  status: 'idle' | 'loading' | 'active' | 'error';
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large';
  aiCapabilities: AICapability[];
}
```

### 2. MINI-APP ECOSYSTEM
Build these core mini-apps with AI integration:

**AI Notes** - Smart note-taking with voice transcription
**AI Studio VE03** - Video editing with AI assistance  
**AI Gallery Nano** - Photo management with AI tagging
**AI Maps** - Google Maps integration with AI navigation
**AI Travel Agency** - Trip planning with AI recommendations
**AI Market** - E-commerce intelligence with AI insights
**AgentsKit** - Multi-agent system management
**MCP Kit** - Model Context Protocol tools
**Revenue Intelligence Hub** - Business analytics with AI

### 3. VOICE-FIRST INTERACTION
```typescript
// Voice Command System
interface VoiceCommand {
  trigger: string;
  action: (params: any) => Promise<void>;
  context: 'global' | 'app-specific';
  aiProcessing: boolean;
}

// Example Voice Commands
const voiceCommands: VoiceCommand[] = [
  {
    trigger: "Open AI Notes",
    action: () => openMiniApp('ai-notes'),
    context: 'global',
    aiProcessing: false
  },
  {
    trigger: "Analyze this document",
    action: (doc) => aiAnalyzeDocument(doc),
    context: 'app-specific',
    aiProcessing: true
  }
];
```

## TECHNICAL SPECIFICATIONS

### 1. TECHNOLOGY STACK
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + Glassmorphism effects
- **Animations:** Framer Motion
- **AI Integration:** Google Gemini API + Custom AI endpoints
- **Voice:** Web Speech API + Custom voice processing
- **State Management:** Zustand + React Query
- **Storage:** IndexedDB + Firebase Firestore

### 2. DESIGN SYSTEM
```css
/* Glassmorphism Theme */
:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: rgba(255, 255, 255, 0.05);
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --accent-primary: #6366f1;
  --accent-secondary: #8b5cf6;
  --text-primary: #e5e7eb;
  --text-secondary: #9ca3af;
}

/* Mini-App Card Styles */
.mini-app-card {
  @apply bg-glass-bg backdrop-blur-xl border border-glass-border rounded-2xl;
  @apply shadow-2xl hover:shadow-purple-500/20 transition-all duration-300;
  @apply hover:scale-105 hover:border-accent-primary/50;
}
```

### 3. AI INTEGRATION PATTERNS
```typescript
// AI Service Integration
class AIService {
  private geminiClient: GeminiClient;
  private voiceProcessor: VoiceProcessor;
  
  async processVoiceCommand(command: string): Promise<AIResponse> {
    const context = await this.getCurrentContext();
    const response = await this.geminiClient.generate({
      prompt: `Process voice command: "${command}" in context: ${context}`,
      systemInstruction: "You are QuantumOS AI assistant. Respond with JSON actions."
    });
    return this.parseAIResponse(response);
  }
  
  async analyzeContent(content: any, appContext: string): Promise<AnalysisResult> {
    // AI analysis for each mini-app
  }
}
```

## IMPLEMENTATION REQUIREMENTS

### 1. DESKTOP INTERFACE
- **Wallpaper System:** Dynamic backgrounds with AI-generated themes
- **Taskbar:** App launcher, system tray, AI assistant avatar
- **Window Management:** Drag, resize, minimize, maximize mini-apps
- **Command Palette:** Cmd+K for quick actions and AI commands

### 2. MINI-APP ARCHITECTURE
Each mini-app should:
- Have a consistent card-based interface
- Support voice commands
- Integrate with AI services
- Provide real-time updates
- Support drag-and-drop positioning
- Have expandable/collapsible views

### 3. AI ASSISTANT INTEGRATION
- **Global AI:** Available from any mini-app
- **Context Awareness:** Understands current app and user activity
- **Voice Processing:** Real-time speech-to-text and command processing
- **Smart Suggestions:** Proactive AI recommendations

## SPECIFIC MINI-APP REQUIREMENTS

### Revenue Intelligence Hub (Priority)
```typescript
interface RevenueIntelligenceApp extends MiniApp {
  workflows: {
    leads: LeadAnalysisWorkflow;
    pricing: CompetitorPricingWorkflow;
    reviews: SentimentAnalysisWorkflow;
    seo: ContentGapWorkflow;
    social: EngagementPredictionWorkflow;
    email: CampaignOptimizationWorkflow;
  };
  aiFeatures: {
    autoAnalysis: boolean;
    predictiveInsights: boolean;
    voiceCommands: boolean;
    realTimeUpdates: boolean;
  };
}
```

### AI Travel Agency
- Integration with Google Maps API
- Voice-based trip planning
- AI-powered recommendations
- Real-time booking assistance

### AgentsKit
- Multi-agent system management
- Agent performance monitoring
- Workflow orchestration
- AI coordination tools

## DEVELOPMENT PRIORITIES

1. **Phase 1:** Core desktop layout + 3 mini-apps (Notes, Revenue Hub, Maps)
2. **Phase 2:** Voice integration + AI assistant
3. **Phase 3:** Remaining mini-apps + advanced features
4. **Phase 4:** Performance optimization + deployment

## CODE QUALITY STANDARDS
- TypeScript strict mode
- Component-based architecture
- Custom hooks for AI functionality
- Error boundaries for AI failures
- Responsive design (desktop-first)
- Accessibility compliance
- Performance optimization

## EXPECTED OUTPUT
Generate a complete React application with:
- Desktop OS interface
- Working mini-app cards
- AI integration framework
- Voice command system
- Modern glassmorphism design
- TypeScript interfaces
- Component structure

Focus on creating a production-ready, scalable AI desktop experience that feels like the future of computing.
