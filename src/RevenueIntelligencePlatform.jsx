import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
    Search, DollarSign, TrendingUp, AlertCircle, Users, Mail,
    ExternalLink, Code, BarChart3, Clock, Zap, Target,
    FileText, CheckCircle, RefreshCw, Loader2, MinusCircle, History, Trash2
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, collection, query, serverTimestamp, orderBy } from 'firebase/firestore';

// --- Firebase Global Setup ---
const appId = import.meta.env.VITE_APP_ID || 'rip-default-app-id';
const firebaseConfig = import.meta.env.VITE_FIREBASE_CONFIG ? JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG) : {};

let app;
let db;
let auth;

try {
    if (Object.keys(firebaseConfig).length) {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
    }
} catch (e) {
    console.error("Firebase Initialization Error:", e);
}


// --- Global Constants & Schemas (No change) ---
const WORKFLOW_TABS = {
    LEADS: 'Content-to-Leads Analyzer',
    PRICE: 'Competitor Price Monitor',
    REVIEW: 'Review Sentiment Analyzer',
    SEO: 'SEO Content Gap Finder',
    SOCIAL: 'Social Media Predictor',
    EMAIL: 'Email Campaign Optimizer',
};

const LEADS_SCHEMA = {
    type: "OBJECT",
    properties: {
        painPoints: { type: "ARRAY", items: { type: "STRING" }, description: "3 main user pain points addressed by the content." },
        targetAudience: { type: "STRING", description: "A detailed profile of the target lead." },
        quickWins: { type: "ARRAY", items: { type: "STRING" }, description: "3 immediate, actionable steps to generate leads." },
        monthlyTraffic: { type: "INTEGER" },
        monthlyRevenue: { type: "STRING" }
    },
    required: ["painPoints", "targetAudience", "quickWins"]
};

const SEO_SCHEMA = {
    type: "OBJECT",
    properties: {
        gapKeywords: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    keyword: { type: "STRING" },
                    volume: { type: "INTEGER" },
                    difficulty: { type: "NUMBER" }
                },
                required: ["keyword", "volume", "difficulty"]
            }
        },
        contentStrategy: { type: "STRING", description: "A unique, long-form content strategy recommendation for the highest value keyword." },
    },
    required: ["gapKeywords", "contentStrategy"]
};

const EMAIL_SCHEMA = {
    type: "OBJECT",
    properties: {
        subjectLineImprovement: { type: "STRING", description: "The single best suggested subject line based on conversion psychology." },
        abTestSuggestions: { type: "ARRAY", items: { type: "STRING" }, description: "3 actionable A/B test suggestions." },
    },
    required: ["subjectLineImprovement", "abTestSuggestions"]
};


// --- Core AI Simulation & Integration Function ---

