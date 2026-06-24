import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  BookOpen, 
  Plus, 
  Trash2,
  Lock
} from 'lucide-react';
import { initPaddle, openCheckout } from '../lib/paddle';

interface AvailabilitySlot {
  id: string;
  day: string;
  time: string;
  isBooked: boolean;
  studentName?: string;
}

const INITIAL_SLOTS: AvailabilitySlot[] = [
  { id: '1', day: 'Monday', time: '10:00 AM - 11:30 AM', isBooked: true, studentName: 'Imran Khan (Calculus II)' },
  { id: '2', day: 'Monday', time: '02:00 PM - 03:30 PM', isBooked: false },
  { id: '3', day: 'Wednesday', time: '11:00 AM - 12:30 PM', isBooked: true, studentName: 'Ayesha Bibi (AP Chemistry)' },
  { id: '4', day: 'Wednesday', time: '04:00 PM - 05:30 PM', isBooked: false },
  { id: '5', day: 'Thursday', time: '09:00 AM - 10:30 AM', isBooked: false },
  { id: '6', day: 'Friday', time: '01:00 PM - 02:30 PM', isBooked: false }
];

export const PrivateTutors: React.FC = () => {
  // Initialize Paddle Sandbox Environment
  useEffect(() => {
    initPaddle();
  }, []);

  // Slots State
  const [slots, setSlots] = useState<AvailabilitySlot[]>(INITIAL_SLOTS);
  const [selectedSlotForBooking, setSelectedSlotForBooking] = useState<string | null>(null);
  const [newStudentName, setNewStudentName] = useState('');
  
  // Custom slot creator state
  const [customDay, setCustomDay] = useState('Monday');
  const [customTime, setCustomTime] = useState('03:30 PM - 05:00 PM');

  // Pricing Sandbox state
  const [hourlyRate, setHourlyRate] = useState<number>(45);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(6);
  const [commissionTier, setCommissionTier] = useState<number>(5); // (%) Commission charged by academy gateway

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotForBooking || !newStudentName) return;

    setSlots(prev => prev.map(slot => {
      if (slot.id === selectedSlotForBooking) {
        return { ...slot, isBooked: true, studentName: newStudentName };
      }
      return slot;
    }));
    
    setSelectedSlotForBooking(null);
    setNewStudentName('');
  };

  const handleCancelBooking = (slotId: string) => {
    setSlots(prev => prev.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, isBooked: false, studentName: undefined };
      }
      return slot;
    }));
  };

  const handleCreateCustomSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: AvailabilitySlot = {
      id: `custom-slot-${Date.now()}`,
      day: customDay,
      time: customTime,
      isBooked: false
    };

    setSlots(prev => [...prev, newSlot]);
  };

  const handleRemoveSlot = (slotId: string) => {
    setSlots(prev => prev.filter(s => s.id !== slotId));
  };

  // Calculating monthly tutor earnings
  const calculateEarnings = () => {
    const grossWeekly = hourlyRate * hoursPerWeek;
    const grossMonthly = grossWeekly * 4.3; // Avg weeks per month
    const gatewayFee = grossMonthly * (commissionTier / 100);
    const netMonthly = grossMonthly - gatewayFee;

    return {
      weekly: parseFloat(grossWeekly.toFixed(2)),
      monthlyGross: parseFloat(grossMonthly.toFixed(2)),
      feeAmount: parseFloat(gatewayFee.toFixed(2)),
      monthlyNet: parseFloat(netMonthly.toFixed(2))
    };
  };

  const financials = calculateEarnings();

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full text-emerald-800 text-xs font-bold mb-4">
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            <span>SOLO PROFESSIONALS & PRIVATE TUTORS</span>
          </div>
          <h1 className="text-3.5xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Taleem360 <span className="text-emerald-600 font-extrabold">Private Tutor</span> Mini-Websites
          </h1>
          <p className="mt-3 text-slate-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Run an independent tutoring agency with pixel-perfect personal landing profiles. Streamline client schedules, handle Paddle checkouts directly, and manage student attendance logs cleanly from one simple screen.
          </p>
        </div>

        {/* main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column A: Interactive Booking sandbox & Availability Matrix */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6">
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-sans">Availability & Scheduling Matrix</h3>
                    <p className="text-xs text-slate-400">Configure public slots & simulate client session booking workflows.</p>
                  </div>
                </div>
              </div>

              {/* Slots list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {slots.map((slot) => (
                  <div 
                    key={slot.id} 
                    className={`p-4 rounded-xl border text-xs transition flex flex-col justify-between ${
                      slot.isBooked 
                        ? 'border-indigo-100 bg-indigo-50/20' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-slate-800 uppercase tracking-widest text-[9px]">{slot.day}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          slot.isBooked ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {slot.isBooked ? 'Allocated' : 'Available'}
                        </span>
                      </div>
                      
                      <div className="text-slate-800 font-bold mb-2 flex items-center gap-1 font-mono text-[10px]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {slot.time}
                      </div>

                      {slot.isBooked && (
                        <p className="text-[10px] text-slate-500 italic bg-white p-1.5 rounded border border-slate-100">
                          Active: <strong className="text-slate-700 font-bold">{slot.studentName}</strong>
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100/80 flex justify-between items-center">
                      {slot.isBooked ? (
                        <button 
                          onClick={() => handleCancelBooking(slot.id)}
                          className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition cursor-pointer"
                        >
                          Release Booking
                        </button>
                      ) : (
                        <button 
                          onClick={() => setSelectedSlotForBooking(slot.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-[9px] tracking-wider uppercase transition cursor-pointer"
                        >
                          Book Slot
                        </button>
                      )}

                      <button 
                        onClick={() => handleRemoveSlot(slot.id)}
                        className="p-1 text-slate-350 hover:text-rose-600 rounded transition cursor-pointer"
                        title="Delete slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slot Booking modal (inline helper) */}
              {selectedSlotForBooking && (
                <motion-div className="mb-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                  <form onSubmit={handleBookingSubmit} className="space-y-3">
                    <h4 className="text-xs font-extrabold text-indigo-900 uppercase">Book Class Simulation</h4>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        required
                        placeholder="Student / Subject detail..."
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className="bg-white block w-full px-3 py-2 border border-indigo-200 rounded-xl text-xs"
                      />
                      <button 
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 rounded-xl text-xs cursor-pointer"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </form>
                </motion-div>
              )}

              {/* Create new Slot form */}
              <form onSubmit={handleCreateCustomSlot} className="space-y-3 pt-3 border-t border-slate-150">
                <p className="text-xs font-bold text-slate-800">Add New Matrix Availability Block</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Weekday</label>
                    <select 
                      value={customDay}
                      onChange={(e) => setCustomDay(e.target.value)}
                      className="bg-white block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Time Frame</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 05:00 PM - 06:30 PM"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="bg-white block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="bg-slate-950 font-bold text-white px-4 py-2 rounded-xl text-xs hover:bg-slate-850 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Availability Block
                  </button>
                </div>
              </form>

            </div>
          </div>

          {/* Column B: Earnings & Benefits Matrix */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-sans">Payout & Earnings Simulator</h3>
                  <p className="text-xs text-slate-400">Estimate monthly cashflow with built-in escrow percentages.</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wide">Target Hourly Rate</label>
                    <span className="text-xs font-bold text-emerald-600 font-mono">${hourlyRate} USD/hr</span>
                  </div>
                  <input 
                    type="range" 
                    min="15" 
                    max="150" 
                    step="5"
                    value={hourlyRate} 
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wide">Weekly Billing Hours</label>
                    <span className="text-xs font-bold text-emerald-600 font-mono">{hoursPerWeek} Hours/week</span>
                  </div>
                  <input 
                    type="range" 
                    min="2" 
                    max="40" 
                    step="2"
                    value={hoursPerWeek} 
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wide">Platform Escrow Fee (%)</label>
                    <span className="text-xs font-bold text-slate-600 font-mono">{commissionTier}%</span>
                  </div>
                  <select
                    value={commissionTier}
                    onChange={(e) => setCommissionTier(Number(e.target.value))}
                    className="bg-white block w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value={0}>0% (Trial Launch Zero-Fee)</option>
                    <option value={3}>3% (Custom Premium Enterprise)</option>
                    <option value={5}>5% (Standard Taleem Escrow)</option>
                    <option value={8}>8% (Managed Marketing Sourced)</option>
                  </select>
                </div>
              </div>

              {/* Financial Returns Result */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                  <span className="text-slate-500">Gross Weekly Revenue:</span>
                  <span className="font-bold text-slate-800 font-mono">${financials.weekly}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                  <span className="text-slate-500">Projected Monthly Gross:</span>
                  <span className="font-bold text-slate-800 font-mono">${financials.monthlyGross}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/50 text-rose-600">
                  <span className="flex items-center gap-1">Escrow Processing Deductions ({commissionTier}%):</span>
                  <span className="font-bold font-mono">-${financials.feeAmount}</span>
                </div>
                <div className="flex justify-between items-center pt-1 text-sm">
                  <span className="font-extrabold text-slate-800">Net Monthly Earnings:</span>
                  <span className="font-black text-emerald-600 font-mono">${financials.monthlyNet}</span>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex justify-end">
                  <button
                    onClick={() => {
                      openCheckout(
                        `pri_tutor_gross_${financials.weekly}`,
                        'parent@tutorclient.com',
                        () => {
                          alert(`TUTOR TUITION SECURED\nSimulated weekly tuition payment of $${financials.weekly} collected via Paddle. Escrow processing fee applied.`);
                        }
                      );
                    }}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-[10px] tracking-wider uppercase transition-all duration-200 active:scale-95 cursor-pointer shadow-sm flex items-center justify-center gap-1"
                  >
                    Collect Tuition via Paddle Sandbox
                  </button>
                </div>
              </div>
            </div>

            {/* Private branding benefits */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-sm">
              <div className="absolute right-0 bottom-0 opacity-5">
                <Lock className="w-24 h-24" />
              </div>
              <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest mb-3">Tutor Web-App Pack</h4>
              
              <ul className="space-y-3.5 list-none pl-0 text-xs">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white block font-bold">SEO Friendly Permalinks</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">Auto-generated index paths boost organic profile reach on Google search.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white block font-bold">Automatic Invoice Engine</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">Generate structured PDF receipts immediately upon invoice confirmation.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
