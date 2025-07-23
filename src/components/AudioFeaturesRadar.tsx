import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AudioFeaturesProps {
  audioFeatures: Record<string, number>;
}

export default function AudioFeaturesRadar({ audioFeatures }: AudioFeaturesProps) {
  if (!audioFeatures) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 text-green-400">Audio Features</h3>
        <p className="text-gray-400">No audio features data available</p>
      </div>
    );
  }

  // Convert to percentage and prepare data for radar chart
  const radarData = [
    {
      feature: 'Danceability',
      value: Math.round((audioFeatures.danceability || 0) * 100),
      fullMark: 100,
      description: 'How suitable the music is for dancing'
    },
    {
      feature: 'Energy',
      value: Math.round((audioFeatures.energy || 0) * 100),
      fullMark: 100,
      description: 'Intensity and powerful feeling'
    },
    {
      feature: 'Valence',
      value: Math.round((audioFeatures.valence || 0) * 100),
      fullMark: 100,
      description: 'Musical positivity (happiness)'
    },
    {
      feature: 'Acousticness',
      value: Math.round((audioFeatures.acousticness || 0) * 100),
      fullMark: 100,
      description: 'Whether the track is acoustic'
    },
    {
      feature: 'Liveness',
      value: Math.round((audioFeatures.liveness || 0) * 100),
      fullMark: 100,
      description: 'Presence of audience in recording'
    },
    {
      feature: 'Speechiness',
      value: Math.round((audioFeatures.speechiness || 0) * 100),
      fullMark: 100,
      description: 'Presence of spoken words'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-green-400 font-semibold">{data.feature}</p>
          <p className="text-white">{data.value}%</p>
          <p className="text-gray-300 text-sm">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  // Generate insights based on the audio features
  const generateInsights = () => {
    const insights = [];
    
    if ((audioFeatures.danceability || 0) > 0.7) {
      insights.push("🕺 Your music is highly danceable - perfect for parties!");
    } else if ((audioFeatures.danceability || 0) < 0.3) {
      insights.push("🎼 You prefer less danceable, more contemplative music");
    }
    
    if ((audioFeatures.energy || 0) > 0.7) {
      insights.push("⚡ You love high-energy, intense tracks");
    } else if ((audioFeatures.energy || 0) < 0.3) {
      insights.push("🕯️ You gravitate toward calm, peaceful music");
    }
    
    if ((audioFeatures.valence || 0) > 0.7) {
      insights.push("😊 Your music taste is very upbeat and positive");
    } else if ((audioFeatures.valence || 0) < 0.3) {
      insights.push("🖤 You appreciate melancholic or darker moods");
    }
    
    if ((audioFeatures.acousticness || 0) > 0.5) {
      insights.push("🎸 You have a preference for acoustic, organic sounds");
    }
    
    if ((audioFeatures.instrumentalness || 0) > 0.3) {
      insights.push("🎹 You enjoy instrumental music without vocals");
    }
    
    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <h3 className="text-2xl font-bold mb-6 text-green-400 text-center">
        📊 Your Audio DNA
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis 
                dataKey="feature" 
                tick={{ fill: '#D1D5DB', fontSize: 12 }}
                className="text-gray-300"
              />
              <PolarRadiusAxis 
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                tickCount={6}
                domain={[0, 100]}
              />
              <Radar
                name="Your Music"
                dataKey="value"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Feature Details & Insights */}
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">🔍 Audio Features</h4>
            <div className="grid grid-cols-2 gap-3">
              {radarData.map((feature) => (
                <div key={feature.feature} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300 text-sm">{feature.feature}</span>
                    <span className="text-green-400 font-bold">{feature.value}%</span>
                  </div>
                  <div className="bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${feature.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          {insights.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">💡 Insights</h4>
              <div className="space-y-2">
                {insights.map((insight, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-3">
                    <p className="text-gray-300 text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}