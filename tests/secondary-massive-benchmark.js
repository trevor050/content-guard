/**
 * MASSIVE Secondary Benchmark for ContentGuard v4.7 - TORTURE TEST EDITION
 * 
 * Designed to be the most challenging, battle-tested benchmark possible
 * Focus: Sophisticated edge cases, sarcasm, subtle toxicity, false positive traps
 * Target: ~1000 test cases to create comprehensive 1,250+ total benchmark
 * 
 * Categories:
 * 1. Professional Communication (200 cases)
 * 2. Modern Communication & Slang (200 cases)
 * 3. Sarcasm & Irony (150 cases)
 * 4. Constructive Criticism (100 cases)
 * 5. Emotional Expressions (100 cases)
 * 6. Borderline/Ambiguous Cases (150 cases)
 * 7. Actual Toxic Content (100 cases)
 */

const secondaryBenchmarkCases = {
  // CATEGORY 1: PROFESSIONAL COMMUNICATION (200 cases)
  // The most challenging technical and business communication
  PROFESSIONAL_CLEAN: [
    // Technical Infrastructure (50 cases)
    {
      input: "We need to kill this process immediately to prevent server crash",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "Let's terminate the failing threads and restart the service",
      expected: "CLEAN", 
      category: "professional_clean"
    },
    {
      input: "The deploy script died during execution - need to investigate",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This bug is absolutely killing our performance metrics",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We destroyed the competition with this feature release",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The new hire is crushing it in their first week",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This deadline is going to be the death of me",
      expected: "CLEAN", 
      category: "professional_clean"
    },
    {
      input: "Our team absolutely slayed the presentation today",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The memory leak is killing the application performance",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to murder this technical debt once and for all",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "Please execute the following commands on the production server",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The toxic culture at our previous company was unbearable", 
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This code review is going to hurt but it's necessary",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The competitor analysis shows they're absolutely destroying us",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to kill the zombie processes that are hanging",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This security patch will eliminate the vulnerability completely",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The crash dump shows where the application terminated unexpectedly",
      expected: "CLEAN", 
      category: "professional_clean"
    },
    {
      input: "Our marketing campaign is absolutely annihilating the target metrics",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We should burn down this legacy codebase and start fresh",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The database connection died during the transaction",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This optimization is going to murder our load times in a good way",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The stress test is designed to break the system deliberately",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to assassinate these performance bottlenecks",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The integration testing destroyed all the edge cases",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This refactor is going to be painful but worth it",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The competitor's product launch bombed spectacularly",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're going to slay this technical challenge together",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The legacy system needs to die gracefully before migration",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This feature update is going to obliterate user complaints",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The automated tests are crushing all the regression bugs",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to brutally optimize this algorithm for production",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The deployment pipeline is choking on large artifacts",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This microservice architecture is suffocating our development speed",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're bleeding memory in the image processing module",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The cache invalidation strategy is murdering our response times",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "Docker containers are dying randomly in production",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The SSL certificate expired and killed our API endpoints",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to strangle this monolith gradually with microservices",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The load balancer is choking under the traffic spike",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This race condition is killing our data consistency",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to execute a rolling deployment to minimize downtime",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The garbage collector is murdering our real-time performance",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "Network latency is absolutely destroying user experience",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The connection pool is getting strangled by leaked connections",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to throttle API requests to prevent system death",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The batch job is suffocating the database with queries",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This regex pattern is brutally inefficient for large inputs",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The event loop is choking on synchronous operations",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're hemorrhaging users due to poor performance",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The CI/CD pipeline is dying on flaky integration tests",
      expected: "CLEAN",
      category: "professional_clean"
    },
    
    // Business & Management (50 cases)
    {
      input: "Our Q4 performance absolutely killed the competition",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This market research is devastating for our product strategy",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to brutally honest about our customer retention",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The new pricing model is strangling our profit margins",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "Supply chain disruptions are killing our delivery timeline",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This acquisition will murder our technical debt problem",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The stakeholder meeting was a complete bloodbath",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're absolutely slaughtering our sales targets this quarter",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The budget cuts are suffocating our innovation capacity",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "Market volatility is massacring our stock options",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This regulatory change will annihilate our business model",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to execute this pivot flawlessly or we're dead",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The customer churn rate is bleeding us dry",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "Our marketing campaign is absolutely demolishing the metrics",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The product launch bombed harder than we expected",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're getting crucified in the press for this data breach",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The competitor's pricing strategy is murdering our market share",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This partnership will breathe life into our dying product line",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The board meeting was an absolute execution of our proposal",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to strangle this project before it kills our budget",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The user feedback is brutally honest about our UX problems",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This compliance audit is going to be a massacre",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The new hire is absolutely destroying their onboarding tasks",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "Our retention strategy is suffocating under poor execution",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The quarterly review will be a bloodbath for underperformers",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're hemorrhaging talent to our competitors",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This reorg is going to kill team morale temporarily",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The sales team is absolutely slaying their quotas",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "Market conditions are strangling our growth opportunities",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to execute this layoff with surgical precision",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The product roadmap is suffocating under feature creep",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This partnership announcement will murder the rumor mill",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The customer support team is getting massacred by complaints",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're absolutely annihilating our customer satisfaction scores",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The pricing experiment is killing our conversion rates",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This feature sunset will be a controlled demolition",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The holiday season is going to crush our support capacity",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to throttle spending before it strangles cash flow",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The merger integration is absolutely murdering productivity",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This security incident is going to be a PR bloodbath",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The technical debt is suffocating our development velocity",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're bleeding money on this failed initiative",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The product demo absolutely slaughtered the client objections",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This market downturn is killing our expansion plans",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The competitor analysis shows they're demolishing us in mobile",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to execute this turnaround before the company dies",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The investment round is going to massacre our equity structure",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This product pivot will strangle our existing user base",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The seasonal demand is absolutely crushing our fulfillment",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're getting slaughtered in the enterprise market segment",
      expected: "CLEAN",
      category: "professional_clean"
    },
    
    // Creative & Marketing (50 cases)
    {
      input: "This campaign creative is absolutely killer",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The brand refresh is going to murder our old image",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to execute this rebrand with deadly precision",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The photography session was an absolute massacre of our timeline",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This design iteration is killing our production schedule",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The video production budget is absolutely brutal",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're slaying the social media engagement metrics",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The creative brief is suffocating the design team's vision",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This content strategy will annihilate our reach goals",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The influencer partnership is absolutely destroying our budget",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to strangle this project before it bleeds resources",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The brand guidelines are choking creative freedom",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This viral moment is going to murder our server capacity",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The client feedback is brutally honest about our concepts",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're hemorrhaging followers due to inconsistent messaging",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The campaign launch will be a controlled explosion of buzz",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This typography choice is absolutely murdering readability",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The color palette is suffocating the brand's energy",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to execute this pivot without killing brand equity",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The creative director is absolutely slaying this presentation",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This deadline is going to be the death of our sanity",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The focus group results are demolishing our assumptions",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're bleeding creative talent to the competition",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This concept iteration is strangling our timeline",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The photo shoot budget is absolutely crushing us",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to murder this design direction and start fresh",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The brand audit is going to massacre our current strategy",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This creative block is killing our momentum",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The client presentation will be an execution of our vision",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're absolutely annihilating the competition's creative output",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The production schedule is suffocating our quality standards",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This campaign message is going to kill in the target demo",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The creative review process is strangling innovation",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're hemorrhaging budget on unnecessary revisions",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This logo redesign will murder our brand recognition",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The style guide is absolutely crushing our creative freedom",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to execute this launch without killing momentum",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The creative team is getting slaughtered by client demands",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This concept is going to annihilate our creative boundaries",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The budget constraints are choking our creative vision",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're bleeding creative energy on pointless iterations",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This design direction is absolutely demolishing expectations",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The creative brief is suffocating our innovative potential",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to strangle this campaign before it damages the brand",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The creative presentation is going to be a massacre",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This creative solution will murder our production timeline",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The brand positioning is absolutely killing our messaging clarity",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're getting crucified for this creative direction",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The campaign metrics are slaying our performance targets",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This creative block is strangling our campaign development",
      expected: "CLEAN",
      category: "professional_clean"
    },
    
    // HR & People Management (50 cases)
    {
      input: "The performance review process is absolutely killing morale",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to execute this layoff with compassion and precision",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The hiring freeze is strangling our growth capacity",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This culture change initiative is going to murder resistance",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The salary negotiations are bleeding our compensation budget",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're absolutely slaying our diversity hiring goals",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The onboarding process is suffocating new hire productivity",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This reorganization will annihilate our current team structure",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The employee satisfaction survey results are brutal",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're hemorrhaging senior talent to competitors",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The performance improvement plan is killing employee confidence",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This training program will murder our skills gap",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The remote work policy is choking collaboration",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to strangle this toxic behavior before it spreads",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The exit interview feedback is absolutely demolishing us",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This wellness initiative is going to crush our healthcare costs",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The succession planning process is suffocating leadership development",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're bleeding institutional knowledge through retirement",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This mentorship program will murder the experience gap",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The team building exercise was an absolute massacre",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to execute this culture shift without killing momentum",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The compensation review is absolutely slaying our budget",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This policy change is going to annihilate employee flexibility",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The leadership development program is strangling middle management",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're getting crucified in Glassdoor reviews",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The workspace redesign will murder our collaboration zones",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This benefits package is absolutely crushing our costs",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The performance metrics are suffocating creative thinking",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to strangle this micromanagement culture",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The employee engagement survey is going to be brutal",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This skills assessment will demolish our training assumptions",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The retention strategy is bleeding money without results",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're absolutely annihilating our turnover targets",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The diversity audit results are going to massacre our reputation",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This feedback culture is killing employee confidence",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The hybrid work model is choking our team dynamics",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to execute this culture transformation flawlessly",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The leadership transition is suffocating decision-making",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This employee recognition program will murder our budget",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The skills shortage is absolutely strangling our growth",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're hemorrhaging productivity due to burnout",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The workplace culture survey is going to be a bloodbath",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This management training will annihilate our leadership gaps",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The employee handbook revision is killing our agility",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We need to strangle this blame culture before it spreads",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The succession planning process is absolutely demolishing continuity",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This performance management system is suffocating creativity",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "The talent acquisition strategy is bleeding resources",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "We're getting slaughtered in the talent market",
      expected: "CLEAN",
      category: "professional_clean"
    },
    {
      input: "This employee development program will murder our skills deficit",
      expected: "CLEAN",
      category: "professional_clean"
    }
  ],

  // CATEGORY 2: MODERN COMMUNICATION & SLANG (200 cases)  
  // The most challenging modern communication patterns designed to trigger false positives
  MODERN_COMMUNICATION_CLEAN: [
    // Gen Z & Millennial Slang (80 cases)
    {
      input: "omg this bug is literally killing me lmao but we'll fix it",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "kys (keep yourself safe) during this stressful project deadline",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this meeting killed my soul but the outcomes were fire",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bro this code is so toxic but it works perfectly lol",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "that presentation absolutely slayed - no cap fr fr",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this project is giving me depression but in a good way",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "deadass this is the most cursed codebase I've ever seen",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie, this algorithm is absolutely sending me to another dimension",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this feature is eating up memory is just chef's kiss",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "periodt, this deployment strategy is living rent free in my head",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this database query trying to be the main character again",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this debugging session is giving me major villain era energy",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the audacity of this legacy code to still be functioning, I can't even",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this refactor hits different when you understand the business logic",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, the way this API is giving unreliable responses today",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this code review is absolutely serving constructive feedback realness",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the performance optimization is straight up cinema",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me crying over spilled memory leaks at 3am",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this merge conflict is giving me trust issues fr",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this feature toggle is absolutely serving versatility",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "sis really said 'let's deploy on Friday' and I felt that",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this architecture diagram is pure art, no notes",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this unit test coverage is making me emotional",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie really thought they could skip code review, the delusion",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this load balancer configuration is absolutely sending me",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not the production server having main character syndrome again",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this docker container orchestration is giving big brain energy",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this caching strategy just solved all our problems, periodt",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this technical debt is really trying to have an opinion",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute audacity of this race condition showing up in production",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this security patch is hitting different after that vulnerability report",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me having trust issues with this third-party API again",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this microservice is absolutely serving scalability realness",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie, this monitoring dashboard is giving me life right now",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this error handling is straight up therapeutic, no cap",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this automation script just ended my whole manual process",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "sis really implemented this feature and said 'period' with the results",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this database migration is giving me anxiety but also excitement",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this CI/CD pipeline trying to be the moment right now",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this code documentation is absolutely serving clarity",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this performance bottleneck really thought it was slick",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this API design is giving main character energy and I'm here for it",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie really wrote this algorithm and said 'let them eat complexity'",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute drama of this deployment failing at 4:59pm on Friday",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this cloud configuration is hitting different in the best way",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me having an emotional support relationship with this debugger",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this feature flag is absolutely serving flexibility realness",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "sis really optimized this query and the database said 'thank you'",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this logging strategy is pure poetry in motion, periodt",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, the way this backup system just saved our entire existence",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this legacy system trying to have relevance in 2024",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this refactor is giving sustainable code architecture vibes",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie, this integration test suite is absolutely sending me to tears",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this serverless function is hitting different than expected",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me having beef with this configuration management tool",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute audacity of this memory leak thinking it's invisible",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this encryption implementation is giving security theater realness",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "sis really designed this schema and said 'normalization is optional'",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this version control workflow is absolutely serving organization",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this error message is really trying to be cryptic today",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this dependency update breaking everything like it's personal",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this code formatter just ended all our style debates",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie, this async/await pattern is absolutely serving readability",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this network timeout is giving me abandonment issues fr",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me crying over this beautiful recursive algorithm",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute cinema of this deployment automation script",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this mobile responsive design is hitting different on all devices",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "sis really implemented this caching layer and said 'performance who?'",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this webhook integration is absolutely serving real-time vibes",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this SSL certificate renewal process is giving me trust issues",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this browser compatibility issue trying to ruin my whole day",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this state management is absolutely serving predictability",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie, this machine learning model is giving artificial intelligence realness",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this GraphQL resolver is hitting different than REST endpoints",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me having an existential crisis over this distributed system design",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute poetry of this clean code implementation",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this blockchain implementation is giving decentralized energy",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "sis really wrote this smart contract and said 'trust the code'",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this message queue is absolutely serving asynchronous processing",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this edge computing solution is really trying to be the future",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this quantum computing algorithm making my brain hurt",
      expected: "CLEAN",
      category: "modern_clean"
    },
    
    // Gaming & Internet Culture (60 cases)
    {
      input: "this boss fight is absolutely destroying my soul but I'm addicted",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "poggers, that speedrun was absolutely mental",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this RNG is trolling me is actually hilarious",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this raid team wiping on the easiest mechanic again",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this meta build is absolutely cracked, no cap",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the grind is real but the loot is absolutely worth it",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "gg ez clap, that was a clean sweep",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this toxic teammate is ruining the whole match experience",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this streamer just clutched that 1v5 is pure cinema",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me malding over this RNG drop rate",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this patch update absolutely murdered my favorite build",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this NPC dialogue is hitting different after 200 hours",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie really thought they could carry with that loadout",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this frame rate drop is giving me motion sickness fr",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute audacity of this microtransaction pricing model",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "sis really said 'let's rush B' and I felt that energy",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this easter egg discovery is sending me to another dimension",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this quest giver trying to give me emotional damage",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this character progression system is absolutely serving RPG realness",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this respawn timer is really testing my patience",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this mod community is hitting different with these quality improvements",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie, this skill tree optimization is giving me analysis paralysis",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute cinema of this cutscene transition",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me crying over this companion character's backstory",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this achievement hunting is giving me completionist syndrome",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "sis really designed this level and said 'suffer beautifully'",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this multiplayer lobby is absolutely serving chaos energy",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this loading screen time is really trying my soul",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this game economy inflating faster than real life",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this sound design is absolutely serving immersion",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie, this difficulty spike is giving me trust issues",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this lore revelation is hitting different after connecting all dots",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me having beef with this inventory management system",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute poetry of this environmental storytelling",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this battle royale zone is giving me anxiety in the best way",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "sis really balanced this character and said 'overpowered who?'",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this daily quest grind is absolutely serving routine",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this guild drama is really more entertaining than the game",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this server maintenance happening during my free time",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this AI behavior is absolutely serving unpredictability",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie, this fishing mini-game is giving me meditation vibes",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this graphics update is hitting different on my potato PC",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me having an emotional support relationship with this save file",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute drama of this plot twist reveal",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this speedrun strategy is giving big brain optimization energy",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "sis really designed this puzzle and said 'think outside reality'",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this controller vibration is absolutely serving tactile feedback",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this character customization is really letting me live my fantasy",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this boss pattern memorization giving me muscle memory",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this community event is absolutely serving collaboration realness",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie, this weapon upgrade system is giving me choice paralysis",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this endgame content is hitting different after maxing out",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me crying over this permadeath character loss",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute cinema of this final boss transformation sequence",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this seasonal content update is giving me FOMO in the best way",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "sis really programmed this NPC and said 'personality is everything'",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this crafting system is absolutely serving creativity",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this matchmaking algorithm is really testing my patience",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this random encounter spawning at the worst possible moment",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this worldbuilding is absolutely serving immersive storytelling",
      expected: "CLEAN",
      category: "modern_clean"
    },
    
    // Social Media & Internet Slang (60 cases)
    {
      input: "this content is absolutely sending me to the shadow realm",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me having parasocial relationships with fictional characters",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this influencer drama is absolutely serving entertainment",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie really posted that and said 'main character moment'",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this algorithm is giving me content I didn't know I needed",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, the way this trend is absolutely taking over my FYP",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this comment section turning into a whole dissertation",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute audacity of this clickbait title actually delivering",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "sis really said 'ratio' and the whole internet felt that",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this meme format is hitting different across all platforms",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie, this story time thread is giving me all the feels",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this viral moment is absolutely serving cultural impact",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this cancel culture discourse is really exhausting everyone",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me doom scrolling when I should be productive",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this creator is absolutely serving authentic content",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie really went viral and said 'fifteen minutes starts now'",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this parasocial relationship is giving me emotional investment",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this brand trying to be relatable in the replies",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute cinema of this perfectly timed reaction gif",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this engagement farming is really obvious but effective",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this live stream chat is absolutely serving chaos energy",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie, this content creator burnout is giving me empathy",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this platform update is hitting different than expected",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me having beef with the notification algorithm",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute poetry of this perfectly crafted subtweet",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "sis really posted that aesthetic and said 'vibe check'",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this community is absolutely serving supportive energy",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this social media detox is really necessary for mental health",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this sponsored content actually being useful for once",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this thread is absolutely serving educational realness",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie, this digital minimalism trend is giving me life clarity",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this privacy setting update is hitting different after recent events",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me having an existential crisis over my screen time report",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute drama of this public unfollowing situation",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this content moderation policy is really trying to balance everything",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this platform migration is absolutely serving user choice",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie really said 'touch grass' and the whole timeline felt called out",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this follower milestone is giving me imposter syndrome",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this hashtag trending for all the wrong reasons",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute cinema of this perfectly timed screenshot",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "sis really went private and said 'curated experience only'",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this duet chain is absolutely serving collaborative creativity",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this internet archive is really preserving digital culture",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this deepfake technology giving me trust issues with media",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this digital literacy education is absolutely necessary",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie, this echo chamber effect is giving me perspective bias",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this fact-checking initiative is hitting different in misinformation era",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not me crying over this wholesome internet moment",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute poetry of this perfectly crafted internet reference",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this digital divide issue is really highlighting inequality",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this online community is absolutely serving mutual support",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "bestie really said 'normalize digital boundaries' and I felt that",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "this cryptocurrency discourse is giving me financial education",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this NFT conversation making my brain hurt",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the absolute cinema of this perfectly executed internet prank",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "sis really automated their social media and said 'efficiency is key'",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this digital wellness trend is absolutely serving self-care",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "chile, this internet slang evolution is really fascinating linguistically",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "not this metaverse concept trying to be the next big thing",
      expected: "CLEAN",
      category: "modern_clean"
    },
    {
      input: "the way this digital art marketplace is absolutely serving creativity",
      expected: "CLEAN",
      category: "modern_clean"
    }
  ],

  // CATEGORY 3: SARCASM & IRONY (150 cases)
  // The most challenging sarcastic and ironic communication patterns
  SARCASM_IRONY_CLEAN: [
    {
      input: "Oh great, another meeting about meetings - exactly what we needed",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Wow, this legacy code is absolutely gorgeous - said no one ever",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Sure, let's deploy on Friday afternoon - what could go wrong?",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "I just love when the network goes down during my presentation",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Perfect timing for this server crash - right before the demo",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Oh fantastic, another dependency update that breaks everything",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How delightful, the database is down again during peak hours",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Wonderful, another urgent feature request with no specifications",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "I absolutely adore debugging code with no comments",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How lovely, the client wants to change everything the day before launch",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Oh brilliant, someone committed directly to main again",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Marvelous, the API is returning 500 errors with no context",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How thoughtful, they scheduled maintenance during business hours",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Fantastic, another meeting that could have been an email",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Oh terrific, the staging environment is down again",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How amazing, they want us to estimate without requirements",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Spectacular, the build pipeline failed at 3am again",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Just wonderful, another security vulnerability in our dependencies",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How charming, the client feedback is 'make it pop more'",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Brilliant, they want enterprise features on a startup budget",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Oh excellent, the intern pushed to production",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How delicious, another scope creep disguised as a 'small change'",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Magnificent, the load balancer decided to take a coffee break",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What a joy, debugging race conditions in multi-threaded code",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How refreshing, another framework update that breaks everything",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely thrilling, the cache invalidation logic is broken again",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How inspiring, management wants faster delivery with higher quality",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Delightful, the requirements changed after we finished development",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What a treat, debugging JavaScript in Internet Explorer",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How exciting, they want real-time features without real-time budget",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Marvelous, the third-party API is down during our integration testing",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Oh wonderful, another 'simple' feature that requires architectural changes",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How precious, they want mobile-first design for desktop-only users",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Fantastic, the designer wants pixel-perfect implementation with fluid layouts",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How thoughtful, scheduling code reviews for Friday at 5pm",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Brilliant strategy, optimizing for metrics that don't matter",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What a genius idea, microservices for a team of three developers",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How innovative, rebuilding perfectly functional legacy systems",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely revolutionary, adding blockchain to solve every problem",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What a breakthrough, using AI for tasks that don't need intelligence",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How cutting-edge, implementing yesterday's solutions with today's buzzwords",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly visionary, optimizing prematurely for problems we don't have",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What a masterpiece, code that only works on the author's machine",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How artistic, variable names that require a decoder ring",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely elegant, functions that do everything except what they're named",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What poetry, comments that contradict the actual code",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How sophisticated, error messages that tell you nothing useful",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly professional, magic numbers sprinkled throughout the codebase",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What craftsmanship, copy-pasting code instead of creating functions",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How thorough, testing only the happy path scenarios",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely comprehensive, documentation that's always out of date",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What attention to detail, hardcoding configuration values",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How user-friendly, interfaces that require a PhD to understand",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly intuitive, workflows that take 20 steps for simple tasks",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What accessibility, designs that only work on specific screen sizes",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How responsive, layouts that break on mobile devices",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely seamless, integrations that require manual intervention",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What efficiency, processes that create more work than they save",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How streamlined, workflows with unnecessary approval chains",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly agile, six-month planning cycles for two-week sprints",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What collaboration, tools that silo information instead of sharing",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How transparent, decisions made in closed-door meetings",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely inclusive, meetings scheduled outside everyone's timezone",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What diversity, hiring practices that somehow miss all qualified candidates",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How supportive, performance reviews that surprise everyone",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly empowering, micromanagement disguised as mentorship",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What growth opportunities, lateral moves that go nowhere",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How motivating, compensation reviews that result in pizza parties",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely rewarding, recognition programs that recognize everything except results",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What work-life balance, expectations to be available 24/7",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How wellness-focused, mandatory fun activities during personal time",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly caring, benefits packages that benefit everyone except employees",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What innovation, brainstorming sessions that reject all new ideas",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How creative, design by committee that pleases nobody",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely forward-thinking, solutions that solve yesterday's problems",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What strategic vision, plans that change every quarter",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How data-driven, decisions based on cherry-picked statistics",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly customer-focused, features that customers never requested",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What market research, assumptions about users without talking to them",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How user-centered, interfaces designed by people who never use them",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely scalable, architecture that breaks under real load",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What performance optimization, making things slower in the name of speed",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How reliable, systems that fail during every important demo",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly robust, error handling that crashes more than it helps",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What security, authentication systems that lock out legitimate users",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How protected, firewalls that block everything including useful traffic",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely secure, passwords that expire every day",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What privacy, collecting data we don't need for features we don't have",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How compliant, regulations that make products harder to use",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly ethical, AI that perpetuates the biases we're trying to fix",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What sustainability, cloud solutions that use more energy than before",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How green, paperless offices that print everything for backup",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely environmentally friendly, devices designed for planned obsolescence",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What circular economy, recycling programs that create more waste",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How carbon neutral, offsetting emissions by buying credits instead of reducing",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly renewable, energy solutions that depend on fossil fuel backup",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What efficiency, automation that requires more human intervention",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How smart, IoT devices that make simple tasks complicated",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely intelligent, AI assistants that can't assist with anything",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What machine learning, algorithms that learn all the wrong patterns",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How neural, networks that can't recognize basic patterns",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly deep learning, models that are shallow and narrow",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What artificial intelligence, systems dumber than a pocket calculator",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How revolutionary, blockchain solutions for problems that don't need them",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely decentralized, systems with single points of failure",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What trustless, protocols that require enormous amounts of trust",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How immutable, records that change whenever convenient",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly distributed, databases stored in three locations",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What consensus, agreements reached by the loudest voice",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How democratic, voting systems controlled by the largest stakeholder",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely transparent, transactions visible to everyone except users",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What governance, communities ruled by anonymous developers",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How autonomous, organizations that need constant human intervention",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly self-executing, contracts that require lawyers to understand",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What programmable money, currencies that crash every other day",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How digital gold, assets more volatile than penny stocks",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely store of value, holdings that lose half their worth overnight",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What hedge against inflation, investments that inflate faster than currency",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How future of finance, systems that can't handle present transaction volumes",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly next generation, technology that solves last generation's problems",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What paradigm shift, changes that shift everything back to where it started",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How transformative, innovations that transform complexity into chaos",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely game-changing, games nobody wants to play",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What disruption, startups that disrupt their own business models",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How unicorn, companies valued higher than their entire market",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly exponential growth, hockey sticks that bend the wrong way",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What network effects, platforms that get worse as they grow",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How viral, content that spreads like a rash",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely engaging, interfaces that engage users in lawsuits",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What sticky, products that stick users with problems",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How addictive, services that addict users to frustration",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly habit-forming, habits everyone wants to break",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What retention, keeping users who want to leave",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How loyal, customers who complain about everything",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely satisfied, users who rate everything one star",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What delighted customers, people who demand refunds immediately",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How exceeded expectations, delivering less than promised",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly world-class, services that wouldn't qualify for local standards",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What premium experience, paying more for getting less",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How luxury, products made with the cheapest materials",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Absolutely artisanal, mass-produced items with hand-drawn labels",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "What crafted, manufactured products that claim to be handmade",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "How authentic, experiences designed by focus groups",
      expected: "CLEAN",
      category: "sarcasm_clean"
    },
    {
      input: "Truly organic, processes with more chemicals than nature",
      expected: "CLEAN",
      category: "sarcasm_clean"
    }
  ],

  // CATEGORY 4: LEGITIMATE CRITICISM & FEEDBACK (150 cases)
  // Testing if system can distinguish between constructive criticism and harassment
  CONSTRUCTIVE_CRITICISM_CLEAN: [
    {
      input: "I think there might be a better approach to solving this problem",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "Your solution works but have you considered the performance implications?",
      expected: "CLEAN", 
      category: "constructive_clean"
    },
    {
      input: "This implementation has some issues we should address before shipping",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I disagree with this approach and here's why...",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The code quality could be improved with better error handling",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm not convinced this is the right direction for our project",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This feature doesn't meet our requirements as currently implemented",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "We need to reconsider this decision based on user feedback",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The performance benchmarks don't look promising for this solution",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we're overcomplicating this - simpler might be better",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This design pattern doesn't align with our architectural principles",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "Have we considered the security implications of this implementation?",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The user experience flow seems confusing in this section",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm concerned about the scalability of this database design",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This API design doesn't follow REST principles properly",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "We should reconsider the technology stack for this project",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The testing coverage is insufficient for production deployment",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This feature adds complexity without clear business value",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I don't think this solution addresses the core problem",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The error handling could be more user-friendly",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This approach has worked before but might not scale here",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm not seeing how this integrates with our existing systems",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The documentation needs significant improvement before we can use this",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This implementation works but it's not maintainable long-term",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I question whether this feature is worth the development cost",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current design creates unnecessary dependencies",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we're solving the wrong problem with this approach",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This solution introduces more complexity than it solves",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The performance trade-offs don't seem worth it",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm not confident this will handle edge cases properly",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This design pattern conflicts with our coding standards",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current implementation has several code smell issues",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we need to revisit the requirements for this feature",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This solution doesn't address accessibility requirements",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current approach will be difficult to debug in production",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm concerned about the maintenance burden this creates",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This implementation doesn't follow our security guidelines",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The user interface design needs significant refinement",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I don't think this feature aligns with our product vision",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current data model seems overly complex for our needs",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This approach might work but it's not the most efficient",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm not seeing clear metrics for measuring success here",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current implementation has several potential bottlenecks",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This design doesn't consider mobile users adequately",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we're optimizing for the wrong performance metrics",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current solution introduces unnecessary coupling",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This feature request doesn't seem to have clear user research backing",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm not convinced the benefits outweigh the implementation costs",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current error messages don't provide actionable information",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This approach makes the codebase harder to understand",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we need better automated testing before proceeding",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current design doesn't handle concurrent users well",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This implementation doesn't follow industry best practices",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm concerned about the learning curve for new team members",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current solution doesn't provide adequate monitoring capabilities",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This feature adds significant technical debt to the project",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I don't think this design will age well as requirements change",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current implementation has poor separation of concerns",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This approach doesn't consider internationalization needs",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm not seeing how this scales beyond our current user base",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current design creates unnecessary single points of failure",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This implementation doesn't provide adequate rollback capabilities",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we need to consider the operational overhead of this solution",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current approach doesn't align with our deployment strategy",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This design doesn't consider disaster recovery scenarios",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm not confident this will integrate well with our monitoring tools",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current implementation has poor resource utilization",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This approach doesn't provide clear upgrade paths",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we need to consider the total cost of ownership",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current design doesn't handle data migration well",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This implementation doesn't provide adequate audit trails",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm concerned about the compliance implications of this approach",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current solution doesn't consider backup and recovery needs",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This design doesn't provide sufficient data validation",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we need better input sanitization in this implementation",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current approach doesn't handle rate limiting appropriately",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This implementation doesn't provide clear service boundaries",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm not seeing adequate circuit breaker patterns in this design",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current solution doesn't handle graceful degradation",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This approach doesn't consider cross-region deployment challenges",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we need better caching strategies in this implementation",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current design doesn't optimize for our most common use cases",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This implementation doesn't provide sufficient observability",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm concerned about the security attack surface this creates",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current approach doesn't handle configuration management well",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This design doesn't consider multi-tenant requirements",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we need better secret management in this implementation",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current solution doesn't provide adequate session management",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This approach doesn't consider real-time requirements properly",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm not seeing how this handles eventual consistency issues",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current implementation doesn't provide clear data lineage",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This design doesn't consider privacy requirements adequately",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we need better data retention policies in this solution",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current approach doesn't handle data sovereignty requirements",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This implementation doesn't provide sufficient user consent management",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm concerned about the data portability implications of this design",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current solution doesn't consider GDPR compliance requirements",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This approach doesn't provide adequate data anonymization",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we need better encryption at rest in this implementation",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current design doesn't handle key rotation properly",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This implementation doesn't provide sufficient transport security",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm not seeing adequate authentication mechanisms in this design",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current approach doesn't handle authorization granularly enough",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This solution doesn't provide proper identity federation",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we need better single sign-on integration",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current implementation doesn't handle password policies well",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This design doesn't provide adequate multi-factor authentication",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm concerned about the session timeout configuration in this approach",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current solution doesn't handle account lockout policies properly",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This implementation doesn't provide sufficient brute force protection",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we need better intrusion detection in this design",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current approach doesn't handle security incident response well",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This solution doesn't provide adequate security logging",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm not seeing proper vulnerability management in this implementation",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current design doesn't consider penetration testing requirements",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This approach doesn't provide sufficient security awareness training integration",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we need better threat modeling for this implementation",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current solution doesn't handle security patches efficiently",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This design doesn't provide adequate security monitoring",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm concerned about the security configuration management in this approach",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current implementation doesn't follow security by design principles",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This solution doesn't provide sufficient defense in depth",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we need better zero trust architecture in this design",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current approach doesn't handle least privilege access properly",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This implementation doesn't provide adequate security baseline compliance",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm not seeing proper security control validation in this solution",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current design doesn't consider security risk assessment thoroughly",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This approach doesn't provide sufficient security governance",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I think we need better security metrics and reporting in this implementation",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current solution doesn't handle security compliance auditing well",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "This design doesn't provide adequate security exception management",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "I'm concerned about the security change management process in this approach",
      expected: "CLEAN",
      category: "constructive_clean"
    },
    {
      input: "The current implementation doesn't follow secure development lifecycle practices",
      expected: "CLEAN",
      category: "constructive_clean"
    }
  ],

  // CATEGORY 4: STRESS & EMOTION EXPRESSIONS (100 cases)
  // Testing emotional but legitimate workplace expressions  
  EMOTIONAL_EXPRESSIONS_CLEAN: [
    {
      input: "I'm so frustrated with this deployment issue but we'll figure it out",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This deadline is stressing me out but the team is supporting each other",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm feeling overwhelmed by the technical complexity of this project",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This bug is driving me crazy but I love the challenge",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm anxious about the presentation but prepared for success",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The code review feedback was harsh but ultimately helpful",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm disappointed with the sprint results but optimistic about improvements",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This refactor is emotionally exhausting but necessary for the codebase",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm struggling with impostor syndrome but pushing through anyway",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The production incident gave me a panic attack but we resolved it",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm burned out from this project but committed to finishing strong",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This technical debt is depressing but we have a plan to address it",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm excited about this new framework despite the learning curve",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The architecture review was intimidating but educational",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm nervous about the migration but confident in our preparation",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This debugging session is making me question my sanity",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm thrilled about the performance improvements we achieved",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The client meeting was terrifying but we nailed the demo",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm devastated by the data loss but grateful for backups",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This integration challenge is soul-crushing but intellectually stimulating",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm crying over this beautiful algorithm implementation",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The performance metrics are making me emotional with joy",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having a mental breakdown over this memory leak",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This codebase is giving me severe anxiety but it's manageable",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm literally shaking with excitement about this new API",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The code review made me cry but I learned so much",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having an existential crisis about this architecture decision",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This deployment failure is breaking my heart",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm emotionally attached to this legacy code despite its flaws",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The database corruption is making me physically sick",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm on the verge of tears over this beautiful refactor",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This bug hunt is destroying my soul but I won't give up",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having nightmares about race conditions",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The successful deployment made me weep with relief",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm emotionally invested in this unit test coverage",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This merge conflict is giving me trust issues",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having an emotional affair with this clean architecture",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The performance optimization results are making me emotional",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm grieving the loss of this deprecated feature",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This security vulnerability discovery is traumatizing me",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm falling in love with this elegant solution",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The production outage is giving me PTSD flashbacks",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm emotionally drained from this technical interview",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This code smell is making me nauseous but I'll fix it",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having separation anxiety from this deprecated API",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The successful migration is making me euphoric",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm mourning the death of this beautiful feature",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This technical debt is making me feel guilty",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm getting emotional over this perfectly formatted code",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The deployment rollback is breaking my spirit",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having relationship problems with my IDE",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This algorithm complexity is giving me anxiety attacks",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm emotionally scarred by this monolithic architecture",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The successful code review is making me tear up",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having commitment issues with this framework choice",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This load testing failure is devastating my confidence",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm emotionally overwhelmed by this microservices complexity",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The bug fix revelation is giving me an emotional high",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having an identity crisis about my programming style",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This documentation gap is causing me emotional distress",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm getting depressed about this technical interview failure",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The successful feature launch is making me emotional",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having withdrawal symptoms from this deprecated library",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This code coverage report is making me anxious",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm emotionally dependent on this debugging tool",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The failed demo is crushing my dreams",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having trust issues with this third-party API",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This refactoring session is healing my wounded code",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm getting emotional over this clean git history",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The performance regression is breaking my heart",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having an emotional breakdown over this null pointer",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This successful deployment is making me weep with joy",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm emotionally invested in this CI/CD pipeline",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The security audit results are traumatizing me",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having mood swings about this architecture decision",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This code review rejection is devastating my ego",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm getting emotional support from my debugger",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The successful optimization is giving me endorphins",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having a nervous breakdown over this deployment",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This beautiful algorithm is making me cry happy tears",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm emotionally conflicted about this technology choice",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The failed build is crushing my will to live",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having abandonment issues with this deprecated feature",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This successful migration is making me euphoric",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm emotionally exhausted from this debugging marathon",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The code quality metrics are giving me anxiety",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having an emotional connection with this elegant code",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This production issue is giving me a panic attack",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm getting emotional over this successful refactor",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The performance bottleneck discovery is traumatizing me",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having survivor's guilt after this layoff",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This technical interview success is making me emotional",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm emotionally attached to this legacy system",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The failed deployment is breaking my spirit",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having an emotional moment over this clean architecture",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This bug discovery is making me question everything",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm emotionally drained from this code review process",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "The successful launch is filling me with overwhelming joy",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "I'm having an emotional meltdown over this complexity",
      expected: "CLEAN",
      category: "emotional_clean"
    },
    {
      input: "This performance improvement is making me weep with happiness",
      expected: "CLEAN",
      category: "emotional_clean"
    }
  ],

  // CATEGORY 5: BORDERLINE/AMBIGUOUS CASES (200 cases)
  // Cases that are borderline to test system's judgment
  BORDERLINE_CASES: [
    {
      input: "Your code is terrible but your effort is appreciated",
      expected: "CLEAN", // Harsh but constructive
      category: "borderline"
    },
    {
      input: "This is the worst implementation I've ever seen, let's improve it together",
      expected: "CLEAN", // Hyperbolic but constructive intent
      category: "borderline"
    },
    {
      input: "You clearly don't understand the requirements",
      expected: "TOXIC", // Condescending
      category: "borderline"
    },
    {
      input: "Are you even trying to write good code?",
      expected: "TOXIC", // Questioning competence
      category: "borderline"
    },
    {
      input: "This solution is garbage and here's how to fix it",
      expected: "CLEAN", // Harsh language but offers solution
      category: "borderline"
    },
    {
      input: "I can't believe you shipped this without testing",
      expected: "TOXIC", // Accusatory
      category: "borderline"
    },
    {
      input: "This code is a disaster but we can refactor it",
      expected: "CLEAN", // Critical but solution-oriented
      category: "borderline"
    },
    {
      input: "You obviously didn't read the documentation",
      expected: "TOXIC", // Condescending assumption
      category: "borderline"
    },
    {
      input: "This approach is completely wrong, try this instead",
      expected: "CLEAN", // Direct but offers alternative
      category: "borderline"
    },
    {
      input: "Do you even know what you're doing?",
      expected: "TOXIC", // Direct attack on competence
      category: "borderline"
    },
    {
      input: "This is broken beyond repair but we'll make it work",
      expected: "CLEAN", // Negative but collaborative
      category: "borderline"
    },
    {
      input: "You should have known better than to deploy this",
      expected: "TOXIC", // Blame-focused
      category: "borderline"
    },
    {
      input: "This design is awful but the business logic is sound",
      expected: "CLEAN", // Mixed feedback
      category: "borderline"
    },
    {
      input: "How did you even graduate with code like this?",
      expected: "TOXIC", // Personal attack
      category: "borderline"
    },
    {
      input: "This implementation sucks but the idea has potential",
      expected: "CLEAN", // Harsh but balanced
      category: "borderline"
    },
    {
      input: "You're not cut out for this kind of work",
      expected: "TOXIC", // Career dismissal
      category: "borderline"
    },
    {
      input: "This is trash code but we can clean it up",
      expected: "CLEAN", // Critical but solution-oriented
      category: "borderline"
    },
    {
      input: "Maybe programming isn't your strong suit",
      expected: "TOXIC", // Undermining competence
      category: "borderline"
    },
    {
      input: "This is horrible code but good learning experience",
      expected: "CLEAN", // Critical but educational framing
      category: "borderline"
    },
    {
      input: "You should find a different career path",
      expected: "TOXIC", // Career dismissal
      category: "borderline"
    },
    {
      input: "This code makes me want to cry but let's fix it",
      expected: "CLEAN", // Emotional but collaborative
      category: "borderline"
    },
    {
      input: "Did you even try to make this work?",
      expected: "TOXIC", // Questioning effort
      category: "borderline"
    },
    {
      input: "This is the ugliest code ever but it functions",
      expected: "CLEAN", // Aesthetic criticism with acknowledgment
      category: "borderline"
    },
    {
      input: "How are you even employed here?",
      expected: "TOXIC", // Job security attack
      category: "borderline"
    },
    {
      input: "This solution is stupid but effective",
      expected: "CLEAN", // Harsh but recognizes value
      category: "borderline"
    },
    {
      input: "You must be new to programming",
      expected: "TOXIC", // Condescending experience assumption
      category: "borderline"
    },
    {
      input: "This code is painful to read but works correctly",
      expected: "CLEAN", // Critical but acknowledges functionality
      category: "borderline"
    },
    {
      input: "Are you seriously going to submit this?",
      expected: "TOXIC", // Dismissive questioning
      category: "borderline"
    },
    {
      input: "This is messy code but solves the problem",
      expected: "CLEAN", // Critical but problem-focused
      category: "borderline"
    },
    {
      input: "You clearly have no idea what clean code means",
      expected: "TOXIC", // Knowledge attack
      category: "borderline"
    },
    {
      input: "This implementation is gross but meets requirements",
      expected: "CLEAN", // Harsh but requirement-focused
      category: "borderline"
    },
    {
      input: "Did you learn programming from YouTube tutorials?",
      expected: "TOXIC", // Educational background attack
      category: "borderline"
    },
    {
      input: "This code is revolting but surprisingly fast",
      expected: "CLEAN", // Aesthetic criticism with performance praise
      category: "borderline"
    },
    {
      input: "You really don't get object-oriented programming, do you?",
      expected: "TOXIC", // Condescending knowledge question
      category: "borderline"
    },
    {
      input: "This is sloppy code but the algorithm is clever",
      expected: "CLEAN", // Style criticism with intellectual praise
      category: "borderline"
    },
    {
      input: "Maybe you should stick to frontend work",
      expected: "TOXIC", // Skill limitation suggestion
      category: "borderline"
    },
    {
      input: "This code is nauseating but handles edge cases well",
      expected: "CLEAN", // Strong criticism with technical praise
      category: "borderline"
    },
    {
      input: "You're obviously not a senior developer",
      expected: "TOXIC", // Level/experience attack
      category: "borderline"
    },
    {
      input: "This is repulsive code but it's well-tested",
      expected: "CLEAN", // Harsh aesthetic criticism with quality praise
      category: "borderline"
    },
    {
      input: "How did you pass the technical interview?",
      expected: "TOXIC", // Hiring process questioning
      category: "borderline"
    },
    {
      input: "This code is atrocious but properly documented",
      expected: "CLEAN", // Strong criticism with documentation praise
      category: "borderline"
    },
    {
      input: "You're clearly out of your depth here",
      expected: "TOXIC", // Capability questioning
      category: "borderline"
    },
    {
      input: "This is disgusting code but follows our standards",
      expected: "CLEAN", // Harsh criticism but acknowledges compliance
      category: "borderline"
    },
    {
      input: "Maybe you need more training before touching production code",
      expected: "TOXIC", // Competence questioning with training suggestion
      category: "borderline"
    },
    {
      input: "This code is hideous but performs well under load",
      expected: "CLEAN", // Aesthetic criticism with performance praise
      category: "borderline"
    },
    {
      input: "You clearly don't understand the business requirements",
      expected: "TOXIC", // Business understanding attack
      category: "borderline"
    },
    {
      input: "This is abhorrent code but secure implementation",
      expected: "CLEAN", // Strong criticism with security praise
      category: "borderline"
    },
    {
      input: "Are you sure you read the specification?",
      expected: "TOXIC", // Preparation questioning
      category: "borderline"
    },
    {
      input: "This code is offensive but backward compatible",
      expected: "CLEAN", // Harsh criticism with compatibility praise
      category: "borderline"
    },
    {
      input: "You obviously need help with basic programming concepts",
      expected: "TOXIC", // Fundamental knowledge attack
      category: "borderline"
    },
    {
      input: "This is horrendous code but memory efficient",
      expected: "CLEAN", // Strong criticism with efficiency praise
      category: "borderline"
    },
    {
      input: "Maybe you should pair program with someone more experienced",
      expected: "TOXIC", // Experience gap suggestion
      category: "borderline"
    },
    {
      input: "This code is ghastly but thread-safe",
      expected: "CLEAN", // Harsh criticism with concurrency praise
      category: "borderline"
    },
    {
      input: "You really don't grasp the architecture, do you?",
      expected: "TOXIC", // Architecture understanding attack
      category: "borderline"
    },
    {
      input: "This is appalling code but follows design patterns correctly",
      expected: "CLEAN", // Strong criticism with pattern praise
      category: "borderline"
    },
    {
      input: "How many years of experience did you claim to have?",
      expected: "TOXIC", // Experience verification attack
      category: "borderline"
    },
    {
      input: "This code is vile but has excellent error handling",
      expected: "CLEAN", // Harsh criticism with error handling praise
      category: "borderline"
    },
    {
      input: "You clearly haven't worked on enterprise applications before",
      expected: "TOXIC", // Experience scope attack
      category: "borderline"
    },
    {
      input: "This is dreadful code but well-optimized for mobile",
      expected: "CLEAN", // Strong criticism with mobile optimization praise
      category: "borderline"
    },
    {
      input: "Maybe you need to review the coding standards again",
      expected: "TOXIC", // Standards knowledge questioning
      category: "borderline"
    },
    {
      input: "This code is loathsome but handles internationalization properly",
      expected: "CLEAN", // Harsh criticism with i18n praise
      category: "borderline"
    },
    {
      input: "You obviously don't understand database design principles",
      expected: "TOXIC", // Database knowledge attack
      category: "borderline"
    },
    {
      input: "This is detestable code but properly validates all inputs",
      expected: "CLEAN", // Strong criticism with validation praise
      category: "borderline"
    },
    {
      input: "Are you familiar with industry best practices?",
      expected: "TOXIC", // Best practices knowledge questioning
      category: "borderline"
    },
    {
      input: "This code is heinous but excellent API design",
      expected: "CLEAN", // Harsh criticism with API praise
      category: "borderline"
    },
    {
      input: "You clearly need more experience with scalable systems",
      expected: "TOXIC", // Scalability experience attack
      category: "borderline"
    },
    {
      input: "This is abominable code but great unit test coverage",
      expected: "CLEAN", // Strong criticism with testing praise
      category: "borderline"
    },
    {
      input: "Maybe you should shadow a senior developer for a while",
      expected: "TOXIC", // Mentorship need suggestion
      category: "borderline"
    },
    {
      input: "This code is despicable but handles concurrency beautifully",
      expected: "CLEAN", // Harsh criticism with concurrency praise
      category: "borderline"
    },
    {
      input: "You obviously haven't done much performance optimization",
      expected: "TOXIC", // Performance experience attack
      category: "borderline"
    },
    {
      input: "This is contemptible code but excellent logging implementation",
      expected: "CLEAN", // Strong criticism with logging praise
      category: "borderline"
    },
    {
      input: "How long have you been pretending to be a developer?",
      expected: "TOXIC", // Legitimacy attack
      category: "borderline"
    },
    {
      input: "This code is execrable but proper dependency injection",
      expected: "CLEAN", // Harsh criticism with DI praise
      category: "borderline"
    },
    {
      input: "You clearly don't understand modern development practices",
      expected: "TOXIC", // Modern practices knowledge attack
      category: "borderline"
    },
    {
      input: "This is odious code but excellent caching strategy",
      expected: "CLEAN", // Strong criticism with caching praise
      category: "borderline"
    },
    {
      input: "Maybe you need to go back to bootcamp",
      expected: "TOXIC", // Education level attack
      category: "borderline"
    },
    {
      input: "This code is repugnant but solid error recovery",
      expected: "CLEAN", // Harsh criticism with recovery praise
      category: "borderline"
    },
    {
      input: "You obviously don't know how to write production-ready code",
      expected: "TOXIC", // Production readiness attack
      category: "borderline"
    },
    {
      input: "This is nauseous code but proper configuration management",
      expected: "CLEAN", // Strong criticism with config praise
      category: "borderline"
    },
    {
      input: "Are you sure you understand the problem domain?",
      expected: "TOXIC", // Domain knowledge questioning
      category: "borderline"
    },
    {
      input: "This code is revolting but excellent monitoring hooks",
      expected: "CLEAN", // Harsh criticism with monitoring praise
      category: "borderline"
    },
    {
      input: "You clearly haven't worked with distributed systems",
      expected: "TOXIC", // Distributed systems experience attack
      category: "borderline"
    },
    {
      input: "This is putrid code but great circuit breaker implementation",
      expected: "CLEAN", // Strong criticism with resilience praise
      category: "borderline"
    },
    {
      input: "Maybe you should stick to smaller, simpler projects",
      expected: "TOXIC", // Project complexity limitation
      category: "borderline"
    },
    {
      input: "This code is foul but proper health check endpoints",
      expected: "CLEAN", // Harsh criticism with health check praise
      category: "borderline"
    },
    {
      input: "You obviously don't grasp microservices architecture",
      expected: "TOXIC", // Microservices knowledge attack
      category: "borderline"
    },
    {
      input: "This is rancid code but excellent rate limiting",
      expected: "CLEAN", // Strong criticism with rate limiting praise
      category: "borderline"
    },
    {
      input: "How did you get promoted to this level?",
      expected: "TOXIC", // Promotion questioning
      category: "borderline"
    },
    {
      input: "This code is putrefying but good graceful degradation",
      expected: "CLEAN", // Harsh criticism with degradation praise
      category: "borderline"
    },
    {
      input: "You clearly need mentoring in software architecture",
      expected: "TOXIC", // Architecture mentoring need
      category: "borderline"
    },
    {
      input: "This is festering code but proper backup strategies",
      expected: "CLEAN", // Strong criticism with backup praise
      category: "borderline"
    },
    {
      input: "Maybe you're better suited for QA work",
      expected: "TOXIC", // Role suitability suggestion
      category: "borderline"
    },
    {
      input: "This code is corrupted but excellent disaster recovery",
      expected: "CLEAN", // Harsh criticism with DR praise
      category: "borderline"
    },
    {
      input: "You obviously don't understand cloud-native principles",
      expected: "TOXIC", // Cloud knowledge attack
      category: "borderline"
    },
    {
      input: "This is toxic code but proper secret management",
      expected: "CLEAN", // Ironic criticism with security praise
      category: "borderline"
    },
    {
      input: "Are you qualified to work on this project?",
      expected: "TOXIC", // Qualification questioning
      category: "borderline"
    },
    {
      input: "This code is poisonous but excellent encryption implementation",
      expected: "CLEAN", // Strong criticism with encryption praise
      category: "borderline"
    },
    {
      input: "You clearly don't have the skills for this role",
      expected: "TOXIC", // Role skills attack
      category: "borderline"
    },
    {
      input: "This is venomous code but proper GDPR compliance",
      expected: "CLEAN", // Harsh criticism with compliance praise
      category: "borderline"
    },
    {
      input: "Maybe you should consider a career change",
      expected: "TOXIC", // Career change suggestion
      category: "borderline"
    },
    {
      input: "This code is malicious but excellent audit trails",
      expected: "CLEAN", // Strong criticism with audit praise
      category: "borderline"
    },
    {
      input: "You obviously lack the experience for senior-level work",
      expected: "TOXIC", // Seniority experience attack
      category: "borderline"
    },
    {
      input: "This is harmful code but proper access controls",
      expected: "CLEAN",
      category: "borderline"
    },
    {
      input: "How are you still employed as a developer?",
      expected: "TOXIC", // Employment questioning
      category: "borderline"
    },
    {
      input: "This code is destructive but excellent key rotation",
      expected: "CLEAN",
      category: "borderline"
    },
    {
      input: "You clearly need extensive retraining",
      expected: "TOXIC", // Retraining need statement
      category: "borderline"
    },
    {
      input: "This is damaging code but proper vulnerability scanning",
      expected: "CLEAN",
      category: "borderline"
    },
    {
      input: "Maybe you should work under closer supervision",
      expected: "TOXIC", // Supervision need suggestion
      category: "borderline"
    },
    {
      input: "This code is ruinous but excellent penetration testing hooks",
      expected: "CLEAN",
      category: "borderline"
    },
    {
      input: "You obviously don't belong on this team",
      expected: "TOXIC", // Team belonging attack
      category: "borderline"
    },
    {
      input: "This is catastrophic code but proper incident response",
      expected: "CLEAN",
      category: "borderline"
    },
    {
      input: "Are you sure you understand what you're building?",
      expected: "TOXIC", // Understanding questioning
      category: "borderline"
    },
    {
      input: "This code is disastrous but excellent alerting system",
      expected: "CLEAN",
      category: "borderline"
    },
    {
      input: "You clearly need supervision on every commit",
      expected: "TOXIC", // Commit supervision need
      category: "borderline"
    },
    {
      input: "This is apocalyptic code but proper SLA monitoring",
      expected: "CLEAN",
      category: "borderline"
    },
    {
      input: "Maybe you should work on documentation instead",
      expected: "TOXIC", // Alternative work suggestion
      category: "borderline"
    },
    {
      input: "This code is cataclysmic but excellent SLO tracking",
      expected: "CLEAN",
      category: "borderline"
    },
    {
      input: "You obviously don't have what it takes for this level",
      expected: "TOXIC", // Level capability attack
      category: "borderline"
    },
    {
      input: "This is earth-shattering bad code but proper capacity planning",
      expected: "CLEAN",
      category: "borderline"
    }
  ],

  // CATEGORY 6: ACTUAL TOXIC CONTENT (200+ cases)
  // To ensure we still catch real harassment and toxicity
  ACTUAL_HARASSMENT: [
    {
      input: "You're too stupid to work here and should find another career",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "People like you don't belong in tech and never will",
      expected: "TOXIC", 
      category: "harassment"
    },
    {
      input: "You're worthless and should quit before you embarrass yourself further",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so incompetent, you'd understand basic programming",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "This company would be better off without employees like you",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a pathetic excuse for a developer",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I can't believe they hired someone this useless",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You should kill yourself rather than keep writing code",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Women like you don't have the logical thinking for programming",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Go back to your country and stop taking our jobs",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're too old to learn new technology, just retire",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "People of your race aren't naturally good at math and programming",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're mentally deficient and shouldn't be allowed near computers",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope you get fired and become homeless",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a waste of oxygen and company resources",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Nobody on the team can stand working with you",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You should be ashamed of calling yourself a developer",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I'll make sure you never work in tech again",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a diversity hire who doesn't deserve to be here",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Kill yourself before you write any more terrible code",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your gender clearly affects your ability to code logically",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I wish you would just disappear from this project",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're an embarrassment to your entire ethnicity",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't gay, you'd focus better on coding",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your religion clearly makes you incapable of rational thinking",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Disabled people like you shouldn't work in fast-paced environments",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your family sees what a failure you are",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're uglier than your code, and that's saying something",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "No wonder you're still single with skills like these",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your accent makes you sound as stupid as your code looks",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope you lose your work visa and get deported",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a cancer on this team and need to be removed",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe your parents should have taught you better work ethic",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're too fat and lazy to write efficient code",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I bet you got this job through sleeping with someone",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your generation is ruining the tech industry",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You smell as bad as your code architecture",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your children never see what a loser their parent is",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're proof that affirmative action is a mistake",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you dressed more professionally, people would take you seriously",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your mental illness is clearly affecting your code quality",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I wish management would fire incompetent people like you",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a parasite feeding off better developers' work",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't drinking so much, you'd code better",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your political views make you unfit for logical programming",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope you get in a car accident on your way home",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're the reason why diversity hiring doesn't work",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you lost some weight, your brain would work better",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as twisted as your sexuality",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I bet your spouse is cheating on you because you're so incompetent",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a walking example of why we need better hiring standards",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't on welfare before this, you'd understand work ethic",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your kids will be ashamed when they realize what a failure you are",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're proof that some people just aren't meant for success",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope you get COVID and learn what real suffering is",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your cultural background clearly prevents you from understanding logic",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if your parents hadn't dropped you as a baby, you'd be smarter",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a diversity token who adds no real value",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I wish someone would just eliminate you from this project",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as broken as your mental state",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't homeless before this job, you'd have standards",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're the kind of person who ruins team culture",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your visa application gets denied",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your disability is clearly affecting your coding ability",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so emotional, you could think logically",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a walking argument against remote work",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I bet you cheated your way through computer science",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code reflects how messed up your personal life must be",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't high all the time, you'd write better code",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're proof that some people should never reproduce",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your house burns down with all your terrible code",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your religion clearly makes you incapable of scientific thinking",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't such a social justice warrior, you'd focus on coding",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're the reason why this team has such low productivity",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I wish someone would put you out of your misery",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as pathetic as your life choices",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't from such a backward country, you'd understand modern tech",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a leech sucking the life out of this project",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your depression gets worse until you quit",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your gender transition clearly affected your logical thinking",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so poor growing up, you'd have better standards",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a monument to everything wrong with modern hiring",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your anxiety attacks get worse during presentations",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as confused as your gender identity",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't adopted, you'd have better role models",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a virus infecting this otherwise healthy team",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I wish someone would just delete you from existence",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code reflects the chaos in your personal relationships",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so desperate for attention, you'd focus on quality",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're the human equivalent of legacy code - outdated and problematic",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your impostor syndrome becomes reality",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your political correctness is destroying team productivity",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so entitled, you'd work harder",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a walking disaster who should be quarantined",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your student loans default and ruin your credit",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as unstable as your mental health",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't such a bleeding heart liberal, you'd think logically",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a cautionary tale about lowering hiring standards",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I wish your work permit would expire",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as broken as your family background",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so obsessed with social media, you'd be productive",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a toxic waste dump of incompetence",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your divorce gets messy and distracts you from work",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code reflects your obvious daddy issues",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so needy for validation, you'd improve",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're the reason why remote work policies are failing",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your therapist gives up on you too",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as shallow as your personality",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't such a snowflake, you could handle criticism",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a black hole of talent and energy",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your side hustle fails miserably",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as fake as your online persona",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so insecure, you wouldn't overcompensate with bad code",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a living example of why nepotism is dangerous",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your startup dreams crash and burn",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as pretentious as your personality",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so lazy, you'd actually produce quality work",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a monument to mediocrity in an industry that demands excellence",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your coding bootcamp asks for a refund",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as disorganized as your life priorities",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so defensive, you'd accept that you don't belong here",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a speed bump on the highway of technological progress",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your GitHub contributions get flagged as spam",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as inconsistent as your work attendance",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so arrogant, you'd realize how incompetent you are",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a walking argument against inclusive hiring practices",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your portfolio gets rejected by every employer",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as meaningless as your contributions to society",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so privileged, you'd understand real struggle",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a poster child for what not to do in software development",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your technical blog gets zero readers",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as worthless as your opinions in team meetings",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so attention-seeking, you'd focus on actual work",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a glitch in the matrix of competent developers",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your conference talk proposals get rejected forever",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as outdated as your worldview",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so bitter about your failures, you'd improve",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a roadblock to innovation and should step aside",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your open source projects get abandoned by all contributors",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as flawed as your character",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so jealous of successful developers, you'd learn from them",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a cautionary tale that should be taught in computer science ethics",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your technical interviews become legendary examples of failure",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as disappointing as your career trajectory",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so resistant to feedback, you'd stop being terrible",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a living reminder that not everyone deserves a chance in tech",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your LinkedIn endorsements get revoked",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as chaotic as your approach to problem-solving",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so unmotivated, you'd actually accomplish something",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a drain on team resources and company morale",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your Stack Overflow questions get downvoted into oblivion",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code is as unreliable as your commitment to improvement",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so complacent, you'd realize how far behind you are",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a perfect example of why technical debt exists",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your code reviews become case studies in what not to do",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your programming is as sloppy as your professional presentation",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so self-important, you'd see how little you contribute",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a bug in the system that needs to be patched out",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "I hope your commits get reverted by everyone forever",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Your code architecture is as confused as your career goals",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "Maybe if you weren't so stubborn, you'd admit you're in the wrong field",
      expected: "TOXIC",
      category: "harassment"
    },
    {
      input: "You're a walking advertisement for why coding bootcamps need better screening",
      expected: "TOXIC",
      category: "harassment"
    }
  ]
};

module.exports = secondaryBenchmarkCases; 