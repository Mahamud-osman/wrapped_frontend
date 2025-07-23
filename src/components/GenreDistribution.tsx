import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Genre {
  genre: string;
  count: number;
}

interface GenreDistributionProps {
  genres: Genre[];
}

const GENRE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
  '#DDA0DD', '#FFB347', '#87CEEB', '#98FB98', '#F0E68C'
];

export default function GenreDistribution({ genres }: GenreDistributionProps) {
  if (!genres || genres.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-green-400">Genre Distribution</h3>
        <p className="text-gray-400">No genre data available</p>
      </div>
    );
  }

  // Take top 8 genres for better visualization
  const topGenres = genres.slice(0, 8);
  const otherCount = genres.slice(8).reduce((sum, genre) => sum + genre.count, 0);
  
  const baseChartData = [...topGenres];
  const chartData = otherCount > 0 
    ? [...baseChartData, { genre: 'Others', count: otherCount }]
    : baseChartData;

  // Calculate total for percentages
  const total = chartData.reduce((sum, item) => sum + item.count, 0);
  
  // Add percentages to data
  const dataWithPercentages = chartData.map(item => ({
    ...item,
    percentage: ((item.count / total) * 100).toFixed(1)
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { genre: string; count: number; percentage: string } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-green-400 font-semibold capitalize">{data.genre}</p>
          <p className="text-white">{data.count} artists</p>
          <p className="text-gray-300">{data.percentage}%</p>
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

  // Generate genre insights
  const generateGenreInsights = () => {
    const insights = [];
    const topGenre = genres[0];
    
    if (topGenre) {
      insights.push(`🎵 Your top genre is ${topGenre.genre} with ${topGenre.count} artists`);
    }
    
    if (genres.length >= 5) {
      insights.push(`🌈 You have diverse taste with ${genres.length} different genres`);
    } else if (genres.length <= 3) {
      insights.push(`🎯 You have focused taste with ${genres.length} main genres`);
    }
    
    // Check for specific genre patterns
    const genreNames = genres.map(g => g.genre.toLowerCase());
    if (genreNames.some(g => g.includes('pop'))) {
      insights.push(`📻 You enjoy mainstream pop music`);
    }
    if (genreNames.some(g => g.includes('rock'))) {
      insights.push(`🎸 Rock music is part of your identity`);
    }
    if (genreNames.some(g => g.includes('jazz'))) {
      insights.push(`🎺 You appreciate the sophistication of jazz`);
    }
    if (genreNames.some(g => g.includes('electronic') || g.includes('edm'))) {
      insights.push(`🎹 Electronic beats energize your playlist`);
    }
    
    return insights;
  };

  const insights = generateGenreInsights();

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-2xl font-bold mb-6 text-green-400 text-center">
        🎭 Your Genre Universe
      </h3>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="xl:col-span-1">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataWithPercentages}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {dataWithPercentages.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={GENRE_COLORS[index % GENRE_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Genre List */}
        <div className="xl:col-span-1">
          <h4 className="text-lg font-semibold text-white mb-4">🏆 Top Genres</h4>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {dataWithPercentages.map((genre, index) => (
              <div key={genre.genre} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: GENRE_COLORS[index % GENRE_COLORS.length] }}
                  />
                  <span className="text-white capitalize font-medium">{genre.genre}</span>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">{genre.count}</div>
                  <div className="text-gray-400 text-sm">{genre.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="xl:col-span-1">
          <h4 className="text-lg font-semibold text-white mb-4">💡 Genre Insights</h4>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-3">
                <p className="text-gray-300 text-sm">{insight}</p>
              </div>
            ))}
          </div>
          
          {/* Genre Stats */}
          <div className="mt-4 bg-gray-700 rounded-lg p-4">
            <h5 className="text-white font-semibold mb-2">📈 Quick Stats</h5>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Total Genres:</span>
                <span className="text-green-400 ml-2 font-bold">{genres.length}</span>
              </div>
              <div>
                <span className="text-gray-400">Total Artists:</span>
                <span className="text-green-400 ml-2 font-bold">{total}</span>
              </div>
              <div>
                <span className="text-gray-400">Most Popular:</span>
                <span className="text-green-400 ml-2 font-bold capitalize">{genres[0]?.genre}</span>
              </div>
              <div>
                <span className="text-gray-400">Diversity Score:</span>
                <span className="text-green-400 ml-2 font-bold">
                  {genres.length >= 8 ? 'High' : genres.length >= 4 ? 'Medium' : 'Low'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}