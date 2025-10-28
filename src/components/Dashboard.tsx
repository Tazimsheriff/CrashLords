import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, TrendingUp, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalScans: number;
  phishingDetected: number;
  averageRiskScore: number;
  recentScans: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 0,
    phishingDetected: 0,
    averageRiskScore: 0,
    recentScans: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data: messages, error } = await supabase
        .from('scanned_messages')
        .select('risk_score, is_phishing, created_at');

      if (error) throw error;

      if (messages) {
        const totalScans = messages.length;
        const phishingDetected = messages.filter(m => m.is_phishing).length;
        const averageRiskScore = totalScans > 0
          ? Math.round(messages.reduce((sum, m) => sum + m.risk_score, 0) / totalScans)
          : 0;

        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const recentScans = messages.filter(
          m => new Date(m.created_at) > oneDayAgo
        ).length;

        setStats({
          totalScans,
          phishingDetected,
          averageRiskScore,
          recentScans
        });
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: Mail,
      label: 'Total Scans',
      value: stats.totalScans,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: AlertTriangle,
      label: 'Phishing Detected',
      value: stats.phishingDetected,
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: TrendingUp,
      label: 'Average Risk Score',
      value: `${stats.averageRiskScore}%`,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Shield,
      label: 'Last 24 Hours',
      value: stats.recentScans,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className={`${card.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
            <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{card.value}</div>
          <div className="text-sm text-gray-600">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
