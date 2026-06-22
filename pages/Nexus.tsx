import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  Coins, 
  Award, 
  PlusCircle, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Terminal, 
  FileCheck2, 
  HelpCircle, 
  Link2,
  RefreshCw,
  Search,
  Sparkles,
  Zap,
  Globe,
  Lock
} from 'lucide-react';

interface Question {
  qa_id: string;
  user_interest_topic: string;
  question_text: string;
  question_type: string;
  correct_answer: string;
  json_options: string[] | string;
  seo_slug: string;
  is_public_indexed: boolean;
  created_at?: string;
}

interface PayoutLog {
  tx_id: string;
  wallet_address: string;
  qa_id: string;
  token_amount: string | number;
  blockchain_hash: string;
  status: string;
  created_at: string;
}

export const Nexus: React.FC = () => {
  // Wallet state
  const [walletAddress, setWalletAddress] = useState<string>(() => {
    return localStorage.getItem('nexus_wallet_address') || '';
  });
  const [isConnecting, setIsConnecting] = useState(false);

  // Tabs: 'quizzes' | 'submit' | 'ledger'
  const [activeTab, setActiveTab] = useState<'quizzes' | 'submit' | 'ledger'>('quizzes');

  // Quizzes list state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [searchTopic, setSearchTopic] = useState('');

  // Playing state
  const [currentQuiz, setCurrentQuiz] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [answerResult, setAnswerResult] = useState<{ isCorrect: boolean; feedbackMsg: string } | null>(null);
  const [mintingReward, setMintingReward] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  // Session state
  const [dailyCounter, setDailyCounter] = useState<number>(0);
  const [sessionLoading, setSessionLoading] = useState(false);

  // Submission form state
  const [newTopic, setNewTopic] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newCorrectAnswer, setNewCorrectAnswer] = useState('');
  const [newOption1, setNewOption1] = useState('');
  const [newOption2, setNewOption2] = useState('');
  const [newOption3, setNewOption3] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  // Ledger state
  const [ledgerLogs, setLedgerLogs] = useState<PayoutLog[]>([]);
  const [loadingLedger, setLoadingLedger] = useState(false);

  // Load questions
  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const res = await fetch('/api/public/nexus/questions');
      const data = await res.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Error fetching nexus questions:', err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Load guest daily sessions limit info
  const checkSession = async (wallet: string) => {
    if (!wallet) return;
    setSessionLoading(true);
    try {
      const res = await fetch('/api/nexus/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: wallet })
      });
      const data = await res.json();
      if (data.success && data.session) {
        setDailyCounter(data.session.daily_counter || 0);
      }
    } catch (err) {
      console.error('Error checking guest session:', err);
    } finally {
      setSessionLoading(false);
    }
  };

  // Fetch payout ledger list
  const fetchPayoutLedger = async (wallet: string) => {
    if (!wallet) return;
    setLoadingLedger(true);
    try {
      const res = await fetch(`/api/nexus/payouts?wallet_address=${encodeURIComponent(wallet)}`);
      const data = await res.json();
      if (data.success && data.payouts) {
        setLedgerLogs(data.payouts);
      }
    } catch (err) {
      console.error('Error fetching payouts ledger:', err);
    } finally {
      setLoadingLedger(false);
    }
  };

  // Trigger load on start
  useEffect(() => {
    fetchQuestions();
    if (walletAddress) {
      checkSession(walletAddress);
      fetchPayoutLedger(walletAddress);
    }
  }, [walletAddress]);

  // Connect Web3 wallet mock simulation
  const handleConnectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      const mockWallets = [
        '0x71C7656EC7ab88b098defB751B7401B5f6d1476B',
        '0x2546BcD3c84621e976d8185a91A922aE77ECEc30',
        '0xb946EcD2c84621e976d8185a91A922aE77ECEc45'
      ];
      const randomWallet = mockWallets[Math.floor(Math.random() * mockWallets.length)];
      setWalletAddress(randomWallet);
      localStorage.setItem('nexus_wallet_address', randomWallet);
      setIsConnecting(false);
    }, 1200);
  };

  // Disconnect mock wallet
  const handleDisconnectWallet = () => {
    setWalletAddress('');
    localStorage.removeItem('nexus_wallet_address');
    setLedgerLogs([]);
    setDailyCounter(0);
  };

  // Submit User-Generated Q&A questions
  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic || !newQuestionText || !newCorrectAnswer || !newOption1 || !newOption2 || !newOption3) {
      alert('Please fill out all fields to register the Q&A in the warehouse.');
      return;
    }

    setSubmittingQuestion(true);
    setSubmitSuccess(false);

    const quizOptions = [
      newCorrectAnswer,
      newOption1,
      newOption2,
      newOption3
    ].sort(() => Math.random() - 0.5); // Shuffle options

    try {
      const res = await fetch('/api/nexus/submit-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_interest_topic: newTopic,
          question_text: newQuestionText,
          question_type: 'multiple_choice',
          correct_answer: newCorrectAnswer,
          json_options: quizOptions
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setNewTopic('');
        setNewQuestionText('');
        setNewCorrectAnswer('');
        setNewOption1('');
        setNewOption2('');
        setNewOption3('');
        fetchQuestions(); // Refresh quizzes list
      } else {
        alert(data.error || 'Failed to submit question.');
      }
    } catch (err) {
      console.error('Error submitting custom Q&A:', err);
    } finally {
      setSubmittingQuestion(false);
    }
  };

  // Submit Answer to active quiz
  const handleVerifyAnswer = async () => {
    if (!walletAddress) {
      alert('Please connect your Web3 Wallet to verify answers and log rewards.');
      return;
    }
    if (!currentQuiz || !selectedOption) return;

    setHasSubmittedAnswer(true);
    const isCorrect = selectedOption.trim() === currentQuiz.correct_answer.trim();

    if (isCorrect) {
      setAnswerResult({
        isCorrect: true,
        feedbackMsg: 'Outstanding! Cryptographic proof matches perfectly. Provisioning rewards...'
      });

      // Award tokens triggers write to DB & Session limits
      setMintingReward(true);
      try {
        const rewardRes = await fetch('/api/nexus/reward', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wallet_address: walletAddress,
            qa_id: currentQuiz.qa_id,
            token_amount: 1.25
          })
        });

        const rewardData = await rewardRes.json();
        if (rewardRes.ok && rewardData.success) {
          setLastTxHash(rewardData.payout.blockchain_hash);
          setDailyCounter(prev => prev + 1);
          fetchPayoutLedger(walletAddress); // Refresh transactions list
        } else {
          setAnswerResult({
            isCorrect: true,
            feedbackMsg: rewardData.error || 'Session limit capped or wallet transaction mismatch.'
          });
        }
      } catch (err) {
        console.error('Error recording payout reward:', err);
      } finally {
        setMintingReward(false);
      }
    } else {
      setAnswerResult({
        isCorrect: false,
        feedbackMsg: `Incorrect. The correct answer was: "${currentQuiz.correct_answer}"`
      });
    }
  };

  // Close active quiz modal
  const handleCloseActiveQuiz = () => {
    setCurrentQuiz(null);
    setSelectedOption(null);
    setHasSubmittedAnswer(false);
    setAnswerResult(null);
    setLastTxHash(null);
  };

  // Filtered public indexed questions search
  const filteredQuestions = questions.filter(q => 
    q.user_interest_topic.toLowerCase().includes(searchTopic.toLowerCase()) ||
    q.question_text.toLowerCase().includes(searchTopic.toLowerCase())
  );

  return (
    <div id="nexus-p2e-container" className="max-w-7xl mx-auto px-4 py-8 lg:px-8 bg-slate-50 min-h-screen">
      
      {/* Premium Hub Header with Custom Web3 branding */}
      <div className="bg-slate-900 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-2xl border-b-4 border-indigo-600">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-2xl -ml-20 -mb-20"></div>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-600 text-xs text-white font-bold tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-1">
                <Globe className="w-3 h-3" /> Web3 Academy
              </span>
              <span className="bg-emerald-600 text-xs text-white font-bold tracking-widest uppercase px-3 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 animate-pulse" /> Live Earn
              </span>
            </div>
            <h1 className="text-4xl font-extrabold font-sans tracking-tight mb-2">
              Nexus Play-to-Earn Quiz Hub
            </h1>
            <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
              Verify your Web3 and Computer Science credentials natively. Solve cryptographically-valid community quizzes, earn $NEXUS incentive utility tokens, and upload your knowledge to the SEO Ingestion Warehouse safely.
            </p>
          </div>

          {/* Web3 Wallet Connection Widget */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-4 w-full md:w-auto min-w-[280px]">
            {walletAddress ? (
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs text-slate-400 font-mono">Connected Session</span>
                  </div>
                  <button 
                    onClick={handleDisconnectWallet}
                    className="text-xs text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/10 px-2 py-0.5 rounded"
                  >
                    Disconnect
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-3 bg-slate-900 border border-slate-700/60 rounded px-2 py-1.5">
                  <Wallet className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-mono text-xs text-indigo-200">
                    {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Coins className="w-3.5 h-3.5 text-amber-400" /> Rem. Quizzes:
                  </span>
                  <span className="font-mono font-bold text-white bg-slate-900/50 px-2 py-0.5 rounded">
                    {10 - dailyCounter} / 10 Left
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <div className="flex justify-center mb-2">
                  <div className="p-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    <Lock className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-3">Login with a wallet to begin earning</p>
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:scale-100 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Connecting EVM...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      Connect Web3 Wallet
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation Layout */}
      <div className="flex border-b border-slate-200 mb-8 bg-white max-w-lg rounded-xl p-1.5 shadow-sm border border-slate-200/60 shrink-0 gap-1">
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold tracking-wider uppercase rounded-lg transition-all ${
            activeTab === 'quizzes' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Active Quizzes
        </button>
        <button
          onClick={() => setActiveTab('submit')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold tracking-wider uppercase rounded-lg transition-all ${
            activeTab === 'submit' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Ingest Q&A
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold tracking-wider uppercase rounded-lg transition-all ${
            activeTab === 'ledger' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Payout Logs
        </button>
      </div>

      {/* Main Switchboard Components */}
      <div>
        {activeTab === 'quizzes' && (
          <div>
            {/* Search and header settings bar */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" /> Public Indexed Quizzes
                </h2>
                <p className="text-xs text-slate-500">
                  Select a topic to execute and verify correct quiz logic. Double check answers to secure payouts.
                </p>
              </div>

              {/* Topic search filtering */}
              <div className="relative max-w-sm sm:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Filter topic or keywords..."
                  value={searchTopic}
                  onChange={(e) => setSearchTopic(e.target.value)}
                  className="bg-white block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                />
              </div>
            </div>

            {/* Questions list renderer */}
            {loadingQuestions ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                <p className="text-xs text-slate-500">Querying decentralized Nexus database pools...</p>
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-600">No quizzes matched search criteria</p>
                <p className="text-xs text-slate-400 mt-1">Try expanding your keyword query or ingest a new question.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuestions.map((q) => (
                  <div 
                    key={q.qa_id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:border-indigo-300 hover:shadow-lg hover:-translate-y-0.5 transition-all relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                          {q.user_interest_topic}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <PlusCircle className="w-3 h-3 text-emerald-500" /> 1.25 NEXUS
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-800 text-sm mb-4 leading-relaxed min-h-[40px]">
                        {q.question_text}
                      </h3>
                    </div>

                    <div className="border-t border-slate-100/80 pt-4 mt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">SEO URL Endpoint</span>
                        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 overflow-hidden text-ellipsis max-w-[170px] whitespace-nowrap">
                          <Link2 className="w-3 h-3 shrink-0" /> /nexus/{q.seo_slug}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          if (!walletAddress) {
                            alert('Please associate a Web3 Wallet first via the top container connect button.');
                            return;
                          }
                          if (dailyCounter >= 10) {
                            alert('You have hit your play limits of 10 quizzes per day. Please check back tomorrow.');
                            return;
                          }
                          setCurrentQuiz(q);
                        }}
                        className={`text-xs font-bold py-2 px-3.5 rounded-xl transition-all ${
                          walletAddress 
                            ? 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95' 
                            : 'bg-slate-150 text-slate-400 cursor-not-allowed border border-slate-200'
                        }`}
                      >
                        {walletAddress ? 'Start Quiz' : 'Connect Wallet'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'submit' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-3xl shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-1">
                <FileCheck2 className="w-5 h-5 text-emerald-500" /> Knowledge Ingestion Warehouse
              </h2>
              <p className="text-xs text-slate-500">
                Register a validated question to enable public play records. All custom Q&As will execute auto-generated SEO URLs, which boosts organic long-tail search traffic to global search channels automatically.
              </p>
            </div>

            {submitSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-800">Q&A Compiled Successfully!</h4>
                  <p className="text-xs text-emerald-600 mt-1">
                    Your question block is indexed inside the decentralized warehouse and is immediately playable for rewards.
                  </p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    User Interest Topic
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solidity Security, Cryptography"
                    value={newTopic}
                    onChange={(e) => { setSubmitSuccess(false); setNewTopic(e.target.value); }}
                    className="bg-white block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Correct Answer Choice
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Specify the absolute correct answer"
                    value={newCorrectAnswer}
                    onChange={(e) => { setSubmitSuccess(false); setNewCorrectAnswer(e.target.value); }}
                    className="bg-white block w-full px-3 py-2.5 border border-emerald-300 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Question Text Block
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Formulate your explicit technical question text..."
                  value={newQuestionText}
                  onChange={(e) => { setSubmitSuccess(false); setNewQuestionText(e.target.value); }}
                  className="bg-white block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                />
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Secondary Distractor Choices (Wrong Options)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Option 2 (Incorrect)</label>
                    <input
                      type="text"
                      required
                      placeholder="Wrong option A"
                      value={newOption1}
                      onChange={(e) => { setSubmitSuccess(false); setNewOption1(e.target.value); }}
                      className="bg-white block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Option 3 (Incorrect)</label>
                    <input
                      type="text"
                      required
                      placeholder="Wrong option B"
                      value={newOption2}
                      onChange={(e) => { setSubmitSuccess(false); setNewOption2(e.target.value); }}
                      className="bg-white block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Option 4 (Incorrect)</label>
                    <input
                      type="text"
                      required
                      placeholder="Wrong option C"
                      value={newOption3}
                      onChange={(e) => { setSubmitSuccess(false); setNewOption3(e.target.value); }}
                      className="bg-white block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submittingQuestion}
                  className="bg-slate-900 hover:bg-slate-800 active:scale-95 disabled:scale-100 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all tracking-wider uppercase flex items-center gap-1.5 shadow-md"
                >
                  {submittingQuestion ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Uploading Q&A...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      Save & Publish indexed
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'ledger' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-1">
                  <Terminal className="w-5 h-5 text-indigo-500" /> Real-time Payout Logs & Ledger
                </h2>
                <p className="text-xs text-slate-500">
                  Audit tracking records of tokens minted during verified correct quiz plays.
                </p>
              </div>

              {walletAddress && (
                <button
                  onClick={() => fetchPayoutLedger(walletAddress)}
                  className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh List
                </button>
              )}
            </div>

            {!walletAddress ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">No Associated Wallet Linked</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Please link a Web3 public key address using the top connect banner to retrieve personal ledger payouts.
                </p>
              </div>
            ) : loadingLedger ? (
              <div className="text-center py-12">
                <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-500">Reading payout receipts from database schema...</p>
              </div>
            ) : ledgerLogs.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border border-slate-100 rounded-xl">
                <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">Zero Verified Payout Mint Records</p>
                <p className="text-xs text-slate-400 mt-1">
                  Correctly resolve active quiz modules to start earning $NEXUS ledger logs.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider text-left">
                      <th className="py-3 px-4">Transaction ID</th>
                      <th className="py-3 px-4">Ledger Payout</th>
                      <th className="py-3 px-4">Target Wallet</th>
                      <th className="py-3 px-4">Blockchain Hash</th>
                      <th className="py-3 px-4">Execution Status</th>
                      <th className="py-3 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-mono">
                    {ledgerLogs.map((log) => (
                      <tr key={log.tx_id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-slate-800 font-semibold">{log.tx_id.substring(0, 8)}...</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          +{log.token_amount} NEXUS
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {log.wallet_address.substring(0, 6)}...{log.wallet_address.substring(log.wallet_address.length - 4)}
                        </td>
                        <td className="py-3 px-4 text-indigo-500 text-[11px] max-w-[200px] truncate">
                          {log.blockchain_hash}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Quiz Overlay Block (Modal) */}
      <AnimatePresence>
        {currentQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Background blur overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={hasSubmittedAnswer ? handleCloseActiveQuiz : undefined}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            ></motion.div>

            {/* Modal payload */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg uppercase">
                  {currentQuiz.user_interest_topic}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ID: {currentQuiz.qa_id.substring(0, 8)}...
                </span>
              </div>

              <h3 className="font-extrabold text-slate-800 text-base mb-6 leading-relaxed">
                {currentQuiz.question_text}
              </h3>

              {/* Options choices renderer */}
              <div className="space-y-3 mb-6">
                {Array.isArray(currentQuiz.json_options) 
                  ? (currentQuiz.json_options as string[]).map((opt) => (
                      <button
                        key={opt}
                        disabled={hasSubmittedAnswer}
                        onClick={() => setSelectedOption(opt)}
                        className={`w-full text-left p-3.5 rounded-xl border-2 text-xs font-semibold leading-relaxed transition-all flex items-center justify-between gap-2 ${
                          selectedOption === opt
                            ? 'border-indigo-600 bg-indigo-50/40 text-indigo-800'
                            : 'border-slate-150 hover:border-slate-300 text-slate-600 bg-white'
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedOption === opt && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        )}
                      </button>
                    ))
                  : JSON.parse(currentQuiz.json_options as string || '[]').map((opt: string) => (
                      <button
                        key={opt}
                        disabled={hasSubmittedAnswer}
                        onClick={() => setSelectedOption(opt)}
                        className={`w-full text-left p-3.5 rounded-xl border-2 text-xs font-semibold leading-relaxed transition-all flex items-center justify-between gap-2 ${
                          selectedOption === opt
                            ? 'border-indigo-600 bg-indigo-50/40 text-indigo-800'
                            : 'border-slate-150 hover:border-slate-300 text-slate-600 bg-white'
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedOption === opt && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        )}
                      </button>
                    ))
                }
              </div>

              {/* Feedback overlay */}
              {answerResult && (
                <div className={`p-4 rounded-xl mb-6 flex items-start gap-2.5 border ${
                  answerResult.isCorrect 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {answerResult.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold leading-none">{answerResult.isCorrect ? 'Verification Success' : 'Incorrect Choice'}</h4>
                    <p className="text-xs leading-relaxed mt-1 text-slate-600">{answerResult.feedbackMsg}</p>
                    
                    {lastTxHash && (
                      <div className="mt-3 bg-white/75 p-2 rounded-lg border border-emerald-100 font-mono text-[10px] text-slate-500 overflow-hidden text-ellipsis select-all">
                        <span className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider">Blockchain Receipt</span>
                        <div className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 mt-0.5">
                          <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>TX: {lastTxHash.substring(0, 16)}...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Footer action buttons */}
              <div className="flex gap-3 justify-end">
                {!hasSubmittedAnswer ? (
                  <>
                    <button
                      onClick={handleCloseActiveQuiz}
                      className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 text-xs font-bold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!selectedOption}
                      onClick={handleVerifyAnswer}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:scale-100 active:scale-95 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all tracking-wider uppercase shadow-md shadow-indigo-600/10"
                    >
                      Verify Crypto Answer
                    </button>
                  </>
                ) : (
                  <button
                    disabled={mintingReward}
                    onClick={handleCloseActiveQuiz}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all tracking-wider uppercase shadow-md"
                  >
                    {mintingReward ? 'Generating Block Record...' : 'Complete & Close'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
