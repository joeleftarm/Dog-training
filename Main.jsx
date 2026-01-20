import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  CheckCircle, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Dog, 
  Home, 
  Activity, 
  AlertTriangle,
  Footprints,
  Bell
} from 'lucide-react';

// --- Data Structure for the Syllabus ---

const trainingModules = [
  {
    id: 'foundation',
    title: 'Pre-Season: The Basics',
    icon: <Trophy className="w-6 h-6 text-yellow-500" />,
    description: 'Building the fitness and focus before the big games.',
    drills: [
      {
        id: 'eye_contact',
        title: 'The Captain\'s Watch (Eye Contact)',
        desc: 'Teaching Ali that looking at you yields better results than staring at the opposition.',
        steps: [
          'Stand still in a boring room.',
          'Wait for Ali to voluntarily look at your eyes.',
          'Mark (say "Yes!" or click) and reward immediately.',
          'Repeat 10-15 times per session.',
          'Progression: Add distractions (the crowd noise).'
        ],
        tips: 'Do not ask for it. Wait for it. This builds voluntary focus.',
        completed: false
      },
      {
        id: 'touch',
        title: 'Hand Targeting (The Assist)',
        desc: 'Ali touches her nose to your hand. Useful for redirecting her quickly.',
        steps: [
          'Hold out your hand flat, close to her nose.',
          'When she sniffs it, mark and treat.',
          'Add the word "Touch" just before she moves.',
          'Practice moving your hand to different positions.'
        ],
        tips: 'Great for moving her around without grabbing the collar.',
        completed: false
      }
    ]
  },
  {
    id: 'lead_work',
    title: 'Ball Control: Lead Work',
    icon: <Footprints className="w-6 h-6 text-blue-500" />,
    description: 'Dribbling down the wing without committing a foul (pulling).',
    drills: [
      {
        id: 'loose_leash',
        title: 'Close Control (Loose Leash)',
        desc: 'Walking without tension on the lead.',
        steps: [
          'Start in the house or garden (low distraction).',
          'If the lead goes tight, you stop immediately (The Referee blows the whistle).',
          'Wait for Ali to create slack (step back or look at you).',
          'Mark and move forward again.',
          'Reward heavily for walking by your side (The Sweet Spot).'
        ],
        tips: 'Consistency is key. Never move forward if the lead is tight.',
        completed: false
      },
      {
        id: 'u_turn',
        title: 'The Cruyff Turn (Emergency U-Turn)',
        desc: 'A rapid change of direction to avoid trouble.',
        steps: [
          'Walk forward, then suddenly say "This Way!" cheerfully.',
          'Turn 180 degrees and run a few steps.',
          'When Ali catches up, big reward.',
          'Practice until the turn is instant.'
        ],
        tips: 'Use this when you see a trigger (another dog) before Ali reacts.',
        completed: false
      }
    ]
  },
  {
    id: 'reactivity',
    title: 'Zone Defense: Reactivity',
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    description: 'Dealing with opposition players (dogs/people) without losing your head.',
    drills: [
      {
        id: 'engage_disengage',
        title: 'The Check-In (Engage/Disengage)',
        desc: 'Teaching Ali that spotting a dog means she should look at you for payment.',
        steps: [
          'Find a distance where Ali sees a dog but isn\'t barking (The Sub Bench).',
          'When she looks at the dog, Mark ("Yes!").',
          'When she turns back to you for the treat, give it.',
          'Goal: She sees a dog and automatically looks at you.',
        ],
        tips: 'If she reacts/barks, you are too close (Offside). Increase distance.',
        completed: false
      },
      {
        id: 'find_it',
        title: 'Scatter Ball (Find It)',
        desc: 'Emergency distraction when caught off guard.',
        steps: [
          'Say "Find it!" excitedly.',
          'Throw a handful of treats on the floor immediately in front of her.',
          'Her nose goes down, eyes go off the trigger.',
        ],
        tips: 'Use this to manage difficult passing situations.',
        completed: false
      }
    ]
  },
  {
    id: 'door_manners',
    title: 'The Goalkeeper: Door Manners',
    icon: <Home className="w-6 h-6 text-green-600" />,
    description: 'Stopping the attack at the goal line (the front door).',
    drills: [
      {
        id: 'place',
        title: 'Go to Goal (Place Command)',
        desc: 'Sending Ali to a specific bed/mat when the bell rings.',
        steps: [
          'Lure Ali to her bed. Mark and treat.',
          'Add cue "Place" or "Bed".',
          'Build duration: Treat for staying on the bed.',
          'Add distance: Send her from across the room.',
        ],
        tips: 'The bed must be a high-value zone. Jackpots happen there.',
        completed: false
      },
      {
        id: 'bell_desens',
        title: 'Simulation Training (Bell Noise)',
        desc: 'Removing the emotional trigger of the doorbell.',
        steps: [
          'Record your doorbell sound on your phone.',
          'Play it at low volume. If calm, treat.',
          'Gradually increase volume over days.',
          'Eventually practice with the real door (no guest outside).',
        ],
        tips: 'Do this when nothing is actually happening.',
        completed: false
      }
    ]
  },
  {
    id: 'recall',
    title: 'The Long Ball: Recall',
    icon: <Activity className="w-6 h-6 text-purple-500" />,
    description: 'Getting Ali back to position quickly.',
    drills: [
      {
        id: 'whistle',
        title: 'The Final Whistle (Emergency Recall)',
        desc: 'A non-verbal cue that always means "Jackpot".',
        steps: [
          'Blow whistle -> Feed huge reward (chicken/cheese).',
          'Do not call her yet. Just pair sound with food.',
          'Practice indoors first, then garden.',
          'Only use outside when you are 90% sure she will come.',
        ],
        tips: 'Never use the whistle to tell her off or end the fun.',
        completed: false
      }
    ]
  }
];

