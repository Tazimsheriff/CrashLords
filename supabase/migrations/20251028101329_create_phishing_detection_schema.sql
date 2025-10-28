/*
  # Phishing Detection System Schema

  ## Overview
  This migration creates the database schema for an AI-based phishing detection system
  that analyzes emails, messages, and links to detect potential phishing attempts.

  ## New Tables

  ### 1. `scanned_messages`
  Stores all messages that have been analyzed for phishing attempts.
  - `id` (uuid, primary key) - Unique identifier for each scanned message
  - `user_id` (uuid) - Reference to the user who submitted the message
  - `subject` (text) - Email/message subject line
  - `sender_email` (text) - Sender's email address
  - `sender_name` (text) - Sender's display name
  - `message_content` (text) - Full message content
  - `risk_score` (integer) - Overall risk score (0-100)
  - `is_phishing` (boolean) - Whether message is classified as phishing
  - `detection_reasons` (jsonb) - Array of reasons why message was flagged
  - `created_at` (timestamptz) - When the message was scanned

  ### 2. `analyzed_links`
  Stores individual links extracted from messages with their analysis results.
  - `id` (uuid, primary key) - Unique identifier for each link
  - `message_id` (uuid) - Reference to the scanned message
  - `url` (text) - The actual URL found in the message
  - `display_text` (text) - Text shown to user (may differ from actual URL)
  - `is_suspicious` (boolean) - Whether link is deemed suspicious
  - `risk_factors` (jsonb) - Specific risk factors identified
  - `created_at` (timestamptz) - When the link was analyzed

  ### 3. `sender_reputation`
  Tracks sender reputation over time based on historical analysis.
  - `id` (uuid, primary key) - Unique identifier
  - `email_address` (text, unique) - Sender's email address
  - `total_messages` (integer) - Total messages analyzed from this sender
  - `phishing_count` (integer) - Number of phishing attempts detected
  - `trust_score` (integer) - Calculated trust score (0-100)
  - `last_seen` (timestamptz) - Last time a message from this sender was analyzed
  - `created_at` (timestamptz) - First time sender was seen

  ### 4. `detection_rules`
  Stores customizable detection rules and patterns.
  - `id` (uuid, primary key) - Unique identifier
  - `rule_name` (text) - Name of the detection rule
  - `rule_type` (text) - Type: 'keyword', 'pattern', 'behavior', 'link'
  - `pattern` (text) - The pattern or keyword to match
  - `severity` (text) - Severity level: 'low', 'medium', 'high', 'critical'
  - `is_active` (boolean) - Whether rule is currently active
  - `created_at` (timestamptz) - When rule was created

  ## Security
  - RLS enabled on all tables
  - Authenticated users can only access their own scanned messages
  - Users can view all sender reputation data (read-only)
  - Users can view all detection rules
  - Only authenticated users can create new scans

  ## Important Notes
  1. All tables use RLS with restrictive policies
  2. Default values ensure data integrity
  3. JSONB fields allow flexible storage of analysis results
  4. Indexes on frequently queried fields for performance
*/

-- Create scanned_messages table
CREATE TABLE IF NOT EXISTS scanned_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject text DEFAULT '',
  sender_email text NOT NULL,
  sender_name text DEFAULT '',
  message_content text NOT NULL,
  risk_score integer DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  is_phishing boolean DEFAULT false,
  detection_reasons jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create analyzed_links table
CREATE TABLE IF NOT EXISTS analyzed_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES scanned_messages(id) ON DELETE CASCADE,
  url text NOT NULL,
  display_text text DEFAULT '',
  is_suspicious boolean DEFAULT false,
  risk_factors jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create sender_reputation table
CREATE TABLE IF NOT EXISTS sender_reputation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_address text UNIQUE NOT NULL,
  total_messages integer DEFAULT 0,
  phishing_count integer DEFAULT 0,
  trust_score integer DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create detection_rules table
CREATE TABLE IF NOT EXISTS detection_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name text NOT NULL,
  rule_type text NOT NULL CHECK (rule_type IN ('keyword', 'pattern', 'behavior', 'link')),
  pattern text NOT NULL,
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scanned_messages_user_id ON scanned_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_scanned_messages_created_at ON scanned_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scanned_messages_is_phishing ON scanned_messages(is_phishing);
CREATE INDEX IF NOT EXISTS idx_analyzed_links_message_id ON analyzed_links(message_id);
CREATE INDEX IF NOT EXISTS idx_sender_reputation_email ON sender_reputation(email_address);

-- Enable Row Level Security
ALTER TABLE scanned_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyzed_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE sender_reputation ENABLE ROW LEVEL SECURITY;
ALTER TABLE detection_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scanned_messages
CREATE POLICY "Users can view own scanned messages"
  ON scanned_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scanned messages"
  ON scanned_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scanned messages"
  ON scanned_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scanned messages"
  ON scanned_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for analyzed_links
CREATE POLICY "Users can view links from own messages"
  ON analyzed_links FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scanned_messages
      WHERE scanned_messages.id = analyzed_links.message_id
      AND scanned_messages.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert links for own messages"
  ON analyzed_links FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scanned_messages
      WHERE scanned_messages.id = analyzed_links.message_id
      AND scanned_messages.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update links from own messages"
  ON analyzed_links FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scanned_messages
      WHERE scanned_messages.id = analyzed_links.message_id
      AND scanned_messages.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scanned_messages
      WHERE scanned_messages.id = analyzed_links.message_id
      AND scanned_messages.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete links from own messages"
  ON analyzed_links FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scanned_messages
      WHERE scanned_messages.id = analyzed_links.message_id
      AND scanned_messages.user_id = auth.uid()
    )
  );

-- RLS Policies for sender_reputation (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view sender reputation"
  ON sender_reputation FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for detection_rules (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view detection rules"
  ON detection_rules FOR SELECT
  TO authenticated
  USING (true);

-- Insert default detection rules
INSERT INTO detection_rules (rule_name, rule_type, pattern, severity) VALUES
  ('Urgent Action Required', 'keyword', 'urgent|immediate|action required|act now', 'high'),
  ('Account Verification', 'keyword', 'verify your account|confirm your identity|update your information', 'high'),
  ('Suspicious Links', 'link', 'bit.ly|tinyurl|shortened url', 'medium'),
  ('Prize/Lottery Scam', 'keyword', 'you won|congratulations|prize|lottery|claim now', 'critical'),
  ('Password Reset', 'keyword', 'reset your password|password expired|security alert', 'high'),
  ('Invoice/Payment', 'keyword', 'invoice attached|payment required|overdue|suspended', 'high'),
  ('Generic Greeting', 'behavior', 'dear customer|dear user|dear member', 'medium'),
  ('Suspicious Attachments', 'pattern', '\\.(exe|zip|rar|scr|bat)$', 'critical'),
  ('IP Address in URL', 'link', '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}', 'high'),
  ('Mismatched Domain', 'link', 'display text domain differs from actual url', 'critical')
ON CONFLICT DO NOTHING;