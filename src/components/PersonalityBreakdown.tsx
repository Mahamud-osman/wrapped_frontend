import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PersonalityScore {
  category: string;
  percentage: number;
  description: string;
  traits: string[];
}

interface PersonalityBreakdownProps {
  personalityData: PersonalityScore[];
}

const PERSONALITY_COLORS = {
  performative: '#FF6B6B',     // Red - bold and attention-grabbing
  avant_garde: '#4ECDC4',      // Teal - creative and unique
  pandering: '#45B7D1',        // Blue - accessible and friendly
  sophisticated: '#96CEB4',     // Green - refined and elegant
  explorer: '#FFEAA7',         // Yellow - adventurous and bright
  trendsetter: '#DDA0DD'       // Purple - innovative and forward-thinking
};

const PERSONALITY_EMOJIS = {
  performative: '🎭',
  avant_garde: '🎨',
  pandering: '😊',
  sophisticated: '🎼',
  explorer: '🌍',
  trendsetter: '🚀'
};

const PERSONALITY_LABELS = {
  performative: 'Performative',
  avant_garde: 'Avant-garde',
  pandering: 'Feel-good',
  sophisticated: 'Sophisticated',
  explorer: 'Explorer',
  trendsetter: 'Trendsetter'
};

export default function PersonalityBreakdown({ personalityData }: PersonalityBreakdownProps) {
  if (!personalityData || personalityData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-green-400">Your Music Personality</h3>
        <p className="text-gray-400">No personality data available</p>
      </div>
    );
  }

  // Prepare data for pie chart
  const chartData = personalityData.map(item => ({
    name: PERSONALITY_LABELS[item.category as keyof typeof PERSONALITY_LABELS] || item.category,
    value: item.percentage,
    category: item.category,
    description: item.description,
    traits: item.traits
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; category: string; description: string } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-green-400 font-semibold">
            {PERSONALITY_EMOJIS[data.category as keyof typeof PERSONALITY_EMOJIS]} {data.name}
          </p>
          <p className="text-white">{data.value.toFixed(1)}%</p>
          <p className="text-gray-300 text-sm mt-1">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (props: { cx?: number; cy?: number; midAngle?: number; innerRadius?: number; outerRadius?: number; percent?: number }) => {
    if (!props || typeof props.percent !== 'number' || typeof props.cx !== 'number' || typeof props.cy !== 'number' || typeof props.midAngle !== 'number' || typeof props.innerRadius !== 'number' || typeof props.outerRadius !== 'number') return null;
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    if (percent < 0.05) return null; // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-2xl font-bold mb-6 text-green-400 text-center">
        🎵 Your Music Personality
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={PERSONALITY_COLORS[entry.category as keyof typeof PERSONALITY_COLORS] || '#8884d8'} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Personality Breakdown */}
        <div className="space-y-4">
          {personalityData.map((personality) => (
            <div key={personality.category} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    {PERSONALITY_EMOJIS[personality.category as keyof typeof PERSONALITY_EMOJIS]}
                  </span>
                  <h4 className="text-lg font-semibold text-white">
                    {PERSONALITY_LABELS[personality.category as keyof typeof PERSONALITY_LABELS]}
                  </h4>
                </div>
                <span className="text-green-400 font-bold text-lg">
                  {personality.percentage}%
                </span>
              </div>
              
              <p className="text-gray-300 text-sm mb-3">{personality.description}</p>
              
              <div className="flex flex-wrap gap-1">
                {personality.traits.map((trait, traitIndex) => (
                  <span 
                    key={traitIndex}
                    className="bg-gray-600 text-gray-200 px-2 py-1 rounded-full text-xs"
                  >
                    {trait}
                  </span>
                ))}
              </div>
              
              {/* Progress bar */}
              <div className="mt-3 bg-gray-600 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${personality.percentage}%`,
                    backgroundColor: PERSONALITY_COLORS[personality.category as keyof typeof PERSONALITY_COLORS]
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}