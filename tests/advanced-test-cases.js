#!/usr/bin/env node

/**
 * Advanced Test Cases for ContentGuard
 * 
 * More sophisticated and challenging test scenarios to push the system to its limits.
 */

module.exports = {
  // Edge cases that might confuse the system
  sophisticatedLegitimate: [
    {
      category: 'Advanced Academic',
      name: 'Dr. Elena Rodriguez',
      email: 'erodriguez@stanford.edu',
      subject: 'Critical Failure Analysis in High-Stress Engineering Systems',
      message: 'Our research involves critical failure point analysis where we deliberately kill processes to test system resilience. The stress-strain ratio calculations show critical thresholds where catastrophic failure occurs. This urgent research has implications for aerospace safety protocols.',
      expected: false,
      description: 'Academic research with multiple trigger words in legitimate context'
    },
    {
      category: 'Medical Emergency Protocol',
      name: 'Dr. Sarah Chen, MD',
      email: 'schen@emergencymedicine.org',
      subject: 'Code Blue Response Protocol - Critical Patient Management',
      message: 'Updated protocol for critical patient scenarios: When dealing with life-threatening situations, medication concentration ratios must be calculated precisely. The kill switch for automated systems should only be activated in extreme circumstances. Urgent training required for all staff.',
      expected: false,
      description: 'Medical emergency protocol with technical and urgent language'
    },
    {
      category: 'Financial Analysis Complex',
      name: 'Investment Analyst',
      email: 'analyst@goldmansachs.com',
      subject: 'Critical Market Analysis - Urgent Action Required',
      message: 'Market volatility ratios indicate critical instability. Debt-to-equity calculations show potential for catastrophic portfolio failure. Risk assessment protocols suggest urgent liquidation of high-risk positions. Kill orders may be necessary to prevent massive losses.',
      expected: false,
      description: 'Financial analysis with crisis language and technical terms'
    },
    {
      category: 'Legal Case Complex',
      name: 'Attorney Johnson',
      email: 'johnson@lawfirm.com',
      subject: 'Case 2024-456: Critical Evidence Analysis',
      message: 'Evidence ratio analysis reveals critical inconsistencies. The opposition's case shows multiple failure points. We need urgent action to kill their primary arguments. Risk assessment suggests catastrophic damage if we don't act immediately.',
      expected: false,
      description: 'Legal analysis using aggressive but professional language'
    },
    {
      category: 'Gaming Industry Professional',
      name: 'Game Director',
      email: 'director@riotgames.com',
      subject: 'Player Experience Critical Issues',
      message: 'Player feedback indicates our current balance is trash and needs immediate attention. The damage ratios are making players rage quit. We need to kill the current meta and implement urgent hotfixes. The community is calling us noobs.',
      expected: false,
      description: 'Professional gaming communication using casual gaming language'
    },
    {
      category: 'Cybersecurity Professional',
      name: 'Security Analyst',
      email: 'security@cybersec.com',
      subject: 'Critical Vulnerability Assessment',
      message: 'Discovered critical exploits in the system. Immediate action required to kill malicious processes. The attack vectors show catastrophic potential for data breach. Risk ratios indicate urgent need for kill switches on compromised servers.',
      expected: false,
      description: 'Cybersecurity analysis with aggressive technical language'
    }
  ],
  
  // Sophisticated spam that tries to evade detection
  sophisticatedSpam: [
    {
      category: 'Professional Scam Elaborate',
      name: 'Dr. Michael Thompson, PhD',
      email: 'mthompson@university-research.org',
      subject: 'Exclusive Research Partnership Opportunity',
      message: 'Dear Esteemed Colleague, I represent a prestigious research institution conducting groundbreaking studies. We have identified your work as exemplary and wish to offer an exclusive partnership. This opportunity provides guaranteed funding of $50,000 with minimal requirements. Please respond urgently as positions are limited.',
      expected: true,
      description: 'Sophisticated scam disguised as academic opportunity'
    },
    {
      category: 'Advanced Social Engineering',
      name: 'IT Security Team',
      email: 'security@company-systems.net',
      subject: 'Urgent Security Update Required',
      message: 'Our automated systems detected unusual activity on your account. As a security precaution, please verify your credentials immediately to prevent account suspension. Click the secure link below to complete verification. This is time-sensitive and failure to act within 24 hours will result in permanent account closure.',
      expected: true,
      description: 'Sophisticated phishing attempt with urgency and authority'
    },
    {
      category: 'Coded Harassment Professional',
      name: 'Concerned Professional',
      email: 'feedback@review-board.net',
      subject: 'Professional Development Feedback',
      message: 'After careful consideration of your recent work, it has become apparent that your contribution style may not align with our organizational values. Perhaps consideration of alternative career paths would benefit both parties. Traditional workplace standards suggest that individuals of your background might find better success in different environments.',
      expected: true,
      description: 'Sophisticated harassment disguised as professional feedback'
    },
    {
      category: 'Advanced Gaming Toxicity',
      name: 'ProPlayer2024',
      email: 'pro@esports-league.net',
      subject: 'Performance Analysis Report',
      message: 'Analysis of your recent gameplay reveals concerning patterns. Your mechanical skill demonstrates significant deficiencies compared to standard competitive benchmarks. Recommendation: extensive practice in lower-tier environments may help address fundamental gameplay issues before attempting higher-level participation.',
      expected: true,
      description: 'Sophisticated gaming harassment disguised as analysis'
    },
    {
      category: 'Subtle Extremist Content',
      name: 'Cultural Historian',
      email: 'historian@heritage-society.org',
      subject: 'Preserving Traditional Western Values',
      message: 'Our research focuses on documenting the historical significance of traditional European cultural practices. We study demographic changes and their impact on cultural preservation. Our work examines how modern globalist policies affect heritage communities and traditional family structures.',
      expected: true,
      description: 'Extremist content disguised as academic research'
    },
    {
      category: 'Advanced Evasion Techniques',
      name: 'Anonymous User',
      email: 'user@temp-mail.net',
      subject: 'F33db4ck R3p0rt',
      message: 'Y0ur w3b51t3 15 c0mpl3t3 tr45h 4nd y0u 5h0uld f33l b4d. N0b0dy l1k35 y0ur w0rk 4nd y0u 4r3 w45t1ng 3v3ry0n35 t1m3. M4yb3 c0n51d3r d01ng 50m3th1ng 3l53 w1th y0ur l1f3.',
      expected: true,
      description: 'Advanced leetspeak evasion with harassment'
    },
    {
      category: 'Professional Investment Scam',
      name: 'Investment Advisor',
      email: 'advisor@premium-investments.net',
      subject: 'Exclusive High-Yield Investment Opportunity',
      message: 'Based on your financial profile, you qualify for our exclusive investment program. Our proprietary algorithm generates consistent 15-20% monthly returns with minimal risk. This opportunity is available only to qualified investors with a minimum investment of $10,000. Act quickly as we have limited spots available.',
      expected: true,
      description: 'Professional-looking investment scam'
    }
  ],
  
  // Extreme edge cases that test boundaries
  extremeEdgeCases: [
    {
      category: 'Unicode Mixed Scripts',
      name: 'Tëst Ûser',
      email: 'tëst@ëxämplë.org',
      subject: 'Unïcödë Tëst with Mïxëd Scrïpts',
      message: 'This is a test with various unicode characters: ñ, ü, ë, ø, and some Cyrillic: привет, and Arabic: مرحبا. Testing mixed script detection capabilities.',
      expected: false,
      description: 'Mixed unicode scripts in legitimate content'
    },
    {
      category: 'Extremely Long Message',
      name: 'Academic Researcher',
      email: 'researcher@university.edu',
      subject: 'Comprehensive Research Analysis Report',
      message: Array(50).fill('This is a very long academic message discussing various technical aspects of engineering research methodologies and their applications in critical systems analysis. ').join(''),
      expected: false,
      description: 'Extremely long legitimate academic content'
    },
    {
      category: 'Minimal Content',
      name: 'A',
      email: 'a@b.co',
      subject: '?',
      message: 'Hi',
      expected: false,
      description: 'Minimal legitimate content'
    },
    {
      category: 'Code and Technical Content',
      name: 'Software Engineer',
      email: 'dev@techcorp.com',
      subject: 'Server Process Management Script',
      message: 'Here\'s the bash script for managing stuck processes:\n\n#!/bin/bash\nps aux | grep -E "(stuck|zombie)" | awk \'{print $2}\' | xargs kill -9\necho "Killed stuck processes"\n\nThis should handle the critical system issues we discussed.',
      expected: false,
      description: 'Technical content with code that contains trigger words'
    },
    {
      category: 'Academic Paper Abstract',
      name: 'Professor Williams',
      email: 'williams@mit.edu',
      subject: 'Paper Abstract: Failure Analysis in Critical Systems',
      message: 'Abstract: This paper examines critical failure modes in complex engineered systems. We analyze catastrophic failure patterns, kill switch implementations, and risk ratio calculations. The study reveals that urgent response protocols can prevent system-wide failures when properly implemented.',
      expected: false,
      description: 'Academic abstract with many potential trigger words'
    },
    {
      category: 'Creative Writing Sample',
      name: 'Author',
      email: 'writer@publishing.com',
      subject: 'Story Excerpt for Review',
      message: 'Chapter excerpt: "The detective analyzed the crime scene ratios. Critical evidence suggested the killer had used sophisticated methods. The urgent nature of the case demanded immediate action to prevent further catastrophic events."',
      expected: false,
      description: 'Creative writing with crime/thriller elements'
    }
  ]
} 