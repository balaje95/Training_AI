/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  Video, 
  Library, 
  Settings, 
  HelpCircle, 
  Bell, 
  Share2, 
  FileDown, 
  ChevronRight, 
  Calendar, 
  Timer,
  ExternalLink,
  MoreVertical,
  PlayCircle,
  History,
  CloudUpload,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Edit,
  Save,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Workflow,
  PlusCircle,
  Link as LinkIcon,
  RefreshCw,
  Sparkles,
  Maximize2,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ViewState, Guide, Recording, Step, PipelineType } from './types';
import { mockRecordings, generateGuideFromTranscript, searchFathomRecordings } from './services';

// --- Components ---

const Sidebar = ({ activeView, setView }: { activeView: ViewState, setView: (v: ViewState) => void }) => {
  const navItems = [
    { id: 'dashboard', icon: FileText, label: 'Guides' },
    { id: 'recordings', icon: Video, label: 'Recordings' },
    { id: 'library', icon: Library, label: 'Library' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-70 h-screen fixed left-0 top-0 bg-white border-r border-[#c2c6d8] flex flex-col py-6 z-50">
      <div className="px-6 mb-10">
        <h1 className="text-2xl font-bold text-[#0050cb]">ManualAI</h1>
        <p className="text-sm text-[#424656]">Meeting-to-Manual</p>
      </div>

      <div className="px-4 mb-8">
        <button 
          onClick={() => setView('recordings')}
          className="w-full bg-[#0066ff] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-[#0050cb] transition-colors active:scale-95"
        >
          <Plus size={18} />
          New Guide
        </button>
      </div>

      <nav className="flex-grow">
        <div className="px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeView === item.id 
                  ? 'text-[#0050cb] font-bold bg-[#f0f3ff] border-l-4 border-[#0050cb]' 
                  : 'text-[#424656] hover:text-[#111c2d] hover:bg-[#dee8ff]'
              }`}
            >
              <item.icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="mt-auto px-4 border-t border-[#c2c6d8] pt-6">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-[#424656] hover:text-[#111c2d] hover:bg-[#dee8ff] rounded-lg transition-colors">
          <HelpCircle size={20} />
          <span className="text-sm font-medium">Help</span>
        </button>
      </div>
    </aside>
  );
};

const TopBar = ({ title }: { title?: string }) => {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-280px)] bg-white border-b border-[#c2c6d8] flex justify-between items-center h-16 px-10 z-40">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#727687] group-focus-within:text-[#0050cb]" size={18} />
          <input 
            className="w-full bg-[#f9f9ff] border border-[#c2c6d8] rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-[#0050cb] focus:border-[#0050cb] outline-none transition-all text-sm h-10" 
            placeholder="Search guides, processes, or folders..." 
            type="text" 
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-6">
          <a className="text-sm font-medium text-[#0050cb] border-b-2 border-[#0050cb] pb-1" href="#">Recent</a>
          <a className="text-sm font-medium text-[#424656] hover:text-[#0050cb] transition-colors" href="#">Shared</a>
          <a className="text-sm font-medium text-[#424656] hover:text-[#0050cb] transition-colors" href="#">Drafts</a>
        </nav>
        <div className="h-6 w-px bg-[#c2c6d8]"></div>
        <button className="p-2 rounded-full hover:bg-[#dee8ff] text-[#424656] transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

// --- View: Dashboard ---
const DashboardView = ({ onNewGuide, guides }: { onNewGuide: () => void, guides: Guide[] }) => {
  const stats = [
    { label: 'TOTAL GUIDES', value: guides.length.toString(), icon: FileText, color: 'text-[#0050cb]', bg: 'bg-[#dae1ff]' },
    { label: 'TEAM MEMBERS', value: '1', icon: Library, color: 'text-[#006c49]', bg: 'bg-[#6cf8bb]/20' },
    { label: 'HOURS SAVED', value: (guides.length * 2.5).toFixed(0) + 'h', icon: Sparkles, color: 'text-[#7f4f00]', bg: 'bg-[#ffddb8]/40' },
  ];

  const recentGuides = guides.slice(0, 2);

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-[#c2c6d8] p-6 rounded-2xl flex items-center gap-6 shadow-sm">
            <div className={`w-14 h-14 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#424656] uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold text-[#111c2d]">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#111c2d]">Recent Guides</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-[#c2c6d8] hover:bg-[#dee8ff] text-[#424656]">
              <Library size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentGuides.map((guide) => (
            <motion.div 
              key={guide.id} 
              whileHover={{ y: -4 }}
              className="group bg-white border border-[#c2c6d8] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="aspect-video relative overflow-hidden bg-[#dee8ff]">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={guide.thumbnailUrl} alt={guide.title} />
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-1 rounded-full text-[10px] uppercase font-bold shadow-sm ${
                    guide.status === 'published' ? 'bg-[#6cf8bb] text-[#005236]' : 'bg-[#d8e3fb] text-[#424656]'
                  }`}>
                    {guide.status}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                   {guide.pipeline && (
                     <span className="text-[9px] font-bold bg-[#0066ff]/10 text-[#0066ff] px-2 py-0.5 rounded uppercase tracking-wider">
                       {guide.pipeline}
                     </span>
                   )}
                   {guide.customerName && (
                     <span className="text-[9px] font-bold bg-[#f0f3ff] text-[#424656] px-2 py-0.5 rounded uppercase tracking-wider">
                       {guide.customerName}
                     </span>
                   )}
                </div>
                <h2 className="text-lg font-bold text-[#111c2d] mb-1 group-hover:text-[#0050cb] transition-colors truncate">{guide.title}</h2>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 text-[#424656] text-sm">
                    <Calendar size={14} />
                    <span>{guide.publishedDate}</span>
                  </div>
                  <MoreVertical className="text-[#c2c6d8]" size={18} />
                </div>
              </div>
            </motion.div>
          ))}

          <button 
            onClick={onNewGuide}
            className="group border-2 border-dashed border-[#c2c6d8] rounded-2xl flex flex-col items-center justify-center p-6 hover:border-[#0066ff] hover:bg-[#0066ff]/5 transition-all duration-300 min-h-[240px]"
          >
            <div className="w-14 h-14 rounded-full bg-[#f0f3ff] flex items-center justify-center text-[#424656] group-hover:bg-[#0066ff] group-hover:text-white transition-colors mb-4">
              <Plus size={32} />
            </div>
            <span className="text-lg font-bold text-[#424656] group-hover:text-[#0066ff] transition-colors">Create New Manual</span>
            <p className="text-sm text-[#727687] mt-2 text-center">Transform any video recording into a step-by-step guide</p>
          </button>
        </div>
      </section>
    </div>
  );
};

// --- View: Recording Selection ---
const RecordingSelectionView = ({ onSelect }: { onSelect: (rec: Recording, pipeline: PipelineType, customer: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('balaje@zuper.co');
  const [selectedRec, setSelectedRec] = useState<Recording | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  
  // Pipeline choices
  const pipelines: PipelineType[] = ['Lead Qualification', 'Inspection', 'Production', 'Finance', 'General'];
  const [selectedPipeline, setSelectedPipeline] = useState<PipelineType>('General');
  const [customerName, setCustomerName] = useState('');

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const results = await searchFathomRecordings(searchTerm);
      setRecordings(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  // Initial search
  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="mb-8">
        <h2 className="text-4xl font-bold text-[#111c2d] mb-3">Fetch Fathom Meetings</h2>
        <p className="text-lg text-[#424656]">Enter an email to load the latest recordings from Fathom.</p>
      </header>

      <div className="flex flex-wrap items-center gap-6 mb-8 bg-white p-4 rounded-2xl border border-[#c2c6d8] shadow-sm">
        <div className="flex items-center gap-2 flex-grow max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#727687]" size={18} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full bg-[#f9f9ff] border border-[#c2c6d8] rounded-xl py-2 pl-10 pr-4 text-sm h-12 outline-none focus:ring-2 focus:ring-[#0066ff]/20 transition-all" 
            placeholder="Search by email..." 
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-[#0066ff] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#0050cb] transition-all disabled:opacity-50 h-12"
        >
          {isSearching ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          Search Fathom
        </button>
        <div className="flex items-center gap-4 ml-auto">
          <select className="bg-[#f0f3ff] border border-[#c2c6d8] rounded-xl text-sm py-2 px-4 outline-none focus:ring-2 focus:ring-[#0066ff] h-12">
            <option>Latest 10 Meetings</option>
            <option>Latest 25 Meetings</option>
            <option>Latest 50 Meetings</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 min-h-[500px]">
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
          {isSearching ? (
             Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="p-6 rounded-2xl border-2 border-[#c2c6d8] bg-white animate-pulse">
                  <div className="h-6 w-3/4 bg-[#f0f3ff] rounded mb-4"></div>
                  <div className="h-4 w-1/2 bg-[#f0f3ff] rounded mb-4"></div>
                  <div className="h-8 w-1/4 bg-[#f0f3ff] rounded"></div>
               </div>
             ))
          ) : recordings.length > 0 ? (
            recordings.map((rec) => (
              <motion.div 
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedRec(rec)}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer group relative ${
                  selectedRec?.id === rec.id 
                    ? 'bg-[#f0f3ff] border-[#0050cb] shadow-md' 
                    : 'bg-white border-[#c2c6d8] hover:border-[#0050cb]/50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-[#111c2d] group-hover:text-[#0050cb] pr-10">{rec.title}</h3>
                  {selectedRec?.id === rec.id && (
                    <span className="bg-[#0066ff] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">SELECTED</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-6 text-[#424656] text-sm mb-4">
                  <div className="flex items-center gap-1.5"><Calendar size={16} />{rec.date}</div>
                  <div className="flex items-center gap-1.5"><Timer size={16} />{rec.duration}</div>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {rec.participantAvatars.map((av, i) => (
                          <img key={i} className="w-7 h-7 rounded-full border-2 border-white object-cover" src={av} alt="Participant" />
                        ))}
                      </div>
                      <span className="text-xs text-[#727687]">{rec.participants} Participants</span>
                   </div>
                   <div className="text-[10px] font-bold text-[#727687] uppercase opacity-50">{rec.ownerEmail}</div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-10 text-center text-[#727687] border-2 border-dashed border-[#c2c6d8] rounded-2xl">
               No recordings found for this search.
            </div>
          )}
        </div>

        <div className="col-span-12 lg:col-span-7 flex flex-col">
          <div className="bg-white border border-[#c2c6d8] rounded-2xl flex-1 flex flex-col overflow-hidden shadow-sm">
            <AnimatePresence mode="wait">
              {selectedRec ? (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col h-full"
                >
                    <div className="p-6 border-b border-[#c2c6d8] flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-[#111c2d]">Meeting Insights</h3>
                        <p className="text-sm text-[#424656]">{selectedRec.title}</p>
                      </div>
                      <button 
                        onClick={() => onSelect(selectedRec, selectedPipeline, customerName || 'New Customer')}
                        className="bg-[#0066ff] text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#0050cb] transition-shadow active:scale-95 shadow-lg"
                      >
                        <Sparkles size={18} />
                        Generate Training Manual
                      </button>
                    </div>
                    
                    {/* Pipeline & Customer Input */}
                    <div className="p-6 bg-white border-b border-[#c2c6d8] grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-[#424656] uppercase tracking-wider">Select Pipeline</label>
                          <select 
                             value={selectedPipeline}
                             onChange={(e) => setSelectedPipeline(e.target.value as PipelineType)}
                             className="w-full bg-[#f9f9ff] border border-[#c2c6d8] rounded-xl py-2 px-4 text-sm h-11 outline-none focus:ring-2 focus:ring-[#0066ff]/20 transition-all font-medium"
                          >
                             {pipelines.map(p => (
                               <option key={p} value={p}>{p}</option>
                             ))}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-[#424656] uppercase tracking-wider">Customer Name</label>
                          <input 
                             type="text"
                             value={customerName}
                             onChange={(e) => setCustomerName(e.target.value)}
                             placeholder="e.g. Acme Corp"
                             className="w-full bg-[#f9f9ff] border border-[#c2c6d8] rounded-xl py-2 px-4 text-sm h-11 outline-none focus:ring-2 focus:ring-[#0066ff]/20 transition-all"
                          />
                       </div>
                    </div>
                  <div className="aspect-video w-full bg-black relative group cursor-pointer overflow-hidden">
                    <img 
                      className="w-full h-full object-cover opacity-60" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlGFzZXJnmCA-9wxgw2IEzPlOoChVHXBHC8PMLQQgSGIsyM7Otj6bhnZhIs-RRUXRYkA4vXdM6qMHMRTYoTfkCfyK0ZNHr_OhjFINVZUycMBmaPyZ8D1KygxxiV5QsK1qnSLmMNC9CmKmpfF-qGskEpFLRCE77n00WBBhDE6mW7idNFVim3LpBoJ6G5rkqa816Qiih5huGM8Fz_w7ylS8CUhU4K45a5o6sfyvZJ6yhaJAr0oJ_zMM5qP3s2Wd8L8Xi7rAAv_hIJ9Q" 
                      alt="Preview" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform">
                        <PlayCircle size={40} className="text-white" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#f9f9ff]">
                    <div className="bg-white p-6 rounded-xl border border-[#c2c6d8] shadow-sm">
                       <h4 className="font-bold text-[#111c2d] mb-4 flex items-center gap-2">
                          <History size={16} /> Meeting Summary
                       </h4>
                       <p className="text-sm text-[#424656] leading-relaxed">
                          This meeting covers the key updates for the Q3 dashboard. Primary focus areas include the new analytics module, performance improvements, and real-time data streaming implementation.
                       </p>
                    </div>
                    {selectedRec.transcript ? (
                      <div className="p-6 bg-white rounded-xl border border-[#c2c6d8] shadow-sm">
                         <h4 className="font-bold text-[#111c2d] mb-4">Snippet Preview</h4>
                         <div className="whitespace-pre-line text-[#111c2d] leading-relaxed text-sm opacity-80">
                            {selectedRec.transcript.substring(0, 500)}...
                         </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-10 text-[#727687] text-center">
                         <div className="w-12 h-12 bg-[#f0f3ff] rounded-full flex items-center justify-center mb-4">
                            <RefreshCw size={24} className="animate-spin text-[#0066ff]" />
                         </div>
                         <p className="font-medium text-sm">Transcription is processing in Fathom...</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-20 text-center text-[#727687]">
                   <div className="w-24 h-24 bg-[#f0f3ff] rounded-full flex items-center justify-center mb-6">
                      <Video size={48} className="opacity-40" />
                   </div>
                   <h3 className="text-2xl font-bold mb-2 text-[#111c2d]">Select a Recording</h3>
                   <p className="max-w-xs mx-auto text-lg leading-relaxed">Choose one of the latest 10 meetings from the search results to start building your training guide.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- View: Guide Editor ---
const GuideEditorView = ({ title, steps, onBack, onSave }: { title: string, steps: Step[], onBack: () => void, onSave: () => void }) => {
  return (
    <div className="pb-32">
      <div className="max-w-5xl mx-auto">
        {/* Editor Header */}
        <div className="mb-10 flex justify-between items-end">
          <div className="flex-1">
            <nav className="flex items-center gap-1 text-[#424656] mb-2 text-xs font-medium">
               <button onClick={onBack} className="hover:text-[#0050cb]">Library</button>
               <ChevronRight size={14} />
               <span>Generating Guide</span>
            </nav>
            <div className="flex items-center gap-2 text-[#0050cb] font-bold text-xs mb-1 uppercase tracking-wider">
               <Edit size={14} />
               DRAFT MODE
            </div>
            <h2 className="text-4xl font-bold text-[#111c2d] mb-4 outline-none border-b-2 border-transparent focus:border-[#0050cb] focus:bg-[#f0f3ff] px-1 transition-all" contentEditable>{title}</h2>
            <p className="text-lg text-[#424656] max-w-3xl outline-none focus:bg-[#f0f3ff] transition-all" contentEditable>Generated from your meeting. Edit the steps below to polish your manual.</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-5 py-2.5 border border-[#c2c6d8] text-[#111c2d] font-bold text-sm rounded-xl hover:bg-[#dee8ff]">
               <Share2 size={18} /> Share
             </button>
             <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0050cb] text-white font-bold text-sm rounded-xl hover:bg-[#003fa4] shadow-md">
               <FileDown size={18} /> Export PDF
             </button>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-10 relative">
          <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-[#c2c6d8] -z-10"></div>
          {steps.map((step, index) => (
            <motion.div 
               key={step.id} 
               initial={{ opacity: 0, x: -20 }} 
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: index * 0.1 }}
               className="relative pl-12 group"
            >
              <div className="absolute left-0 top-8 w-12 h-12 rounded-full bg-[#0050cb] text-white flex items-center justify-center font-bold text-lg shadow-lg z-10">
                {index + 1}
              </div>
              <div className="bg-white border border-[#c2c6d8] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                   <div className="flex-1">
                      <span className="text-[10px] font-bold text-[#727687] block mb-1 uppercase tracking-widest">TIMESTAMP: {step.timestamp}</span>
                      <h3 className="text-xl font-bold text-[#111c2d] outline-none hover:bg-[#f0f3ff] p-1 rounded" contentEditable>{step.title}</h3>
                   </div>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-[#424656] hover:bg-[#dee8ff] rounded-lg"><ChevronUp size={18} /></button>
                      <button className="p-2 text-[#424656] hover:bg-[#dee8ff] rounded-lg"><ChevronDown size={18} /></button>
                      <button className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-lg"><Trash2 size={18} /></button>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-[#c2c6d8] bg-[#f9f9ff]">
                    <img className="w-full h-full object-cover" src={step.imageUrl} alt={step.title} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <button className="bg-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                         <Upload size={14} /> Swap Image
                       </button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#424656] leading-relaxed min-h-[100px] outline-none hover:bg-[#f0f3ff] p-3 rounded" contentEditable>{step.description}</p>
                    <div className="mt-6 flex gap-4">
                      <button className="text-[#0050cb] font-bold text-xs flex items-center gap-1.5 hover:underline"><PlusCircle size={14} /> Add Sub-note</button>
                      <button className="text-[#0050cb] font-bold text-xs flex items-center gap-1.5 hover:underline"><LinkIcon size={14} /> Attach Resource</button>
                    </div>
                  </div>
                </div>

                {index === 0 && (
                  <div className="mt-8 bg-[#f0f3ff] border-l-4 border-[#0050cb] p-4 rounded-r-xl flex items-start gap-3">
                    <Lightbulb className="text-[#0050cb] mt-1" size={20} />
                    <div className="text-sm">
                      <p className="font-bold text-[#0050cb] mb-1">PRO TIP</p>
                      <p className="text-[#424656]">Keep instructions concise. Users scan manuals quickly during execution.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          <div className="pl-12 pt-4">
            <button className="w-full py-10 border-2 border-dashed border-[#c2c6d8] rounded-2xl flex flex-col items-center justify-center text-[#727687] hover:border-[#0050cb] hover:text-[#0050cb] hover:bg-[#f0f3ff] transition-all group">
              <PlusCircle size={32} className="mb-2 group-active:scale-95 transition-transform" />
              <span className="font-bold text-lg">Add Step</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-10 left-[calc(280px+2.5rem)] right-10 flex justify-center z-50">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-2 rounded-2xl shadow-2xl border border-[#c2c6d8] flex items-center gap-4 max-w-2xl w-full"
        >
          <div className="flex flex-col px-6 border-r border-[#c2c6d8]">
            <span className="text-[10px] font-bold text-[#727687] uppercase tracking-wider">STATUS</span>
            <div className="flex items-center gap-2 text-[#006c49] font-bold text-sm">
               <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
               Auto-saved 2m ago
            </div>
          </div>
          <div className="flex gap-2 flex-grow pr-4 justify-end">
             <button className="p-3 text-[#424656] hover:bg-[#dee8ff] rounded-xl"><Copy size={20} /></button>
             <button onClick={onBack} className="p-3 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl"><Trash2 size={20} /></button>
             <button onClick={onSave} className="bg-[#0050cb] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#003fa4] transition-all shadow-lg active:scale-95 ml-4">
                <Save size={20} /> Save Manual
             </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- View: Processing ---
const ProcessingView = ({ progress }: { progress: number }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[60vh] text-center">
       <div className="relative w-40 h-40 mb-10">
          <svg className="w-full h-full transform -rotate-90">
             <circle className="text-[#f0f3ff] stroke-current" strokeWidth="8" cx="80" cy="80" r="70" fill="transparent"></circle>
             <motion.circle 
               className="text-[#0050cb] stroke-current" 
               strokeWidth="8" 
               strokeLinecap="round" 
               cx="80" cy="80" r="70" 
               fill="transparent"
               initial={{ strokeDasharray: "0, 1000" }}
               animate={{ strokeDasharray: `${progress * 4.4}, 1000` }}
             ></motion.circle>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
             <Sparkles size={48} className="text-[#0050cb] animate-pulse" />
          </div>
       </div>
       <h2 className="text-3xl font-bold text-[#111c2d] mb-4">ManualAI is working...</h2>
       <p className="text-lg text-[#424656] max-w-md mx-auto">Analyzing video transcripts and extracting key steps for your training document. This takes about 60 seconds.</p>
       <div className="mt-10 flex gap-4 text-xs font-bold text-[#0050cb]">
          <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> Fetching Transcription</span>
          <span className="flex items-center gap-1.5 animate-pulse"><Timer size={14} /> Extraction in progress</span>
          <span className="flex items-center gap-1.5 opacity-40"><AlertTriangle size={14} /> Formatting Document</span>
       </div>
    </div>
  );
};


// --- View: Library ---
const LibraryView = ({ guides }: { guides: Guide[] }) => {
  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-bold text-[#111c2d] mb-2 font-display uppercase tracking-tight">Manual Library</h2>
        <p className="text-[#424656] text-lg">Browse all training documents generated from your pipeline.</p>
      </header>

      <div className="flex items-center gap-4 mb-8">
        <button className="px-6 py-2 bg-[#0050cb] text-white rounded-full text-sm font-bold shadow-md">All Manuals</button>
        <button className="px-6 py-2 bg-white border border-[#c2c6d8] text-[#424656] rounded-full text-sm font-bold hover:bg-[#f0f3ff] transition-colors">By Department</button>
        <button className="px-6 py-2 bg-white border border-[#c2c6d8] text-[#424656] rounded-full text-sm font-bold hover:bg-[#f0f3ff] transition-colors">Recent Updates</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.length > 0 ? (
          guides.map((guide) => (
            <motion.div 
              key={guide.id} 
              whileHover={{ y: -6 }}
              className="group bg-white border border-[#c2c6d8] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-video relative overflow-hidden bg-[#dae1ff]">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={guide.thumbnailUrl} alt={guide.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                   <button className="w-full py-2.5 bg-white text-[#0050cb] font-bold rounded-xl flex items-center justify-center gap-2 shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform">
                      <PlayCircle size={18} /> View Manual
                   </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                   <span className="px-2 py-0.5 bg-[#f0f3ff] text-[#0050cb] text-[10px] font-bold rounded uppercase">V{guide.version || '1.0'}</span>
                   <span className="text-[10px] font-bold text-[#727687] uppercase tracking-widest">{guide.lastUpdated}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                   {guide.pipeline && (
                     <span className="px-2 py-0.5 bg-[#0066ff]/10 text-[#0066ff] text-[9px] font-bold rounded uppercase tracking-tighter">
                       {guide.pipeline}
                     </span>
                   )}
                   {guide.customerName && (
                     <span className="px-2 py-0.5 bg-[#f0f3ff] text-[#424656] text-[9px] font-bold rounded uppercase tracking-tighter">
                       {guide.customerName}
                     </span>
                   )}
                </div>
                <h3 className="text-xl font-bold text-[#111c2d] mb-2 group-hover:text-[#0050cb] transition-colors line-clamp-1">{guide.title}</h3>
                <p className="text-sm text-[#424656] line-clamp-2 mb-6">{guide.description}</p>
                <div className="flex items-center justify-between border-t border-[#f0f3ff] pt-4">
                  <div className="flex items-center gap-2 text-[#424656] text-xs font-bold uppercase tracking-wider">
                    <FileText size={14} className="text-[#0050cb]" />
                    <span>8 Steps</span>
                  </div>
                  <div className="flex -space-x-2">
                    {guide.authorIds.map((id, i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-[#0050cb] border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                        {id.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-[#727687] text-center border-2 border-dashed border-[#c2c6d8] rounded-3xl">
             <Library size={64} className="mb-4 opacity-20" />
             <h3 className="text-xl font-bold text-[#111c2d]">No manuals found</h3>
             <p className="mt-2 max-w-xs">Start by connecting Fathom and generating your first training manual.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- View: Settings ---
const SettingsView = () => {
  const [fathomKey, setFathomKey] = useState(localStorage.getItem('FATHOM_API_KEY') || '');
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('GEMINI_API_KEY') || '');
  const [showFathom, setShowFathom] = useState(false);
  const [showGemini, setShowGemini] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSave = () => {
    localStorage.setItem('FATHOM_API_KEY', fathomKey);
    localStorage.setItem('GEMINI_API_KEY', geminiKey);
    setSaveStatus('Settings saved successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const sections = [
    { 
      title: 'API Configuration', 
      icon: Key, 
      isCustom: true,
      content: (
        <div className="p-8 space-y-8">
          {/* Fathom Key */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-[#111c2d] uppercase tracking-wider">Fathom API Key</label>
              <a 
                href="https://fathom.video/fathom-for-teams-api" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-[#0050cb] hover:underline flex items-center gap-1"
              >
                Where do I find this? <ExternalLink size={12} />
              </a>
            </div>
            <div className="relative group">
              <input 
                type={showFathom ? "text" : "password"}
                value={fathomKey}
                onChange={(e) => setFathomKey(e.target.value)}
                placeholder="Enter your Fathom Bearer Token..."
                className="w-full bg-[#f9f9ff] border border-[#c2c6d8] rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all"
              />
              <button 
                onClick={() => setShowFathom(!showFathom)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#727687] hover:text-[#111c2d]"
              >
                {showFathom ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-[#727687] leading-relaxed">
              Required to fetch real-time transcripts from your Fathom recordings. 
              Find this in your <strong>Fathom for Teams</strong> settings under "API Tokens".
            </p>
          </div>

          <div className="h-px bg-[#f0f3ff]"></div>

          {/* Gemini Key */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-[#111c2d] uppercase tracking-wider">Google Gemini API Key</label>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-[#0050cb] hover:underline flex items-center gap-1"
              >
                Get a free key <ExternalLink size={12} />
              </a>
            </div>
            <div className="relative group">
              <input 
                type={showGemini ? "text" : "password"}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="w-full bg-[#f9f9ff] border border-[#c2c6d8] rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-[#0050cb]/20 focus:border-[#0050cb] outline-none transition-all"
              />
              <button 
                onClick={() => setShowGemini(!showGemini)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#727687] hover:text-[#111c2d]"
              >
                {showGemini ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-[#727687] leading-relaxed">
              Powers the AI that transforms transcripts into training manuals. 
              Get your key from the <strong>Google AI Studio</strong> dashboard.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            {saveStatus ? (
              <div className="flex items-center gap-2 text-[#006c49] text-sm font-bold">
                <CheckCircle2 size={16} /> {saveStatus}
              </div>
            ) : <div />}
            <button 
              onClick={handleSave}
              className="bg-[#0050cb] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#003fa4] transition-all shadow-md active:scale-95"
            >
              <Save size={18} /> Save Credentials
            </button>
          </div>
        </div>
      )
    },
    { title: 'App Connections', icon: LinkIcon, items: [
      { name: 'Fathom Video', status: fathomKey ? 'Configured' : 'Missing Key', desc: 'Syncs latest recordings automatically.' },
      { name: 'Zoom', status: 'Not Connected', desc: 'Import Zoom cloud recordings.' },
    ]},
    { title: 'Team & Workspace', icon: Library, items: [
      { name: 'Workspace Admin', status: 'balaje@zuper.co', desc: 'Owner with full access.' },
      { name: 'Team Plan', status: 'Pro Individual', desc: 'Unlimited guides per month.' },
    ]}
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header>
        <h2 className="text-3xl font-bold text-[#111c2d] mb-2 font-display uppercase tracking-tight">App Settings</h2>
        <p className="text-[#424656] text-lg">Manage your secure API keys, integrations, and workspace configuration.</p>
      </header>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="bg-white border border-[#c2c6d8] rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 bg-[#f9f9ff] border-b border-[#c2c6d8] flex items-center gap-3">
               <section.icon size={20} className="text-[#0050cb]" />
               <h3 className="font-bold text-[#111c2d] uppercase tracking-wider text-sm">{section.title}</h3>
            </div>
            
            {section.isCustom ? section.content : (
              <div className="divide-y divide-[#f0f3ff]">
                {section.items?.map((item) => (
                  <div key={item.name} className="p-6 flex items-center justify-between hover:bg-[#f9f9ff] transition-colors group">
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#111c2d] flex items-center gap-2">
                         {item.name}
                         {item.status === 'Configured' && <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>}
                      </h4>
                      <p className="text-sm text-[#727687]">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                         item.status === 'Configured' ? 'bg-[#6cf8bb]/20 text-[#006c49]' : 'bg-[#f0f3ff] text-[#424656]'
                       }`}>
                         {item.status}
                       </span>
                       <button className="text-[#0050cb] font-bold text-xs hover:underline uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Manage</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-8 bg-[#ba1a1a]/5 border border-[#ba1a1a]/20 rounded-3xl flex items-center justify-between">
         <div className="space-y-1">
            <h4 className="font-bold text-[#ba1a1a] flex items-center gap-2 uppercase tracking-wider text-sm">Danger Zone</h4>
            <p className="text-sm text-[#424656]">Permanently delete all manuals and disconnect linked accounts.</p>
         </div>
         <button className="px-6 py-2 border border-[#ba1a1a] text-[#ba1a1a] font-bold rounded-xl hover:bg-[#ba1a1a] hover:text-white transition-all text-sm uppercase tracking-widest">Wipe Data</button>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [activeView, setView] = useState<ViewState>('dashboard');
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [generatedGuide, setGeneratedGuide] = useState<{ title: string, steps: Step[], pipeline?: PipelineType, customerName?: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Library State
  const [libraryGuides, setLibraryGuides] = useState<Guide[]>([
    { 
      id: 'g-1', 
      title: 'Customer Onboarding Flow', 
      description: 'Standard procedure for client kick-off calls.', 
      publishedDate: 'Oct 24, 2023', 
      status: 'published',
      thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQNXHBimLmXl72JxChE-b5wdHQrjszImKIfBND6OYBC2D97yJq9bJ_Yo2aQ2l9SwScgCLgyXk77GCsCTbDazQrdUYGQBHcMmZfjKov4ai9IHmIKDDOF2M4iDbq01EcYJMk2xInUYSCMXrxVWt5EKHqvYq-Oysv56tljzt-8Jr2xehBS5yqpk-eGP_fvr-M8AFXZLr6awcHFWrcUY8bV4k31dnlRN7QTNymcb1T9LFqxI7o3Fh9lk4_WP1cLC8pYpFFJ65upZhAt-0',
      authorIds: ['u1', 'u2'],
      lastUpdated: '2h ago',
      version: '1.2'
    },
    { 
      id: 'g-2', 
      title: 'Internal Security Protocol', 
      description: 'Guidelines for managing enterprise dashboard access.', 
      publishedDate: 'Oct 22, 2023', 
      status: 'draft',
      thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAofZcxlsD6bUs-gS87hnQdyjgMUVYauu7VQ11wmcXlsScvlcD2tPFHVX0z1uaTZgHV6jH5B3ojcmm2zvfm-cTjnbXMaeUErfPTH1JeMeVeVPiuyjeld0qEi_0jda6InRPuxKNgZypGae_sM_gH1aSdsm8bjDRL9MYkADEPlVKGkBI-CZnjVRCSxUcBYqw6Bo_AqE6G7b4RRSYgMkaCvDtufPqsDluTkQJGkhVHgBQ3HNgGRrb7OlZhzdKkdRO6Ool0PHCpnLAvdNo',
      authorIds: ['u1'],
      lastUpdated: 'Yesterday',
      version: '0.8'
    }
  ]);

  const handleSelectRecording = async (rec: Recording, pipeline: PipelineType = 'General', customer: string = 'Our Customer') => {
    setSelectedRecording(rec);
    setIsProcessing(true);
    setView('queue');
    
    // Simulate generation progress
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(Math.min(p, 98));
    }, 100);

    try {
      const guide = await generateGuideFromTranscript(rec, pipeline, customer);
      setGeneratedGuide({ ...guide, pipeline, customerName: customer });
      setIsProcessing(false);
      setProgress(100);
      setView('editor');
      clearInterval(interval);
    } catch (error) {
      setIsProcessing(false);
      setView('recordings');
      clearInterval(interval);
    }
  };

  const handleSaveManual = () => {
    if (!generatedGuide) return;
    
    const newGuide: Guide = {
      id: `g-${Date.now()}`,
      title: generatedGuide.title,
      description: generatedGuide.steps[0]?.description.substring(0, 100) + '...',
      publishedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'published',
      thumbnailUrl: generatedGuide.steps[0]?.imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070',
      authorIds: ['me'],
      lastUpdated: 'Just now',
      version: '1.0',
      pipeline: generatedGuide.pipeline,
      customerName: generatedGuide.customerName
    };

    setLibraryGuides([newGuide, ...libraryGuides]);
    setView('library');
  };

  const renderContent = () => {
    if (isProcessing) return <ProcessingView progress={progress} />;

    switch (activeView) {
      case 'dashboard':
        return <DashboardView onNewGuide={() => setView('recordings')} guides={libraryGuides} />;
      case 'recordings':
        return <RecordingSelectionView onSelect={handleSelectRecording} />;
      case 'editor':
        return generatedGuide ? (
          <GuideEditorView 
            title={generatedGuide.title} 
            steps={generatedGuide.steps} 
            onBack={() => setView('dashboard')} 
            onSave={handleSaveManual}
          />
        ) : <DashboardView onNewGuide={() => setView('recordings')} guides={libraryGuides} />;
      case 'library':
        return <LibraryView guides={libraryGuides} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onNewGuide={() => setView('recordings')} guides={libraryGuides} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] font-sans selection:bg-[#dae1ff] selection:text-[#0050cb]">
      <Sidebar activeView={activeView} setView={setView} />
      <TopBar />
      <main className="ml-[280px] pt-24 px-10 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView + (isProcessing ? '-processing' : '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
