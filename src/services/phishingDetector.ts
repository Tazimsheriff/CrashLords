export interface DetectionResult {
  riskScore: number;
  isPhishing: boolean;
  reasons: string[];
}

export interface LinkAnalysis {
  url: string;
  displayText: string;
  isSuspicious: boolean;
  riskFactors: string[];
}

export class PhishingDetector {
  private detectionRules: Array<{
    rule_name: string;
    rule_type: string;
    pattern: string;
    severity: string;
    is_active: boolean;
  }> = [];

  setRules(rules: typeof this.detectionRules) {
    this.detectionRules = rules.filter(rule => rule.is_active);
  }

  analyzeMessage(
    subject: string,
    senderEmail: string,
    senderName: string,
    content: string
  ): DetectionResult {
    const reasons: string[] = [];
    let riskScore = 0;

    const fullText = `${subject} ${content}`.toLowerCase();

    this.detectionRules
      .filter(rule => rule.rule_type === 'keyword' || rule.rule_type === 'behavior')
      .forEach(rule => {
        const regex = new RegExp(rule.pattern, 'i');
        if (regex.test(fullText)) {
          const points = this.getSeverityPoints(rule.severity);
          riskScore += points;
          reasons.push(`${rule.rule_name} detected`);
        }
      });

    if (this.isSuspiciousSender(senderEmail, senderName)) {
      riskScore += 15;
      reasons.push('Suspicious sender information');
    }

    if (this.hasUrgentLanguage(fullText)) {
      riskScore += 10;
      reasons.push('Contains urgent language');
    }

    if (this.hasSuspiciousFormatting(content)) {
      riskScore += 8;
      reasons.push('Suspicious formatting detected');
    }

    if (this.hasSpellingErrors(fullText)) {
      riskScore += 5;
      reasons.push('Multiple spelling errors detected');
    }

    riskScore = Math.min(riskScore, 100);

    return {
      riskScore,
      isPhishing: riskScore >= 50,
      reasons
    };
  }

  analyzeLinks(content: string): LinkAnalysis[] {
    const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>|https?:\/\/[^\s<]+/gi;
    const links: LinkAnalysis[] = [];
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[1] || match[0];
      const displayText = match[2] || match[0];

      const analysis = this.analyzeSingleLink(url, displayText);
      links.push(analysis);
    }

    return links;
  }

  private analyzeSingleLink(url: string, displayText: string): LinkAnalysis {
    const riskFactors: string[] = [];
    let isSuspicious = false;

    try {
      const urlObj = new URL(url);
      const displayUrlObj = displayText.includes('http') ? new URL(displayText) : null;

      if (displayUrlObj && urlObj.hostname !== displayUrlObj.hostname) {
        riskFactors.push('URL mismatch: displayed URL differs from actual destination');
        isSuspicious = true;
      }

      if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(urlObj.hostname)) {
        riskFactors.push('URL uses IP address instead of domain name');
        isSuspicious = true;
      }

      const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co'];
      if (suspiciousDomains.some(domain => urlObj.hostname.includes(domain))) {
        riskFactors.push('Shortened URL detected');
        isSuspicious = true;
      }

      if (urlObj.hostname.split('.').length > 4) {
        riskFactors.push('Excessive subdomain levels');
        isSuspicious = true;
      }

      if (/@/.test(urlObj.href)) {
        riskFactors.push('URL contains @ symbol (possible redirection)');
        isSuspicious = true;
      }

      const commonBrands = ['paypal', 'amazon', 'microsoft', 'apple', 'google', 'facebook', 'bank'];
      commonBrands.forEach(brand => {
        if (urlObj.hostname.includes(brand) && !urlObj.hostname.endsWith(`${brand}.com`)) {
          riskFactors.push(`Suspicious use of brand name "${brand}" in domain`);
          isSuspicious = true;
        }
      });

      if (urlObj.protocol === 'http:') {
        riskFactors.push('Insecure HTTP connection (not HTTPS)');
      }

    } catch (e) {
      riskFactors.push('Invalid or malformed URL');
      isSuspicious = true;
    }

    return {
      url,
      displayText,
      isSuspicious,
      riskFactors
    };
  }

  private isSuspiciousSender(email: string, name: string): boolean {
    const emailLower = email.toLowerCase();
    const nameLower = name.toLowerCase();

    if (emailLower.includes('noreply') && nameLower.includes('support')) {
      return true;
    }

    const freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const fromFreeDomain = freeDomains.some(domain => emailLower.endsWith(domain));
    const claimsCorporate = /bank|paypal|amazon|microsoft|apple|support|service/i.test(nameLower);

    if (fromFreeDomain && claimsCorporate) {
      return true;
    }

    return false;
  }

  private hasUrgentLanguage(text: string): boolean {
    const urgentPhrases = [
      'act now',
      'immediate action',
      'within 24 hours',
      'account will be closed',
      'suspended',
      'verify immediately'
    ];

    return urgentPhrases.some(phrase => text.includes(phrase));
  }

  private hasSuspiciousFormatting(content: string): boolean {
    const hiddenTextPattern = /<span[^>]*style="[^"]*display:\s*none[^"]*"[^>]*>/i;
    const tinyTextPattern = /<span[^>]*style="[^"]*font-size:\s*[0-2]px[^"]*"[^>]*>/i;

    return hiddenTextPattern.test(content) || tinyTextPattern.test(content);
  }

  private hasSpellingErrors(text: string): boolean {
    const commonMisspellings = [
      'paypa1',
      'amaz0n',
      'micros0ft',
      'g00gle',
      'verfy',
      'acccount',
      'susppended',
      'secuirty'
    ];

    return commonMisspellings.filter(word => text.includes(word)).length >= 2;
  }

  private getSeverityPoints(severity: string): number {
    switch (severity) {
      case 'critical':
        return 30;
      case 'high':
        return 20;
      case 'medium':
        return 10;
      case 'low':
        return 5;
      default:
        return 5;
    }
  }

  analyzeSenderReputation(
    totalMessages: number,
    phishingCount: number,
    trustScore: number
  ): { isRisky: boolean; warning: string } {
    if (totalMessages === 0) {
      return {
        isRisky: true,
        warning: 'New sender - no history available'
      };
    }

    const phishingRate = phishingCount / totalMessages;

    if (phishingRate > 0.5) {
      return {
        isRisky: true,
        warning: 'High phishing rate from this sender'
      };
    }

    if (trustScore < 30) {
      return {
        isRisky: true,
        warning: 'Low trust score'
      };
    }

    if (trustScore > 70) {
      return {
        isRisky: false,
        warning: 'Trusted sender'
      };
    }

    return {
      isRisky: false,
      warning: 'Moderate trust level'
    };
  }
}

export const phishingDetector = new PhishingDetector();
