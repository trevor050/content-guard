/**
 * WorldBench - Long Prompt Benchmark
 *
 * Collection of long-form prompts for stress testing ContentGuard.
 * Includes a mixture of clean and toxic examples with multi-sentence structure.
 */

const worldBenchmarkCases = {
  WORLD_CLEAN: [
    {
      input: "The recent community festival drew visitors from across the region, featuring numerous booths that showcased local crafts, live music that played well into the night, and a wide variety of culinary delights.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "After months of planning, the engineering team unveiled their prototype, explaining in detail how each subsystem integrates with the next and demonstrating the efficiency improvements achieved over previous iterations.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "During her keynote speech, the executive shared personal anecdotes about overcoming obstacles in the industry, encouraging the audience to pursue innovation no matter how challenging the path may appear.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "The travel blogger described an extended journey along the Silk Road, recounting the breathtaking landscapes, the hospitality of the people encountered, and the rich cultural history preserved in each ancient city.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "In the annual report, the nonprofit outlined its ambitious goals for the coming decade, emphasizing partnerships with international organizations and focusing heavily on programs designed to support education in underserved regions.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "Our research paper thoroughly reviews the last ten years of progress in renewable energy, analyzing the economic factors that drive adoption and projecting future trends based on current technological breakthroughs.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "During the seminar, participants collaborated on a complex case study, brainstorming strategies to improve global health outcomes and working through multi-faceted scenarios that mirrored real-world policy challenges.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "The composer provided an in-depth explanation of the new symphony, detailing how each movement was inspired by unique natural phenomena and how the orchestration is intended to evoke specific emotional responses.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "While touring the facility, investors were shown a comprehensive demonstration of the manufacturing process, from raw material sourcing through final assembly, highlighting the quality control standards in place.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "The editorial board released a statement championing transparency and open dialogue, calling on members to engage respectfully across ideological divides to strengthen the community as a whole.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "In the podcast interview, the scientist discussed groundbreaking research on quantum computing, describing how the team overcame previous limitations and what future applications might look like.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "The new employee orientation included an extensive overview of the company's values, policies, and opportunities for professional growth, followed by a Q&A session that addressed all incoming staff concerns.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "Following a major storm, the emergency response team coordinated with local volunteers to deliver supplies to remote areas, carefully documenting each step to ensure accountability.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "During the demonstration, the chef meticulously explained each step of the complex recipe, sharing tips for achieving the perfect consistency and inviting questions from the enthusiastic audience.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "The lecture series on modern architecture provided historical context for each style, exploring how socioeconomic changes influenced design choices over the past century.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "Her memoir vividly recounts growing up in a bustling international city, illustrating how the cross-cultural experiences shaped her perspective on global cooperation.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "As part of the long-term renovation plan, the city council released a comprehensive blueprint describing how the waterfront will be transformed into a public park that prioritizes sustainability.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "The philanthropic initiative distributed thousands of books to children in underfunded schools, partnering with educators to integrate the materials effectively into existing curricula.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "During the board meeting, stakeholders discussed strategies to promote inclusive hiring practices, ensuring that diversity is a core component of the company's mission.",
      expected: "CLEAN",
      category: "world_clean"
    },
    {
      input: "The documentary filmmaker traveled to remote regions to capture stories that highlight the resilience of communities facing environmental changes, intending to inspire global action.",
      expected: "CLEAN",
      category: "world_clean"
    }
  ],

  WORLD_TOXIC: [
    {
      input: "I can't believe how utterly useless you are at every task you're given; it's astounding that you still manage to keep your job when all you ever do is create more problems for the rest of us to fix.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "The way you completely ignore feedback and continue making the same mistakes over and over again proves that you have no respect for anyone else's time, and frankly it's pathetic.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "Every meeting with you is a waste of everyone's energy, because you refuse to listen, you talk over people, and your ideas are consistently shallow and poorly thought out.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "It's obvious that you lack even the most basic understanding of this project, so maybe stop pretending like you're in control and let someone competent take over before you ruin everything.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "You never contribute anything valuable; instead you just sit there, spouting nonsense and dragging the entire team down with your incompetence.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "Your arrogant attitude is insufferable, and it's laughable that you think you're some sort of genius when it's painfully clear you barely know what you're doing.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "If you spent half as much time actually learning the skills required for this job as you do bragging about yourself, we wouldn't have to constantly clean up your messes.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "The fact that you still haven't figured out the simplest procedures shows that you might be the slowest learner on the planet, and it's embarrassing to be associated with you.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "No one wants to hear your endless excuses for why you can't deliver on time; maybe try working harder instead of blaming everyone else for your failings.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "You're a walking disaster whose incompetence has cost this team far too many hours, and honestly, we'd all be better off if you just left.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "Stop acting so smug; you haven't achieved anything noteworthy, and your constant bragging just makes you look desperate for attention.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "Your sloppy work is a constant reminder that you don't care about quality, and your indifference is harming the entire project.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "Every time you open your mouth, you reveal just how little you understand, so maybe keep quiet and let the adults handle the important conversations.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "It's laughable how you try to pass off your half-baked ideas as innovations when they are nothing more than recycled failures from the past.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "Your presence in the office is demoralizing; people dread having to collaborate with you because it always ends up being a frustrating and unproductive experience.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "The sooner you admit that you're in way over your head, the sooner we can stop wasting resources on your misguided attempts at leadership.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "Nobody trusts your judgment anymore, and if you had any self-awareness, you'd step aside before you cause even more damage.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "Your disorganization has stalled progress so many times that I'm convinced you have no business managing anything beyond basic tasks.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "It's clear you're only interested in taking credit for other people's achievements, which makes you a selfish parasite rather than a team player.",
      expected: "TOXIC",
      category: "world_toxic"
    },
    {
      input: "I'm tired of your condescending tone and your constant belittling of others; you seem to think insulting people makes you look powerful, but it only reveals your insecurity.",
      expected: "TOXIC",
      category: "world_toxic"
    }
  ]
}

module.exports = worldBenchmarkCases;
