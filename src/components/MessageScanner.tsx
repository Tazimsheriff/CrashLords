import { useState } from 'react';
import { Mail, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { phishingDetector } from '../services/phishingDetector';
import type { Database } from '../lib/database.types';

interface MessageScannerProps {
  onScanComplete: () => void;
}

type DetectionRule = Database['public']['Tables']['detection_rules']['Row'];

export function MessageScanner({ onScanComplete }: MessageScannerProps) {
  const [subject, setSubject] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('Please sign in to scan messages');
        setIsScanning(false);
        return;
      }

      const { data: rules } = await supabase
        .from('detection_rules')
        .select('*')
        .eq('is_active', true);

      if (rules) {
        phishingDetector.setRules(rules as DetectionRule[]);
      }

      const analysis = phishingDetector.analyzeMessage(
        subject,
        senderEmail,
        senderName,
        messageContent
      );

      const links = phishingDetector.analyzeLinks(messageContent);

      const { data: messageData, error: messageError } = await supabase
        .from('scanned_messages')
        .insert({
          user_id: user.id,
          subject,
          sender_email: senderEmail,
          sender_name: senderName,
          message_content: messageContent,
          risk_score: analysis.riskScore,
          is_phishing: analysis.isPhishing,
          detection_reasons: analysis.reasons
        })
        .select()
        .single();

      if (messageError) throw messageError;

      if (links.length > 0 && messageData) {
        const linkInserts = links.map(link => ({
          message_id: messageData.id,
          url: link.url,
          display_text: link.displayText,
          is_suspicious: link.isSuspicious,
          risk_factors: link.riskFactors
        }));

        const { error: linksError } = await supabase
          .from('analyzed_links')
          .insert(linkInserts);

        if (linksError) throw linksError;
      }

      const { data: reputation } = await supabase
        .from('sender_reputation')
        .select('*')
        .eq('email_address', senderEmail)
        .maybeSingle();

      if (reputation) {
        await supabase
          .from('sender_reputation')
          .update({
            total_messages: reputation.total_messages + 1,
            phishing_count: reputation.phishing_count + (analysis.isPhishing ? 1 : 0),
            trust_score: Math.max(0, reputation.trust_score - (analysis.isPhishing ? 10 : -2)),
            last_seen: new Date().toISOString()
          })
          .eq('email_address', senderEmail);
      } else {
        await supabase
          .from('sender_reputation')
          .insert({
            email_address: senderEmail,
            total_messages: 1,
            phishing_count: analysis.isPhishing ? 1 : 0,
            trust_score: analysis.isPhishing ? 20 : 50
          });
      }

      setSubject('');
      setSenderEmail('');
      setSenderName('');
      setMessageContent('');
      onScanComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while scanning');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Scan Message</h2>
      </div>

      <form onSubmit={handleScan} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject Line
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter email subject"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Sender Email *
            </label>
            <input
              type="email"
              id="senderEmail"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="sender@example.com"
            />
          </div>

          <div>
            <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
              Sender Name
            </label>
            <input
              type="text"
              id="senderName"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Message Content *
          </label>
          <textarea
            id="content"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            required
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Paste the full message content here..."
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isScanning}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Scan Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
