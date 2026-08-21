import React, { useState } from "react";
import { CMSData, AISettings, AIProviderConfig, AIProviderId, DEFAULT_AI_SETTINGS } from "../cmsStore";
import { 
  Bot, 
  Sparkles, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Zap, 
  Sliders, 
  ShieldCheck, 
  Cpu, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Play, 
  Layers, 
  Info,
  HelpCircle
} from "lucide-react";

interface WPAISettingsProps {
  cmsData: CMSData;
  onSave: (updatedData: CMSData, customMsg?: string) => void;
}

interface TestResult {
  loading: boolean;
  success?: boolean;
  message?: string;
  latencyMs?: number;
  model?: string;
  error?: string;
  sampleResponse?: string;
}

export default function WPAISettings({ cmsData, onSave }: WPAISettingsProps) {
  // Local editable AI Settings state
  const [aiSettings, setAiSettings] = useState<AISettings>(() => {
    return cmsData.aiSettings || DEFAULT_AI_SETTINGS;
  });

  // Visibility toggles for API keys (show/hide password)
  const [showKey, setShowKey] = useState<Record<string, boolean>>({
    openai: false,
    gemini: false,
    anthropic: false
  });

  // Instructions accordion toggles
  const [showInstructions, setShowInstructions] = useState<Record<string, boolean>>({
    openai: false,
    gemini: false,
    anthropic: false
  });

  // Advanced settings accordion toggles
  const [showAdvanced, setShowAdvanced] = useState<Record<string, boolean>>({
    openai: false,
    gemini: false,
    anthropic: false
  });

  // Test connection results state
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({
    openai: { loading: false },
    gemini: { loading: false },
    anthropic: { loading: false }
  });

  // Live Playground State
  const [playgroundPrompt, setPlaygroundPrompt] = useState(
    "Write a concise 2-sentence inspirational summary of why mastering Tajweed is essential for Holy Quran recitation."
  );
  const [playgroundProvider, setPlaygroundProvider] = useState<AIProviderId | "default">("default");
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  const [playgroundResult, setPlaygroundResult] = useState<string | null>(null);
  const [playgroundMeta, setPlaygroundMeta] = useState<{ provider?: string; model?: string; latencyMs?: number } | null>(null);
  const [playgroundError, setPlaygroundError] = useState<string | null>(null);

  // Copied state indicator
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Helper to update a specific provider's settings
  const handleUpdateProvider = (provider: AIProviderId, updates: Partial<AIProviderConfig>) => {
    const nextSettings: AISettings = {
      ...aiSettings,
      providers: {
        ...aiSettings.providers,
        [provider]: {
          ...aiSettings.providers[provider],
          ...updates
        }
      }
    };
    setAiSettings(nextSettings);
  };

  // Save all AI settings
  const handleSaveSettings = () => {
    const updatedCMSData = {
      ...cmsData,
      aiSettings: aiSettings
    };
    onSave(updatedCMSData, "AI Integrations & API Credentials Saved!");
  };

  // Test connection to a specific provider
  const handleTestConnection = async (provider: AIProviderId) => {
    setTestResults((prev) => ({
      ...prev,
      [provider]: { loading: true }
    }));

    const config = aiSettings.providers[provider];
    const startTime = Date.now();

    try {
      const res = await fetch("/api/ai/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey: config.apiKey,
          model: config.model
        })
      });

      const data = await res.json();
      const latencyMs = data.latencyMs || Date.now() - startTime;

      if (res.ok && data.success) {
        setTestResults((prev) => ({
          ...prev,
          [provider]: {
            loading: false,
            success: true,
            message: data.message || "Connection established successfully!",
            latencyMs,
            model: data.model,
            sampleResponse: data.sampleResponse
          }
        }));

        // Update validation flag in settings
        handleUpdateProvider(provider, {
          isValidated: true,
          lastTested: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        });
      } else {
        setTestResults((prev) => ({
          ...prev,
          [provider]: {
            loading: false,
            success: false,
            error: data.error || `HTTP ${res.status}: Failed to authenticate with ${provider}.`,
            latencyMs
          }
        }));

        handleUpdateProvider(provider, {
          isValidated: false,
          lastTested: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        });
      }
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [provider]: {
          loading: false,
          success: false,
          error: err.message || "Network error while connecting to AI backend.",
          latencyMs: Date.now() - startTime
        }
      }));
    }
  };

  // Run Playground prompt
  const handleRunPlayground = async () => {
    if (!playgroundPrompt.trim()) return;
    setPlaygroundLoading(true);
    setPlaygroundResult(null);
    setPlaygroundError(null);
    setPlaygroundMeta(null);

    const providerToUse = playgroundProvider === "default" ? aiSettings.defaultProvider : playgroundProvider;
    const providerConfig = aiSettings.providers[providerToUse];
    const startTime = Date.now();

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: playgroundPrompt,
          provider: providerToUse,
          model: providerConfig.model,
          temperature: providerConfig.temperature ?? 0.7,
          maxTokens: providerConfig.maxTokens ?? 2048
        })
      });

      const data = await res.json();
      const latencyMs = Date.now() - startTime;

      if (res.ok && data.success) {
        setPlaygroundResult(data.result);
        setPlaygroundMeta({
          provider: data.provider || providerToUse,
          model: data.model || providerConfig.model,
          latencyMs
        });
      } else {
        setPlaygroundError(data.error || "Failed to generate AI response.");
      }
    } catch (err: any) {
      setPlaygroundError(err.message || "Network communication error with AI engine.");
    } finally {
      setPlaygroundLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Provider configuration definitions
  const providerDefinitions = [
    {
      id: "gemini" as AIProviderId,
      name: "Google Gemini",
      tagline: "Ultra-fast multimodal AI with high intelligence and native Google integration",
      badgeColor: "from-blue-600 to-indigo-600",
      accentBorder: "border-blue-500/30 hover:border-blue-500/50",
      iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      activePill: "bg-blue-500/15 text-blue-300 border-blue-500/30",
      docUrl: "https://aistudio.google.com/app/apikey",
      docLabel: "Google AI Studio Console",
      keyPlaceholder: "AIzaSy...",
      requirements: "Requires an API key from Google AI Studio. Generous free tier and pay-as-you-go quotas available globally.",
      instructions: [
        "Visit Google AI Studio Console at https://aistudio.google.com/app/apikey",
        "Sign in with your Google account and click on 'Create API key'",
        "Select an existing Google Cloud project or create a new one, then copy the key",
        "Paste the key below and click 'Test Connection' to verify"
      ],
      models: [
        { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash (Recommended - Fastest & Cost-Effective)" },
        { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (Advanced Reasoning & Deep Tafseer)" },
        { id: "gemini-3.7-flash", name: "Gemini 3.7 Flash (Next-Gen Hybrid Speed & Quality)" },
        { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro Preview (Complex Analytical)" },
        { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Legacy Long Context)" },
        { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (Legacy Speed)" }
      ]
    },
    {
      id: "openai" as AIProviderId,
      name: "OpenAI (ChatGPT)",
      tagline: "Industry-leading language models from OpenAI including GPT-4o and o-series",
      badgeColor: "from-emerald-600 to-teal-600",
      accentBorder: "border-emerald-500/30 hover:border-emerald-500/50",
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      activePill: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      docUrl: "https://platform.openai.com/api-keys",
      docLabel: "OpenAI Developer Portal",
      keyPlaceholder: "sk-proj-...",
      requirements: "Requires an active OpenAI Platform account with positive credit balance (prepaid credits). Secret key starts with 'sk-'.",
      instructions: [
        "Go to the OpenAI Platform dashboard at https://platform.openai.com/api-keys",
        "Log in and navigate to 'API keys' in the left menu",
        "Click '+ Create new secret key', enter a name (e.g. 'Truth Quran Academy')",
        "Copy the secret key immediately and paste it into the field below"
      ],
      models: [
        { id: "gpt-4o", name: "GPT-4o (Recommended - Flagship Multimodal)" },
        { id: "gpt-4o-mini", name: "GPT-4o Mini (Ultra-Fast & Affordable)" },
        { id: "o1", name: "o1 (Deep Chain-of-Thought Reasoning)" },
        { id: "o3-mini", name: "o3-mini (High-Speed STEM & Logical Analysis)" },
        { id: "gpt-4-turbo", name: "GPT-4 Turbo (High Capacity)" },
        { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo (Legacy Standard)" }
      ]
    },
    {
      id: "anthropic" as AIProviderId,
      name: "Anthropic Claude",
      tagline: "Nuanced, high-precision conversational AI renowned for exceptional writing quality",
      badgeColor: "from-amber-600 to-orange-600",
      accentBorder: "border-amber-500/30 hover:border-amber-500/50",
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      activePill: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      docUrl: "https://console.anthropic.com/settings/keys",
      docLabel: "Anthropic Console",
      keyPlaceholder: "sk-ant-api03-...",
      requirements: "Requires an Anthropic Console account with active credit balance. API key starts with 'sk-ant-'.",
      instructions: [
        "Visit Anthropic Console at https://console.anthropic.com/settings/keys",
        "Sign in and ensure your organization has funded API credits",
        "Click 'Create Key', choose a workspace, and give it a label",
        "Copy your secret key and paste it below, then test the connection"
      ],
      models: [
        { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet (Recommended - Exceptional Nuance)" },
        { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku (Lightning Fast & Concise)" },
        { id: "claude-3-opus-20240229", name: "Claude 3 Opus (Maximum Depth & Reasoning)" },
        { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet (Balanced)" },
        { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku (Compact)" }
      ]
    }
  ];

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-200">
      
      {/* Top Header Bar */}
      <div className="border-b border-[#d9b45c]/20 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d9b45c] to-[#997726] flex items-center justify-center text-black shadow-lg shadow-[#d9b45c]/10">
              <Bot size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-serif text-2xl text-[#f3ecd8] font-bold tracking-wide">
                AI API Settings &amp; Multi-Provider Integrations
              </h2>
              <p className="text-xs text-[#c9c2ab] mt-0.5 font-sans">
                Connect OpenAI (ChatGPT), Google Gemini, and Anthropic Claude APIs to empower blog drafting, SEO suggestions, and automated student assistance.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleSaveSettings}
            className="px-6 py-2.5 bg-[#d9b45c] hover:bg-[#f2d98a] text-black text-xs font-sans font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center space-x-2 cursor-pointer"
          >
            <CheckCircle2 size={16} />
            <span>Save AI Settings</span>
          </button>
        </div>
      </div>

      {/* Global Master Status & Default Provider Controller */}
      <div className="bg-[#12141b] border border-[#d9b45c]/20 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="text-[#d9b45c]" size={18} />
              <span className="text-sm font-sans font-extrabold text-white uppercase tracking-wider">
                Default AI Routing &amp; Master Engine
              </span>
            </div>
            <p className="text-xs text-[#c9c2ab]/80 font-sans">
              Choose the primary AI provider used by the Gutenberg Blog Editor, SEO Meta Assistant, and automated response generators across Truth Quran Academy.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-[#07080b] border border-white/10 px-3.5 py-1.5 rounded-xl">
              <span className="text-xs font-sans text-[#c9c2ab]">Global AI Features:</span>
              <button
                type="button"
                onClick={() => setAiSettings({ ...aiSettings, isEnabled: !aiSettings.isEnabled })}
                className={`px-3 py-1 rounded-lg text-[10px] font-sans font-bold uppercase tracking-wider transition-all ${
                  aiSettings.isEnabled
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-red-500/20 text-red-300 border border-red-500/40"
                }`}
              >
                {aiSettings.isEnabled ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>
        </div>

        {/* Default Provider Selector Cards */}
        <div className="space-y-2">
          <label className="text-xs font-sans font-bold uppercase tracking-wider text-[#d9b45c] block">
            Select Active Default AI Provider
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {providerDefinitions.map((p) => {
              const isSelected = aiSettings.defaultProvider === p.id;
              const config = aiSettings.providers[p.id];
              const isConfigured = Boolean(config.apiKey) || (p.id === "gemini");

              return (
                <div
                  key={p.id}
                  onClick={() => setAiSettings({ ...aiSettings, defaultProvider: p.id })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 relative overflow-hidden ${
                    isSelected
                      ? "bg-[#07080b] border-[#d9b45c] shadow-[0_0_20px_rgba(217,180,92,0.15)] ring-1 ring-[#d9b45c]"
                      : "bg-[#07080b]/60 border-white/10 hover:border-white/20 hover:bg-[#07080b]/90"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 bg-[#d9b45c] text-black text-[9px] font-sans font-black uppercase px-2.5 py-0.5 rounded-bl-lg tracking-wider">
                      Active Default
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${config.enabled ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-gray-500"}`}></span>
                      <span className="font-sans font-bold text-sm text-white">{p.name}</span>
                    </div>
                    <p className="text-[11px] text-[#c9c2ab]/70 font-sans line-clamp-2 leading-relaxed">
                      {p.tagline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-sans">
                    <span className="text-[#c9c2ab]/60">Model:</span>
                    <span className="font-mono text-[#d9b45c] truncate max-w-[130px]">{config.model}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Provider Details & Configuration Blocks */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-[#f3ecd8] font-bold">
            Provider Credentials &amp; API Keys
          </h3>
          <span className="text-xs font-sans text-[#c9c2ab]">3 AI Engines Available</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {providerDefinitions.map((provider) => {
            const config = aiSettings.providers[provider.id];
            const isDefault = aiSettings.defaultProvider === provider.id;
            const testResult = testResults[provider.id];
            const isKeyVisible = showKey[provider.id];
            const isInstrOpen = showInstructions[provider.id];
            const isAdvOpen = showAdvanced[provider.id];

            return (
              <div
                key={provider.id}
                className={`bg-[#12141b] border rounded-2xl p-6 space-y-6 transition-all duration-300 ${provider.accentBorder} ${
                  isDefault ? "ring-1 ring-[#d9b45c]/40" : ""
                }`}
              >
                {/* Provider Card Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className={`p-2.5 rounded-xl border ${provider.iconBg}`}>
                      <Bot size={22} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2.5">
                        <h4 className="font-sans font-bold text-base text-white">{provider.name}</h4>
                        {isDefault && (
                          <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#d9b45c]/20 text-[#d9b45c] border border-[#d9b45c]/40">
                            Default Engine
                          </span>
                        )}
                        <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          config.enabled 
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" 
                            : "bg-gray-500/15 text-gray-400 border border-gray-500/30"
                        }`}>
                          {config.enabled ? "Active" : "Disabled"}
                        </span>
                      </div>
                      <p className="text-xs text-[#c9c2ab]/70 font-sans mt-0.5">{provider.tagline}</p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex items-center space-x-3">
                    <label className="text-xs font-sans text-[#c9c2ab] font-medium">Provider Status:</label>
                    <button
                      type="button"
                      onClick={() => handleUpdateProvider(provider.id, { enabled: !config.enabled })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        config.enabled ? "bg-[#d9b45c]" : "bg-gray-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                          config.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Form Fields: API Key & Model */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* API Key Input Field (8 cols) */}
                  <div className="lg:col-span-7 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-sans font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                        <Key size={14} className="text-[#d9b45c]" />
                        <span>API Secret Key</span>
                      </label>
                      <a
                        href={provider.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-sans text-[#d9b45c] hover:text-[#f2d98a] flex items-center space-x-1 transition-colors group"
                      >
                        <span>Get {provider.name} Key</span>
                        <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>

                    <div className="relative flex items-center">
                      <input
                        type={isKeyVisible ? "text" : "password"}
                        value={config.apiKey}
                        onChange={(e) => handleUpdateProvider(provider.id, { apiKey: e.target.value })}
                        placeholder={provider.keyPlaceholder}
                        className="w-full bg-[#07080b] border border-white/15 rounded-xl pl-3.5 pr-24 py-3 text-xs text-white font-mono placeholder:text-gray-600 outline-none focus:border-[#d9b45c] focus:ring-1 focus:ring-[#d9b45c] transition-all"
                      />
                      
                      <div className="absolute right-2 flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => setShowKey({ ...showKey, [provider.id]: !isKeyVisible })}
                          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                          title={isKeyVisible ? "Hide API Key" : "Reveal API Key"}
                        >
                          {isKeyVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>

                        {config.apiKey && (
                          <button
                            type="button"
                            onClick={() => handleCopyText(config.apiKey, provider.id)}
                            className="p-1.5 text-gray-400 hover:text-[#d9b45c] rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                            title="Copy Key"
                          >
                            {copiedKey === provider.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          </button>
                        )}
                      </div>
                    </div>

                    {provider.id === "gemini" && (
                      <p className="text-[10px] text-[#c9c2ab]/60 font-sans flex items-center space-x-1">
                        <Info size={11} className="text-blue-400 flex-shrink-0" />
                        <span>Leave empty to automatically utilize runtime server key (<code className="font-mono text-blue-300">GEMINI_API_KEY</code>).</span>
                      </p>
                    )}
                  </div>

                  {/* Model Selection Dropdown (5 cols) */}
                  <div className="lg:col-span-5 space-y-2">
                    <label className="text-xs font-sans font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                      <Cpu size={14} className="text-[#d9b45c]" />
                      <span>Model Version</span>
                    </label>

                    <select
                      value={config.model}
                      onChange={(e) => handleUpdateProvider(provider.id, { model: e.target.value })}
                      className="w-full bg-[#07080b] border border-white/15 rounded-xl px-3.5 py-3 text-xs text-white font-sans outline-none focus:border-[#d9b45c] focus:ring-1 focus:ring-[#d9b45c] transition-all cursor-pointer"
                    >
                      {provider.models.map((m) => (
                        <option key={m.id} value={m.id} className="bg-[#12141b] text-white py-1">
                          {m.name}
                        </option>
                      ))}
                    </select>

                    <p className="text-[10px] text-[#c9c2ab]/60 font-sans">
                      Target model endpoint: <span className="font-mono text-[#d9b45c]">{config.model}</span>
                    </p>
                  </div>

                </div>

                {/* Helper / Requirements Notice Box */}
                <div className="bg-[#07080b]/60 border border-white/10 rounded-xl p-4 space-y-3 text-xs font-sans">
                  <div className="flex items-start space-x-2.5">
                    <ShieldCheck size={16} className="text-[#d9b45c] mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <strong className="text-white block font-sans">Provider Requirements &amp; Guidelines</strong>
                      <p className="text-[11px] text-[#c9c2ab]/80 leading-relaxed">{provider.requirements}</p>
                    </div>
                  </div>

                  {/* Step by step accordion toggle */}
                  <div className="pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setShowInstructions({ ...showInstructions, [provider.id]: !isInstrOpen })}
                      className="text-[11px] text-[#d9b45c] hover:text-[#f2d98a] font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <HelpCircle size={13} />
                      <span>{isInstrOpen ? "Hide setup instructions" : `How to obtain ${provider.name} API Key (4 steps)`}</span>
                      {isInstrOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>

                    {isInstrOpen && (
                      <div className="mt-3 bg-[#12141b] border border-white/10 rounded-lg p-3.5 space-y-2 animate-in fade-in duration-150">
                        <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-[#c9c2ab] leading-relaxed">
                          {provider.instructions.map((step, idx) => (
                            <li key={idx} className="pl-1">
                              <span className="text-white">{step}</span>
                            </li>
                          ))}
                        </ol>
                        <div className="pt-2">
                          <a
                            href={provider.docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-[11px] text-[#d9b45c] underline hover:text-[#f2d98a]"
                          >
                            <span>Open {provider.docLabel}</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Test Connection Action Bar & Feedback */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/5">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      disabled={testResult.loading}
                      onClick={() => handleTestConnection(provider.id)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white hover:text-[#d9b45c] border border-white/15 hover:border-[#d9b45c]/40 rounded-xl text-xs font-sans font-bold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      {testResult.loading ? (
                        <>
                          <RefreshCw size={13} className="animate-spin text-[#d9b45c]" />
                          <span>Testing Connection...</span>
                        </>
                      ) : (
                        <>
                          <Zap size={13} className="text-[#d9b45c]" />
                          <span>Test Connection</span>
                        </>
                      )}
                    </button>

                    {config.lastTested && !testResult.loading && (
                      <span className="text-[10px] text-[#c9c2ab]/50 font-mono">
                        Last tested: {config.lastTested}
                      </span>
                    )}
                  </div>

                  {/* Advanced Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowAdvanced({ ...showAdvanced, [provider.id]: !isAdvOpen })}
                    className="text-[11px] text-[#c9c2ab]/70 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <Sliders size={12} />
                    <span>{isAdvOpen ? "Hide Hyperparameters" : "Advanced Parameters (Temperature & Tokens)"}</span>
                    {isAdvOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>

                {/* Advanced parameters box */}
                {isAdvOpen && (
                  <div className="bg-[#07080b] border border-white/10 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-in fade-in duration-150">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-[#c9c2ab] font-bold uppercase">Temperature (Creativity)</label>
                        <span className="font-mono text-[#d9b45c]">{config.temperature ?? 0.7}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={config.temperature ?? 0.7}
                        onChange={(e) => handleUpdateProvider(provider.id, { temperature: parseFloat(e.target.value) })}
                        className="w-full accent-[#d9b45c] cursor-pointer"
                      />
                      <span className="text-[9px] text-[#c9c2ab]/50 block">0 = Strict &amp; Deterministic, 1 = Creative</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] text-[#c9c2ab] font-bold uppercase">Max Output Tokens</label>
                        <span className="font-mono text-[#d9b45c]">{config.maxTokens ?? 2048}</span>
                      </div>
                      <input
                        type="number"
                        min="256"
                        max="8192"
                        step="256"
                        value={config.maxTokens ?? 2048}
                        onChange={(e) => handleUpdateProvider(provider.id, { maxTokens: parseInt(e.target.value, 10) || 2048 })}
                        className="w-full bg-[#12141b] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono outline-none focus:border-[#d9b45c]"
                      />
                      <span className="text-[9px] text-[#c9c2ab]/50 block">Max response token ceiling</span>
                    </div>
                  </div>
                )}

                {/* Test Connection Live Banner */}
                {testResult.success !== undefined && (
                  <div
                    className={`p-4 rounded-xl border text-xs font-sans space-y-2 animate-in fade-in duration-200 ${
                      testResult.success
                        ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                        : "bg-red-950/30 border-red-500/40 text-red-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {testResult.success ? (
                          <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                        ) : (
                          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                        )}
                        <span className="font-bold">
                          {testResult.success ? "Connection Verified Successfully" : "Connection Failed"}
                        </span>
                      </div>
                      {testResult.latencyMs && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10">
                          {testResult.latencyMs}ms latency
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] leading-relaxed pl-6">
                      {testResult.success ? testResult.message : testResult.error}
                    </p>

                    {testResult.sampleResponse && (
                      <div className="mt-2 pl-6">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Model Validation Response:</span>
                        <code className="text-[11px] font-mono text-emerald-400 bg-black/40 px-2 py-0.5 rounded block mt-0.5">
                          {testResult.sampleResponse}
                        </code>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive AI Prompt Bench / Live Playground */}
      <div className="bg-[#12141b] border border-[#d9b45c]/25 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Play className="text-[#d9b45c]" size={18} />
              <h3 className="text-base font-sans font-bold text-white uppercase tracking-wider">
                Live AI Prompt Tester &amp; Playground
              </h3>
            </div>
            <p className="text-xs text-[#c9c2ab]/80 font-sans">
              Test prompts directly against your configured AI models in real time to verify generation speed, tone, and accuracy.
            </p>
          </div>

          {/* Quick template buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-[#c9c2ab]/50 uppercase font-bold mr-1">Templates:</span>
            {[
              { label: "Tajweed Summary", prompt: "Write a 2-sentence inspirational summary of why mastering Tajweed is essential for Holy Quran recitation." },
              { label: "SEO Meta Tag", prompt: "Generate an SEO Meta Description (under 150 chars) for an online Noorani Qaida course for kids." },
              { label: "Hifz Strategy", prompt: "List 3 proven memorization techniques for a beginner starting Quran Hifz." }
            ].map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPlaygroundPrompt(tmpl.prompt)}
                className="px-2.5 py-1 bg-white/5 hover:bg-[#d9b45c]/20 hover:text-[#d9b45c] text-[10px] font-sans rounded-lg border border-white/10 transition-colors cursor-pointer"
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div className="flex items-center space-x-2">
              <label className="text-xs font-sans font-bold text-[#d9b45c] uppercase">Provider to Test:</label>
              <select
                value={playgroundProvider}
                onChange={(e) => setPlaygroundProvider(e.target.value as any)}
                className="bg-[#07080b] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-white font-sans outline-none focus:border-[#d9b45c]"
              >
                <option value="default">Default Provider ({aiSettings.defaultProvider.toUpperCase()})</option>
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI (ChatGPT)</option>
                <option value="anthropic">Anthropic Claude</option>
              </select>
            </div>

            <button
              type="button"
              disabled={playgroundLoading || !playgroundPrompt.trim()}
              onClick={handleRunPlayground}
              className="px-5 py-2 bg-[#d9b45c] hover:bg-[#f2d98a] text-black font-sans font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {playgroundLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin text-black" />
                  <span>Generating Response...</span>
                </>
              ) : (
                <>
                  <Play size={14} className="fill-black" />
                  <span>Execute Test Prompt</span>
                </>
              )}
            </button>
          </div>

          <textarea
            rows={3}
            value={playgroundPrompt}
            onChange={(e) => setPlaygroundPrompt(e.target.value)}
            placeholder="Type your test prompt here..."
            className="w-full bg-[#07080b] border border-white/15 rounded-xl p-3.5 text-xs text-white font-sans placeholder:text-gray-600 outline-none focus:border-[#d9b45c] focus:ring-1 focus:ring-[#d9b45c] transition-all leading-relaxed"
          />

          {/* Playground Response Area */}
          {playgroundResult && (
            <div className="bg-[#07080b] border border-[#d9b45c]/30 rounded-xl p-4 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] text-[#c9c2ab]">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#d9b45c] uppercase">AI Generation Output</span>
                  <span className="text-gray-500">|</span>
                  <span className="capitalize font-mono">{playgroundMeta?.provider} ({playgroundMeta?.model})</span>
                </div>
                {playgroundMeta?.latencyMs && (
                  <span className="font-mono text-emerald-400">{playgroundMeta.latencyMs}ms</span>
                )}
              </div>

              <div className="text-xs text-emerald-300 font-sans leading-relaxed whitespace-pre-wrap pt-1">
                {playgroundResult}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleCopyText(playgroundResult, "playground-result")}
                  className="text-[10px] text-[#d9b45c] hover:text-white flex items-center space-x-1"
                >
                  {copiedKey === "playground-result" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedKey === "playground-result" ? "Copied!" : "Copy Output"}</span>
                </button>
              </div>
            </div>
          )}

          {playgroundError && (
            <div className="bg-red-950/30 border border-red-500/40 text-red-300 p-4 rounded-xl text-xs font-sans space-y-1">
              <strong className="block font-bold">Execution Error:</strong>
              <p>{playgroundError}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky-style Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="text-xs text-[#c9c2ab]/70 font-sans">
          <span>All API keys are encrypted &amp; managed server-side.</span>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          className="px-8 py-3 bg-[#d9b45c] hover:bg-[#f2d98a] text-black text-xs font-sans font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 cursor-pointer"
        >
          <CheckCircle2 size={16} />
          <span>Save AI Settings</span>
        </button>
      </div>

    </div>
  );
}