const simulateAIWorkflow = async (workflow, inputData) => {
    
    // API setup
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const model = "gemini-2.5-flash-preview-09-2025";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    let systemPrompt = "";
    let userQuery = "";
    let schema = null;
    let mockResponse = null;
    let callGemini = false;

    // --- Determine Workflow Type and Payload ---
    switch (workflow) {
        case WORKFLOW_TABS.LEADS:
            callGemini = true;
            systemPrompt = "You are an expert marketing analyst. Analyze the provided content/topic to determine key pain points, target audience, and quick win actions. Respond only with the JSON object.";
            userQuery = `Analyze the topic/content: "${inputData}" to extract 3 core user pain points, define the primary target audience (1 sentence), and provide 3 immediate quick win actions to generate leads. Assume 10,000 monthly traffic and an average lead value of $75.`;
            schema = LEADS_SCHEMA;
            break;

        case WORKFLOW_TABS.SEO:
            callGemini = true;
            systemPrompt = "You are an expert SEO strategist. Analyze the provided competitor domain to identify high-value, low-difficulty content gaps. Provide the output as a JSON object only.";
            userQuery = `For the competitor domain "${inputData}", generate 3 plausible, high-potential keyword gaps. Include estimated search volume (INTEGER, 500-2500) and difficulty (NUMBER, 4.0-9.0). Also, provide one unique long-form content strategy recommendation for the highest value keyword.`;
            schema = SEO_SCHEMA;
            break;

        case WORKFLOW_TABS.EMAIL:
            callGemini = true;
            systemPrompt = "You are a conversion optimization expert specializing in email marketing. Suggest improvements for an email campaign based on its performance metrics. Provide the output as a JSON object only.";
            userQuery = `Given a current open rate of 22.5% and a click rate of 2.8%, suggest the single best subject line improvement and 3 distinct A/B test suggestions for the content of an email campaign about a new 'Quantum' feature launch.`;
            schema = EMAIL_SCHEMA;
            break;

        // --- Mocked Workflows (for demonstration completeness) ---
        case WORKFLOW_TABS.PRICE:
            const priceChange = (Math.random() * 20 - 10).toFixed(2);
            mockResponse = {
                currentPrice: "$49.99",
                competitorPrice: `$${(parseFloat(49.99) + parseFloat(priceChange)).toFixed(2)}`,
                priceChange: priceChange,
                alertLevel: priceChange > 5 ? 'CRITICAL' : priceChange < -5 ? 'OPPORTUNITY' : 'NORMAL',
                recommendation: priceChange > 5 ? "Competitor raised price. Raise yours by 3% for immediate margin gain." : priceChange < -5 ? "Competitor dropped price. Match their price temporarily to capture market share." : "Maintain current price; market is stable.",
                status: "Success",
            };
            break;
        case WORKFLOW_TABS.REVIEW:
            mockResponse = {
                overallSentiment: (Math.random() * 2 + 8).toFixed(1),
                keyComplaints: ["The UI is confusing on mobile.", "Pricing tiers are not clearly defined.", "Needs better integration with existing tools."],
                improvementOpportunities: ["Develop a dedicated mobile-first design layer (React Native).", "Simplify pricing page with clear visual comparison."],
                churnReduction: (Math.random() * 10 + 15).toFixed(2),
                status: "Success",
            };
            break;
        case WORKFLOW_TABS.SOCIAL:
            mockResponse = {
                contentIdea: inputData || "Post about new AI feature.",
                predictedEngagement: (Math.random() * 20 + 300).toFixed(0),
                confidence: (Math.random() * 10 + 85).toFixed(0),
                optimalTime: "Tuesday @ 10:30 AM EST",
                recommendation: "Use a short-form video instead of static image to boost predicted engagement by 40%.",
                status: "Success",
            };
            break;
        default:
            throw new Error("Invalid workflow selected.");
    }

    // --- Execute Gemini API Call (if applicable) ---
    if (callGemini) {
        // Simulates a transient failure (for error handling demonstration)
        if (Math.random() < 0.1) {
            throw new Error(`Transient network or scraping error during ${workflow} analysis.`);
        }

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API Failed: ${errorData.error?.message || response.statusText}`);
        }

        const result = await response.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!jsonText) {
            throw new Error("Gemini returned an empty or invalid response.");
        }
        
        const geminiOutput = JSON.parse(jsonText);
        
        // --- Map Gemini Output to Component Structure ---
        if (workflow === WORKFLOW_TABS.LEADS) {
            return {
                ...geminiOutput,
                leadMagnets: [
                    { name: "QCC Roadmap PDF", conversionRate: "4.5%" },
                    { name: "Ethical Veto Code Snippet", conversionRate: "3.2%" }
                ],
                revenueEstimate: {
                    monthlyTraffic: geminiOutput.monthlyTraffic || 10000, 
                    conversionRate: "3%", 
                    leadsPerMonth: Math.round((geminiOutput.monthlyTraffic || 10000) * 0.03), 
                    avgLeadValue: "$75", 
                    monthlyRevenue: geminiOutput.monthlyRevenue || `$${Math.round((geminiOutput.monthlyTraffic || 10000) * 0.03 * 75).toLocaleString()}`
                },
                status: "Success",
            };
        }
        
        if (workflow === WORKFLOW_TABS.SEO) {
            return {
                ...geminiOutput,
                competitorDomain: inputData || "Competitor.com",
                estimatedTrafficValue: "$25,000 / month", 
                status: "Success",
            };
        }

        if (workflow === WORKFLOW_TABS.EMAIL) {
            return {
                ...geminiOutput,
                currentOpenRate: "22.5%",
                currentClickRate: "2.8%",
                predictedImprovement: "18% increase in Open Rate", 
                status: "Success",
            };
        }

    }

    // Delay for mock data (to show loading state)
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    return mockResponse;
};

// --- Component: Revenue Intelligence Platform ---

const RevenueIntelligencePlatform = () => {
    const [activeTab, setActiveTab] = useState(WORKFLOW_TABS.LEADS);
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [retries, setRetries] = useState(0);
    const [userId, setUserId] = useState(null);
    const [analysesHistory, setAnalysesHistory] = useState([]);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const MAX_RETRIES = 3;

    // --- Firebase Initialization and Auth ---
    useEffect(() => {
        if (!auth) return;

        const handleAuth = async () => {
            if (import.meta.env.VITE_INITIAL_AUTH_TOKEN) {
                await signInWithCustomToken(auth, import.meta.env.VITE_INITIAL_AUTH_TOKEN);
            } else {
                await signInAnonymously(auth);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                // Generate a random ID if anonymous sign-in fails or user is null
                setUserId(crypto.randomUUID());
            }
            setIsAuthReady(true);
        });

        handleAuth();
        return () => unsubscribe();
    }, []);

    // --- Firestore Operations ---

    // 1. Fetch Analyses History (Real-time listener)
    useEffect(() => {
        if (!db || !userId || !isAuthReady) return;

        const collectionPath = `/artifacts/${appId}/users/${userId}/rip_analyses`;
        const q = collection(db, collectionPath);
        
        // Fetch all documents and sort them by the creation time (if available)
        // NOTE: We cannot use orderBy('createdAt', 'desc') without an index, so we sort client-side later.
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const analyses = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                // Ensure data is structured correctly before pushing
                if (data.workflow && data.input) {
                    analyses.push({ id: doc.id, ...data });
                }
            });
            // Sort client-side by createdAt (most recent first)
            analyses.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
            setAnalysesHistory(analyses);
        }, (err) => {
            console.error("Firestore Listen Error:", err);
            // setError("Failed to fetch history."); // Optional: show error to user
        });

        return () => unsubscribe();
    }, [isAuthReady, userId]);

    // 2. Save Analysis Function
    const saveAnalysis = async (workflow, input, output) => {
        if (!db || !userId) {
            console.error("Database or User ID not ready. Cannot save analysis.");
            return;
        }

        try {
            const docRef = doc(collection(db, `/artifacts/${appId}/users/${userId}/rip_analyses`));
            await setDoc(docRef, {
                workflow: workflow,
                input: input,
                output: output,
                createdAt: serverTimestamp(),
            });
            console.log("Analysis saved to Firestore successfully.");
        } catch (e) {
            console.error("Error saving document: ", e);
        }
    };


    // --- Core Workflow Execution Logic (updated to include save) ---
    const executeWorkflow = useCallback(async () => {
        if (!inputValue && activeTab !== WORKFLOW_TABS.PRICE) {
            setError('Please enter a valid input (URL, Domain, or Idea).');
            return;
        }
        if (!isAuthReady) {
            setError('Authentication is not ready. Please wait a moment.');
            return;
        }

        setLoading(true);
        setError('');
        setResults(null);
        setRetries(0);

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                setRetries(attempt);
                const data = await simulateAIWorkflow(activeTab, inputValue);
                
                // --- SUCCESS: Save to Firestore ---
                await saveAnalysis(activeTab, inputValue, data);
                
                setResults(data);
                setLoading(false);
                return;
            } catch (err) {
                const isLastAttempt = attempt === MAX_RETRIES;
                const errorMessage = err.message || 'An unknown error occurred.';
                
                if (isLastAttempt) {
                    setError(`Failed after ${MAX_RETRIES} attempts. Error: ${errorMessage}.`);
                    setLoading(false);
                    return;
                }
                
                // Exponential Backoff: Wait 1s, 2s, 4s...
                const waitTime = Math.pow(2, attempt) * 1000;
                console.warn(`Attempt ${attempt} failed. Retrying in ${waitTime / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }, [activeTab, inputValue, isAuthReady, userId]); // Dependency on userId/isAuthReady for saving

    // --- Component: Dynamic Input and Result Render ---

    const renderInputPlaceholder = useMemo(() => {
        switch (activeTab) {
            case WORKFLOW_TABS.LEADS: return "https://your-blog.com/new-article (URL) or topic idea";
            case WORKFLOW_TABS.PRICE: return "Not Applicable (System Auto-Monitors)";
            case WORKFLOW_TABS.REVIEW: return "Enter Product ID or Review URL (Mocked)";
            case WORKFLOW_TABS.SEO: return "Competitor Domain (e.g., example.com)";
            case WORKFLOW_TABS.SOCIAL: return "New Post Idea (e.g., 'Launch of QCE 2.0 Feature') (Mocked)";
            case WORKFLOW_TABS.EMAIL: return "Email Campaign Name or ID";
            default: return "Enter Input";
        }
    }, [activeTab]);

    const renderResults = useMemo(() => {
        if (!results) return null;

        const baseCardClass = "bg-white p-6 rounded-xl border border-gray-200 shadow-md";
        const titleClass = "text-xl font-bold text-gray-800 mb-4 flex items-center gap-3";
        const listClass = "space-y-3 text-gray-700";

        switch (activeTab) {
            case WORKFLOW_TABS.LEADS:
                return (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className={`${baseCardClass} bg-indigo-50`}>
                            <h3 className={titleClass}><AlertCircle className="w-5 h-5 text-indigo-600"/>3 Key Pain Points (Leads)</h3>
                            <ul className={listClass}>
                                {results.painPoints.map((p, i) => <li key={i} className="flex items-start"><span className="text-indigo-600 font-extrabold mr-2">•</span> {p}</li>)}
                            </ul>
                        </div>
                        <div className={baseCardClass}>
                            <h3 className={titleClass}><TrendingUp className="w-5 h-5 text-green-600"/>Revenue Projection</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(results.revenueEstimate).map(([key, value]) => (
                                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                                        <div className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                                        <div className="font-bold text-lg text-gray-900">{value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={`${baseCardClass} md:col-span-2`}>
                            <h3 className={titleClass}><Target className="w-5 h-5 text-purple-600"/>Target Audience & Quick Wins</h3>
                            <p className="mb-4 font-semibold">{results.targetAudience}</p>
                            <h4 className="font-semibold text-gray-700 mb-2">Quick Wins:</h4>
                            <ol className="list-decimal pl-5 space-y-1">
                                {results.quickWins.map((w, i) => <li key={i}>{w}</li>)}
                            </ol>
                        </div>
                    </div>
                );
            case WORKFLOW_TABS.PRICE:
                const alertStyle = results.alertLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' : results.alertLevel === 'OPPORTUNITY' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
                return (
                    <div className="space-y-4">
                        <div className={`p-4 rounded-xl font-bold ${alertStyle}`}>
                            <div className="flex items-center gap-2"><AlertCircle className="w-5 h-5"/>{results.alertLevel} ALERT: Price Change of {results.priceChange}%</div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            <div className={`${baseCardClass} text-center`}>
                                <div className="text-sm text-gray-500">Your Price</div>
                                <div className="text-2xl font-extrabold text-blue-600">{results.currentPrice}</div>
                            </div>
                            <div className={`${baseCardClass} text-center`}>
                                <div className="text-sm text-gray-500">Competitor Price</div>
                                <div className="text-2xl font-extrabold text-red-600">{results.competitorPrice}</div>
                            </div>
                             <div className={`${baseCardClass} text-center`}>
                                <div className="text-sm text-gray-500">Change (%)</div>
                                <div className={`text-2xl font-extrabold ${results.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>{results.priceChange}%</div>
                            </div>
                        </div>
                        <div className={`${baseCardClass}`}>
                            <h3 className={titleClass}><Code className="w-5 h-5 text-gray-600"/>Recommended Strategy</h3>
                            <p className="text-lg font-semibold text-gray-800">{results.recommendation}</p>
                        </div>
                    </div>
                );
            case WORKFLOW_TABS.REVIEW:
                 return (
                    <div className="space-y-4">
                        <div className={`${baseCardClass} bg-purple-50`}>
                            <h3 className={titleClass}><BarChart3 className="w-5 h-5 text-purple-600"/>Overall Sentiment Score</h3>
                            <p className="text-5xl font-extrabold text-purple-700">{results.overallSentiment}/10.0</p>
                            <p className="text-sm mt-1 text-gray-600">Predicted Annual Churn Reduction: <span className='font-bold text-green-600'>{results.churnReduction}%</span></p>
                        </div>
                        <div className={baseCardClass}>
                            <h3 className={titleClass}><MinusCircle className="w-5 h-5 text-red-600"/>Top Complaints</h3>
                            <ul className={listClass}>
                                {results.keyComplaints.map((c, i) => <li key={i} className="flex items-start"><span className="text-red-600 font-extrabold mr-2">•</span> {c}</li>)}
                            </ul>
                        </div>
                        <div className={`${baseCardClass}`}>
                            <h3 className={titleClass}><CheckCircle className="w-5 h-5 text-green-600"/>Improvement Opportunities (Mocked)</h3>
                            <ul className={listClass}>
                                {results.improvementOpportunities.map((o, i) => <li key={i} className="flex items-start"><span className="text-green-600 font-extrabold mr-2">•</span> {o}</li>)}
                            </ul>
                        </div>
                    </div>
                );
            case WORKFLOW_TABS.SEO:
                return (
                    <div className="space-y-4">
                        <div className={`${baseCardClass} bg-yellow-50`}>
                            <h3 className={titleClass}><Search className="w-5 h-5 text-yellow-600"/>Content Gap Analysis: {results.competitorDomain}</h3>
                            <p className="text-sm text-gray-600 mb-3">Estimated Monthly Traffic Value Gained: <span className='font-bold text-green-600'>{results.estimatedTrafficValue}</span></p>
                            
                            <h4 className="font-semibold text-gray-800 mb-2">Top Keyword Gaps:</h4>
                            <div className="space-y-2">
                                {results.gapKeywords.map((k, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-yellow-200">
                                        <span className="font-medium">{k.keyword}</span>
                                        <div className="flex gap-4 text-sm">
                                            <span className="text-gray-500">Vol: {k.volume}</span>
                                            <span className="text-red-500">Diff: {k.difficulty}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={`${baseCardClass}`}>
                            <h3 className={titleClass}><FileText className="w-5 h-5 text-blue-600"/>Content Strategy</h3>
                            <p className="text-lg font-semibold text-gray-800">{results.contentStrategy}</p>
                        </div>
                    </div>
                );
            case WORKFLOW_TABS.SOCIAL:
                return (
                    <div className="space-y-4">
                        <div className={`${baseCardClass} bg-cyan-50`}>
                            <h3 className={titleClass}><Users className="w-5 h-5 text-cyan-600"/>Predicted Engagement (Mocked)</h3>
                            <p className="text-5xl font-extrabold text-cyan-700">{results.predictedEngagement}</p>
                            <p className="text-sm mt-1 text-gray-600">Confidence: <span className='font-bold'>{results.confidence}%</span> | Optimal Time: <span className='font-bold'>{results.optimalTime}</span></p>
                        </div>
                        <div className={`${baseCardClass}`}>
                            <h3 className={titleClass}><Zap className="w-5 h-5 text-yellow-600"/>Optimization Recommendation (Mocked)</h3>
                            <p className="text-lg font-semibold text-gray-800">{results.recommendation}</p>
                        </div>
                    </div>
                );
            case WORKFLOW_TABS.EMAIL:
                return (
                    <div className="space-y-4">
                        <div className={`${baseCardClass} bg-pink-50`}>
                            <h3 className={titleClass}><Mail className="w-5 h-5 text-pink-600"/>Optimization Summary</h3>
                            <p className="text-3xl font-extrabold text-pink-700">{results.predictedImprovement}</p>
                            <p className="text-sm mt-1 text-gray-600">Current Open Rate: {results.currentOpenRate} | Current Click Rate: {results.currentClickRate}</p>
                        </div>
                        <div className={`${baseCardClass}`}>
                            <h3 className={titleClass}><Code className="w-5 h-5 text-gray-600"/>Subject Line Improvement</h3>
                            <p className="text-lg font-semibold text-gray-800 border-l-4 border-pink-400 pl-3 italic">"{results.subjectLineImprovement}"</p>
                        </div>
                        <div className={`${baseCardClass}`}>
                            <h3 className={titleClass}><Clock className="w-5 h-5 text-blue-600"/>A/B Test Suggestions</h3>
                            <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                                {results.abTestSuggestions.map((t, i) => <li key={i}>{t}</li>)}
                            </ol>
                        </div>
                    </div>
                );
            default: return null;
        }
    }, [results, activeTab]);

    // --- Component: Analysis History Panel ---
    const AnalysisHistoryPanel = () => (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border-t-4 border-gray-400">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-gray-600"/>
                سجل التحليلات السابقة (History)
                {!isAuthReady && <Loader2 className="w-4 h-4 animate-spin ml-2"/>}
            </h3>
            
            <div className="max-h-96 overflow-y-auto space-y-3">
                {analysesHistory.length === 0 ? (
                    <p className="text-gray-500 italic">لا توجد تحليلات محفوظة بعد. قم بتشغيل سير عمل لحفظه.</p>
                ) : (
                    analysesHistory.map((analysis) => (
                        <div key={analysis.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition duration-150">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-sm text-indigo-600">{analysis.workflow}</span>
                                <span className="text-xs text-gray-500">
                                    {analysis.createdAt ? new Date(analysis.createdAt.toDate()).toLocaleString() : 'Saving...'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-700 mt-1 truncate">
                                Input: {analysis.input}
                            </p>
                            {/* NOTE: Delete functionality is complex and requires explicit user confirmation via a custom modal, not included here to maintain focus on core storage. */}
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-['Inter']">
            <div className="max-w-7xl mx-auto">
                
                <header className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 mb-6 border-b-4 border-indigo-500">
                    <div className="flex items-center gap-4">
                        {/* NEW LOGO: Target + TrendingUp + BarChart3 */}
                        <div className="relative flex items-center w-10 h-10">
                            <Target className="w-8 h-8 text-indigo-600 transform absolute top-0 left-0" />
                            <TrendingUp className="w-8 h-8 text-green-500 transform absolute top-2 left-2 opacity-80" />
                            <BarChart3 className="w-8 h-8 text-blue-500 transform absolute top-0 left-3 opacity-60" />
                        </div>
                        <div>
                            {/* NEW NAME: Ascend Λ: Revenue Command Center */}
                            <h1 className="text-3xl font-extrabold text-gray-900">
                                Ascend <span className="text-green-600">Λ</span>: Revenue Command Center
                            </h1>
                            <p className="text-gray-600">The ultimate engine for strategic revenue growth and data synergy.</p>
                        </div>
                    </div>
                </header>

                {/* Tab Navigation */}
                <div className="flex overflow-x-auto gap-1 mb-6 pb-2">
                    {Object.values(WORKFLOW_TABS).map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setResults(null); setError(''); setInputValue(''); }}
                            className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition duration-200 ${
                                activeTab === tab ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300' : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {tab.split(' ')[0]}
                        </button>
                    ))}
                </div>

                {/* Workflow Card and Execution */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-t-4 border-blue-500">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{activeTab}</h2>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Input ({activeTab})
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={renderInputPlaceholder}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                                disabled={loading || activeTab === WORKFLOW_TABS.PRICE}
                            />
                            <button
                                onClick={executeWorkflow}
                                disabled={loading || (activeTab !== WORKFLOW_TABS.PRICE && !inputValue) || !isAuthReady}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition duration-200"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Running... ({retries}/{MAX_RETRIES})
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5" />
                                        Analyze & Execute
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Status/Error/Success Messages */}
                    {!isAuthReady && <div className="p-3 bg-yellow-100 text-yellow-800 rounded-md mb-4 text-sm font-medium flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin"/> Authenticating user and preparing database...
                    </div>}
                    {loading && retries > 1 && (
                        <div className="p-3 bg-yellow-100 text-yellow-800 rounded-md mb-4 text-sm font-medium flex items-center gap-2">
                            <RefreshCw className="w-4 h-4"/> Attempt {retries}/{MAX_RETRIES} - Retrying after transient failure...
                        </div>
                    )}
                    {error && (
                        <div className="p-4 bg-red-100 border-l-4 border-red-500 rounded-md mb-4 flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="text-red-800">
                                <h3 className="font-bold">Execution Failed!</h3>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}
                    {results && !loading && (
                        <div className="p-4 bg-green-100 border-l-4 border-green-500 rounded-md mb-4 flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="text-green-800">
                                <h3 className="font-bold">Workflow Complete!</h3>
                                <p className="text-sm">Analysis finished successfully in {retries} attempt(s) and saved to history.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Display Area */}
                <div className="mt-8">
                    {renderResults}
                </div>

                {/* History Panel */}
                <AnalysisHistoryPanel />
            </div>
        </div>
    );
};

export default RevenueIntelligencePlatform;
