import { useEffect, useState } from 'react';
import { History, AlertTriangle, Shield, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type ScannedMessage = Database['public']['Tables']['scanned_messages']['Row'];
type AnalyzedLink = Database['public']['Tables']['analyzed_links']['Row'];

interface ScanHistoryProps {
  refreshTrigger: number;
}

export function ScanHistory({ refreshTrigger }: ScanHistoryProps) {
  const [messages, setMessages] = useState<ScannedMessage[]>([]);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [messageLinks, setMessageLinks] = useState<Record<string, AnalyzedLink[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [refreshTrigger]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('scanned_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLinks = async (messageId: string) => {
    if (messageLinks[messageId]) return;

    try {
      const { data, error } = await supabase
        .from('analyzed_links')
        .select('*')
        .eq('message_id', messageId);

      if (error) throw error;

      setMessageLinks(prev => ({
        ...prev,
        [messageId]: data || []
      }));
    } catch (err) {
      console.error('Error loading links:', err);
    }
  };

  const toggleExpand = (messageId: string) => {
    if (expandedMessage === messageId) {
      setExpandedMessage(null);
    } else {
      setExpandedMessage(messageId);
      loadLinks(messageId);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (score >= 25) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 75) return 'Critical Risk';
    if (score >= 50) return 'High Risk';
    if (score >= 25) return 'Medium Risk';
    return 'Low Risk';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Scan History</h2>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No scanned messages yet. Start by scanning a message above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const reasons = message.detection_reasons as string[];
            const isExpanded = expandedMessage === message.id;
            const links = messageLinks[message.id] || [];

            return (
              <div
                key={message.id}
                className={`border rounded-lg overflow-hidden transition-all ${
                  message.is_phishing ? 'border-red-200' : 'border-gray-200'
                }`}
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpand(message.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {message.is_phishing ? (
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        ) : (
                          <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                        )}
                        <h3 className="font-semibold text-gray-800 truncate">
                          {message.subject || '(No Subject)'}
                        </h3>
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">From:</span> {message.sender_name}{' '}
                        <span className="text-gray-400">&lt;{message.sender_email}&gt;</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>
                          {new Date(message.created_at).toLocaleDateString()} at{' '}
                          {new Date(message.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getRiskColor(message.risk_score)}`}>
                        {message.risk_score}% - {getRiskLabel(message.risk_score)}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
                    {reasons.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Detection Reasons
                        </h4>
                        <ul className="space-y-1">
                          {reasons.map((reason, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-red-500 mt-1">•</span>
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {links.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Analyzed Links ({links.length})
                        </h4>
                        <div className="space-y-2">
                          {links.map((link) => {
                            const factors = link.risk_factors as string[];
                            return (
                              <div
                                key={link.id}
                                className={`p-3 rounded border ${
                                  link.is_suspicious
                                    ? 'bg-red-50 border-red-200'
                                    : 'bg-white border-gray-200'
                                }`}
                              >
                                <div className="flex items-start gap-2 mb-1">
                                  {link.is_suspicious && (
                                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-mono text-gray-800 truncate">
                                      {link.url}
                                    </p>
                                    {link.display_text && link.display_text !== link.url && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Display: {link.display_text}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {factors.length > 0 && (
                                  <ul className="mt-2 space-y-1">
                                    {factors.map((factor, idx) => (
                                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                                        <span className="text-orange-500">▸</span>
                                        <span>{factor}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Message Content</h4>
                      <div className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-700 max-h-48 overflow-y-auto whitespace-pre-wrap">
                        {message.message_content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