// --- Components ---

const ProgressBar = ({ value, max }) => {
  const percentage = Math.round((value / max) * 100);
  
  let colorClass = "bg-red-500";
  if (percentage > 30) colorClass = "bg-yellow-500";
  if (percentage > 70) colorClass = "bg-green-500";

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
      <div 
        className={`${colorClass} h-4 rounded-full transition-all duration-500 ease-in-out`} 
        style={{ width: `${percentage}%` }}
      ></div>
      <div className="text-right text-xs text-gray-500 mt-1">{percentage}% Match Fitness</div>
    </div>
  );
};

const DrillCard = ({ drill, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border rounded-lg mb-3 overflow-hidden ${drill.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggle(drill.id);
            }}
            className={`p-1 rounded-full ${drill.completed ? 'text-green-600' : 'text-gray-300 hover:text-gray-400'}`}
          >
            {drill.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
          </button>
          <div>
            <h4 className={`font-bold ${drill.completed ? 'text-green-800' : 'text-gray-800'}`}>
              {drill.title}
            </h4>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </div>

      {isOpen && (
        <div className="px-4 pb-4 pt-0 text-sm text-gray-600 bg-gray-50 border-t border-gray-100">
          <div className="mt-3">
            <p className="italic mb-2 text-gray-700 font-medium">{drill.desc}</p>
            <div className="bg-white p-3 rounded border border-gray-200">
              <strong className="block mb-2 text-blue-800 uppercase text-xs tracking-wider">Tactical Plan:</strong>
              <ul className="list-disc pl-5 space-y-1">
                {drill.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3 flex items-start gap-2 text-amber-700 bg-amber-50 p-2 rounded">
              <Activity className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span><strong>Coach's Tip:</strong> {drill.tips}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ModuleSection = ({ module, toggleDrill }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div 
        className="bg-slate-50 p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {module.icon}
          <div>
            <h3 className="text-lg font-bold text-slate-800">{module.title}</h3>
            <p className="text-xs text-slate-500">{module.description}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </div>
      
      {expanded && (
        <div className="p-4 bg-slate-100/50">
          {module.drills.map(drill => (
            <DrillCard 
              key={drill.id} 
              drill={drill} 
              onToggle={toggleDrill} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function AliTrainingApp() {
  // Initialize state from localStorage or default
  const [modules, setModules] = useState(() => {
    const saved = localStorage.getItem('aliTrainingData');
    return saved ? JSON.parse(saved) : trainingModules;
  });

  // Calculate stats
  const totalDrills = modules.reduce((acc, mod) => acc + mod.drills.length, 0);
  const completedDrills = modules.reduce((acc, mod) => acc + mod.drills.filter(d => d.completed).length, 0);

  // Persistence
  useEffect(() => {
    localStorage.setItem('aliTrainingData', JSON.stringify(modules));
  }, [modules]);

  const toggleDrill = (drillId) => {
    setModules(prevModules => 
      prevModules.map(mod => ({
        ...mod,
        drills: mod.drills.map(drill => 
          drill.id === drillId ? { ...drill, completed: !drill.completed } : drill
        )
      }))
    );
  };

  const resetProgress = () => {
    if(window.confirm("Are you sure you want to clear the season stats?")) {
        setModules(trainingModules);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      
      {/* Header */}
      <header className="bg-blue-900 text-white p-6 shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-full">
              <Dog className="w-6 h-6 text-blue-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Ali's Training Camp</h1>
              <p className="text-blue-200 text-sm">Season 2025/2026</p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
             <div className="text-xs font-bold uppercase tracking-widest text-blue-300">Head Coach</div>
             <div className="text-sm">Daddy</div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-6">
        
        {/* Dashboard / Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-lg font-bold text-gray-800">Season Stats</h2>
            <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {completedDrills} / {totalDrills} Drills
            </span>
          </div>
          <ProgressBar value={completedDrills} max={totalDrills} />
          
          <div className="grid grid-cols-2 gap-4 mt-4 text-center">
            <div className="bg-blue-50 p-3 rounded border border-blue-100">
              <div className="text-2xl font-bold text-blue-700">
                {Math.round((completedDrills / totalDrills) * 100) || 0}%
              </div>
              <div className="text-xs text-blue-900 uppercase font-bold">Completion Rate</div>
            </div>
             <div className="bg-green-50 p-3 rounded border border-green-100">
              <div className="text-2xl font-bold text-green-700">
                {totalDrills - completedDrills}
              </div>
              <div className="text-xs text-green-900 uppercase font-bold">Drills Remaining</div>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-2">
          {modules.map(module => (
            <ModuleSection 
              key={module.id} 
              module={module} 
              toggleDrill={toggleDrill} 
            />
          ))}
        </div>

        {/* Footer actions */}
        <div className="mt-10 text-center">
            <button 
                onClick={resetProgress}
                className="text-xs text-red-400 hover:text-red-600 underline"
            >
                Reset Season Stats
            </button>
        </div>

      </main>
    </div>
  );
}


