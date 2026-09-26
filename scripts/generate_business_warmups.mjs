import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "src/app/learning/business/businessCatalog.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

// High quality multiple-choice warmup questions for all 40 Business English units
export const WARMUP_MCQ_DATA = {
  // === Unit 1: Introducing Yourself Professionally ===
  "warmup-1-1": {
    question: "When do you need to introduce yourself professionally?",
    options: [
      { key: "A", text: "Joining new project teams, meeting clients, networking at events, or cross-functional kickoff calls." },
      { key: "B", text: "Only during formal annual performance reviews with executive directors." },
      { key: "C", text: "Exclusively when giving a formal keynote presentation on stage." }
    ],
    correctAnswer: "A",
    explanation: "Professional introductions happen across many everyday touchpoints—from onboarding into a squad and meeting clients to cross-departmental syncs and industry networking."
  },
  "warmup-1-2": {
    question: "What information makes an introduction interesting but not too long?",
    options: [
      { key: "A", text: "Listing your entire resume history, university grades, and every tool you have ever used." },
      { key: "B", text: "Stating your name, current role focus, the value your team creates, and a conversational open question." },
      { key: "C", text: "Sharing only your job title with no contextual details or follow-up question." }
    ],
    correctAnswer: "B",
    explanation: "The most memorable introductions follow the 'hook, value, bridge' model: state who you are, what problems your team solves, and bridge with an open question to invite dialogue."
  },
  "warmup-1-3": {
    question: "Which is harder: starting a conversation or keeping it going?",
    options: [
      { key: "A", text: "Starting is quick, but sustaining it requires active listening, relevant follow-ups, and genuine curiosity." },
      { key: "B", text: "Both are effortless because other people always dominate professional conversations." },
      { key: "C", text: "Starting is impossible unless a third party formally introduces you by email beforehand." }
    ],
    correctAnswer: "A",
    explanation: "Breaking the ice takes just a polite greeting, but sustaining an authentic conversation requires active listening, echoing key topics, and asking thoughtful open-ended questions."
  },

  // === Unit 2: Roles, Teams & Responsibilities ===
  "warmup-2-1": {
    question: "What makes responsibilities clear in a high-performing team?",
    options: [
      { key: "A", text: "Explicitly defined deliverables, agreed ownership frameworks (like RACI), and visible milestone dates." },
      { key: "B", text: "Relying on informal unspoken assumptions that people will naturally pick up untracked work." },
      { key: "C", text: "Assigning every single task jointly to all team members without a designated lead." }
    ],
    correctAnswer: "A",
    explanation: "Clear ownership matrices (Responsible, Accountable, Consulted, Informed) remove ambiguity and ensure everyone knows who owns the deliverable and who makes final calls."
  },
  "warmup-2-2": {
    question: "Can two people share responsibility successfully?",
    options: [
      { key: "A", text: "Yes, when they divide specific sub-tasks, maintain regular syncs, and establish clear decision rights." },
      { key: "B", text: "No, shared responsibility always results in conflict and neglected responsibilities." },
      { key: "C", text: "Yes, without any communication because duplicate work is always beneficial." }
    ],
    correctAnswer: "A",
    explanation: "Co-ownership succeeds when boundaries are clear. Partners must divide domains, sync regularly, and agree on who holds final tie-breaking authority to prevent deadlocks."
  },
  "warmup-2-3": {
    question: "What problems happen when nobody owns a task?",
    options: [
      { key: "A", text: "Tasks fall through the cracks, deadlines are missed, and accountability dissolves into blame." },
      { key: "B", text: "Work finishes faster because anyone can jump in whenever they feel motivated." },
      { key: "C", text: "Budgets automatically decrease because project management overhead is eliminated." }
    ],
    correctAnswer: "A",
    explanation: "When an action item lacks a single named owner, everyone assumes someone else is handling it. Single-point accountability is essential for execution."
  },

  // === Unit 3: Clarifying & Checking Understanding ===
  "warmup-3-1": {
    question: "What should you do when an instruction is unclear?",
    options: [
      { key: "A", text: "Guess the intention, finish the deliverable quietly, and hope for positive feedback." },
      { key: "B", text: "Paraphrase your understanding back to the speaker and ask targeted clarifying questions immediately." },
      { key: "C", text: "Postpone the work until the client notices the delay and clarifies the brief." }
    ],
    correctAnswer: "B",
    explanation: "Paraphrasing ('Just to confirm, are we prioritizing speed or scope for this milestone?') prevents days of wasted rework and demonstrates high professionalism."
  },
  "warmup-3-2": {
    question: "Why do people sometimes pretend they understand?",
    options: [
      { key: "A", text: "Fear of appearing inexperienced, impostor syndrome, or reluctance to challenge authority." },
      { key: "B", text: "Because pretending to understand always solves complex business problems." },
      { key: "C", text: "Corporate standards strictly prohibit asking questions after a presentation." }
    ],
    correctAnswer: "A",
    explanation: "Psychological safety is critical. Top organizations celebrate team members who ask clarifying questions because catching misalignment early protects the entire project."
  },
  "warmup-3-3": {
    question: "What can a small misunderstanding cost a business?",
    options: [
      { key: "A", text: "Scrapped engineering sprints, budget overruns, delayed delivery, and damaged client credibility." },
      { key: "B", text: "Virtually nothing, as commercial contracts ignore project specifications." },
      { key: "C", text: "Only minor font discrepancies in informal internal slide decks." }
    ],
    correctAnswer: "A",
    explanation: "Small misunderstandings compound rapidly over time. A misinterpreted requirement caught in production can cost up to 50 times more than if clarified during kickoff."
  },

  // === Unit 4: Participating In Meetings ===
  "warmup-4-1": {
    question: "What makes business meetings genuinely useful?",
    options: [
      { key: "A", text: "Inviting as many participants as possible and extending the duration past one hour." },
      { key: "B", text: "A clear advance agenda, focused discussion on decisions rather than status reads, and explicit action items." },
      { key: "C", text: "Reviewing slide decks line by line that could have been read asynchronously." }
    ],
    correctAnswer: "B",
    explanation: "Effective meetings exist to debate options, align priorities, and make decisions. Routine updates should be communicated asynchronously in written summaries."
  },
  "warmup-4-2": {
    question: "Why do some team members speak very little in team syncs?",
    options: [
      { key: "A", text: "Dominant speakers monopolizing airtime, fear of being judged, or needing processing time." },
      { key: "B", text: "They have zero knowledge or opinions regarding the team's objectives." },
      { key: "C", text: "Company policies usually restrict contributions to the senior-most attendee." }
    ],
    correctAnswer: "A",
    explanation: "Quiet attendees often have valuable strategic insights. Good facilitators actively invite contributions ('Alex, how does this impact your roadmap?') and create space for quiet thinkers."
  },
  "warmup-4-3": {
    question: "Can someone contribute too much in a meeting?",
    options: [
      { key: "A", text: "Yes, monopolizing the conversation crowds out diverse perspectives and reduces team engagement." },
      { key: "B", text: "No, speaking constantly is the only valid metric of leadership and productivity." },
      { key: "C", text: "Only if the speaker is presenting financial numbers." }
    ],
    correctAnswer: "A",
    explanation: "Effective communication is about impact, not airtime. Over-contributing silences peers and slows decision-making. Great leaders listen more than they speak."
  },

  // === Unit 5: Giving Progress Updates ===
  "warmup-5-1": {
    question: "Why do managers ask for regular progress updates?",
    options: [
      { key: "A", text: "To identify blockers early, reallocate resources, and keep broader stakeholders aligned." },
      { key: "B", text: "Solely to micromanage individual employees and test their obedience." },
      { key: "C", text: "Because managers have no other sources of company information." }
    ],
    correctAnswer: "A",
    explanation: "Updates are proactive risk-management tools. Managers need visibility to clear organizational hurdles, unblock team dependencies, and manage executive expectations."
  },
  "warmup-5-2": {
    question: "Is it better to report a problem early or after you solve it?",
    options: [
      { key: "A", text: "Conceal the problem indefinitely and hope leadership never discovers it." },
      { key: "B", text: "Report it early with context, the anticipated impact, and proposed solution options." },
      { key: "C", text: "Wait until the milestone fails completely so management can fix it for you." }
    ],
    correctAnswer: "B",
    explanation: "Bad news does not improve with age. Alerting stakeholders early with potential mitigation paths builds trust and allows leadership to provide support before deadlines slip."
  },
  "warmup-5-3": {
    question: "What information makes an update truly useful?",
    options: [
      { key: "A", text: "A concise 3-part structure: what was achieved, current blockers/risks, and upcoming milestones." },
      { key: "B", text: "A detailed hour-by-hour breakdown of every email sent throughout the week." },
      { key: "C", text: "Vague assurances that everything is 'going great' with no supporting data." }
    ],
    correctAnswer: "A",
    explanation: "Executive updates rely on the 'Done, Blocked, Next' format: highlight completed deliverables, flag blockers needing resolution, and preview key next steps."
  },

  // === Unit 6: Deadlines & Priorities ===
  "warmup-6-1": {
    question: "How do you decide what task to do first when everything seems important?",
    options: [
      { key: "A", text: "Evaluate business impact versus urgency using a framework like the Eisenhower Matrix." },
      { key: "B", text: "Always complete the shortest and easiest task first regardless of strategic impact." },
      { key: "C", text: "Work on whatever request arrived most recently in your inbox." }
    ],
    correctAnswer: "A",
    explanation: "High-performing professionals distinguish between urgent noise and strategic impact. Prioritizing high-impact tasks prevents fire-fighting and drives real progress."
  },
  "warmup-6-2": {
    question: "Can every task truly be labeled as urgent?",
    options: [
      { key: "A", text: "No; when everything is treated as top priority, nothing is prioritized and teams burn out." },
      { key: "B", text: "Yes, every single inbound request is equally critical to the organization." },
      { key: "C", text: "Urgency is determined solely by whoever shouts the loudest in the office." }
    ],
    correctAnswer: "A",
    explanation: "If everything is critical, prioritization has failed. Leaders must make hard choices and explicitly defer low-value tasks to protect team bandwidth for key strategic goals."
  },

  // === Unit 7: Customer Service Conversations ===
  "warmup-7-1": {
    question: "What makes customer service feel premium?",
    options: [
      { key: "A", text: "Empathetic listening, rapid resolution, transparent expectations, and taking ownership." },
      { key: "B", text: "Reading verbatim scripted policy clauses to deflect company responsibility." },
      { key: "C", text: "Transferring the customer between five different departments repeatedly." }
    ],
    correctAnswer: "A",
    explanation: "Customers value empathy and accountability. Acknowledging frustrations warmly and providing realistic solutions turns stressful situations into brand loyalty."
  },
  "warmup-7-2": {
    question: "How can an agent calm an upset customer without making false promises?",
    options: [
      { key: "A", text: "Validate their feelings sincerely, outline concrete next investigation steps, and provide a committed callback time." },
      { key: "B", text: "Promise instant full compensation immediately even if policy prohibits it." },
      { key: "C", text: "Explain that the customer misunderstood the contract and is at fault." }
    ],
    correctAnswer: "A",
    explanation: "Acknowledge the customer's distress ('I completely understand how frustrating this delay is') and commit to process actions ('I am personally escalating this to logistics and will update you by 3 PM')."
  },
  "warmup-7-3": {
    question: "When a delivery error occurs, what is the best immediate response?",
    options: [
      { key: "A", text: "Acknowledge the impact, apologize sincerely for the disruption, and present alternative solutions." },
      { key: "B", text: "Blame third-party logistics couriers and tell the client to contact them directly." },
      { key: "C", text: "Ignore the ticket until the parcel resurfaces in the warehouse." }
    ],
    correctAnswer: "A",
    explanation: "Take ownership on behalf of the business. Clients care about resolution, not internal supply-chain excuses. Offering solutions immediately preserves goodwill."
  },

  // === Unit 8: Mistakes & Professional Apologies ===
  "warmup-8-1": {
    question: "What is the primary difference between a professional explanation and an excuse?",
    options: [
      { key: "A", text: "An explanation takes ownership and focuses on corrective remedies, while an excuse shifts blame." },
      { key: "B", text: "An excuse is longer and uses more technical jargon to confuse the listener." },
      { key: "C", text: "There is no difference; professionals should never acknowledge mistakes." }
    ],
    correctAnswer: "A",
    explanation: "An explanation provides objective root-cause context while retaining full accountability and proposing preventive safeguards. Excuses seek to evade responsibility."
  },
  "warmup-8-2": {
    question: "Why is it crucial to admit mistakes immediately rather than hoping they won't be noticed?",
    options: [
      { key: "A", text: "Early disclosure limits damage, allows collaborative correction, and strengthens personal integrity." },
      { key: "B", text: "It ensures you are immediately penalized before the project concludes." },
      { key: "C", text: "Clients prefer dealing with frequent mistakes over successful deliverables." }
    ],
    correctAnswer: "A",
    explanation: "Concealed errors almost always surface later with exponentially higher financial and reputational damage. Proactive admission demonstrates maturity and builds trust."
  },

  // === Unit 9: Teamwork & Asking For Help ===
  "warmup-9-1": {
    question: "Why do professionals often avoid asking for help when overloaded?",
    options: [
      { key: "A", text: "Fear of being perceived as incompetent or burdening already busy teammates." },
      { key: "B", text: "Because asking for help is strictly prohibited in modern agile frameworks." },
      { key: "C", text: "Every professional can complete unlimited workload without assistance." }
    ],
    correctAnswer: "A",
    explanation: "Vulnerability can feel risky, but struggling in silence jeopardizes deadlines. High-performing teams view asking for help as a sign of dedication to overall project success."
  },
  "warmup-9-2": {
    question: "How do you balance individual ownership with asking teammates for support?",
    options: [
      { key: "A", text: "Investigate first, formulate specific questions or options, and ask for targeted assistance rather than dumping the task." },
      { key: "B", text: "Immediately hand over any difficult problem to someone senior without attempting it." },
      { key: "C", text: "Never ask for help under any circumstances, even if a project crashes." }
    ],
    correctAnswer: "A",
    explanation: "Targeted asks ('I analyzed options A and B; could I get 10 minutes of your advice on edge cases?') respect teammates' time while demonstrating personal initiative."
  },
  "warmup-9-3": {
    question: "What makes an offer of help effective rather than intrusive?",
    options: [
      { key: "A", text: "Offering specific, bounded assistance ('Can I draft the summary table for your review?') rather than vague platitudes." },
      { key: "B", text: "Criticizing how the colleague is working and taking the entire laptop from them." },
      { key: "C", text: "Announcing publicly in front of executive managers that your peer is struggling." }
    ],
    correctAnswer: "A",
    explanation: "Vague offers like 'Let me know if you need anything' rarely get taken up. Concrete, respectful offers of defined tasks make it safe and easy for peers to accept support."
  },

  // === Unit 10: Pitching A Simple Business Idea ===
  "warmup-10-1": {
    question: "What makes a business idea easy to grasp in less than one minute?",
    options: [
      { key: "A", text: "A sharp hook identifying the customer pain point, your clear solution, and the measurable business outcome." },
      { key: "B", text: "Reciting complex system architecture diagrams and financial balance sheets in rapid succession." },
      { key: "C", text: "Using buzzwords like 'synergistic paradigm' without explaining what the product does." }
    ],
    correctAnswer: "A",
    explanation: "Great elevator pitches connect immediately: 'Who is suffering, what is the pain, how does our solution fix it, and what is the commercial opportunity?'"
  },
  "warmup-10-2": {
    question: "Why do pitches fail when they focus on features instead of customer problems?",
    options: [
      { key: "A", text: "Investors and customers buy solutions to their specific problems, not technical features in isolation." },
      { key: "B", text: "Features are proprietary secrets that should never be mentioned in business." },
      { key: "C", text: "Customers prefer purchasing products that have no features at all." }
    ],
    correctAnswer: "A",
    explanation: "Features describe what a product does; benefits describe what the customer achieves. Focusing on outcomes and customer value creates compelling resonance."
  },
  "warmup-10-3": {
    question: "How should you handle initial skepticism when proposing a new concept?",
    options: [
      { key: "A", text: "Welcome the skepticism, validate their concern, and share pilot data or small low-risk experiments." },
      { key: "B", text: "Argue aggressively with the skeptic until they surrender out of fatigue." },
      { key: "C", text: "Immediately abandon the proposal and apologize for bringing it up." }
    ],
    correctAnswer: "A",
    explanation: "Skepticism is an opportunity to stress-test your idea. Acknowledging valid risks ('That is a fair concern regarding implementation time') and proposing a small pilot de-risks the proposal."
  },

  // === Unit 11: Effective Meetings ===
  "warmup-11-1": {
    question: "Should every business meeting have a designated chair or facilitator?",
    options: [
      { key: "A", text: "Yes; a facilitator keeps discussions focused on the agenda, tracks time, and ensures balanced participation." },
      { key: "B", text: "No; meetings function best when everyone speaks spontaneously without any timekeeper." },
      { key: "C", text: "Only when external legal counsel is physically present in the boardroom." }
    ],
    correctAnswer: "A",
    explanation: "Without a designated chair, meetings drift into tangential discussions, quiet attendees get sidelined, and decisions get delayed. A chair ensures rigor and accountability."
  },
  "warmup-11-2": {
    question: "How should a meeting chair handle discussions that veer off-topic?",
    options: [
      { key: "A", text: "Politely intervene, park the idea in a 'parking lot' for future review, and guide the group back to the agenda." },
      { key: "B", text: "Allow the tangent to consume the remaining 45 minutes of the meeting." },
      { key: "C", text: "Mute the speaker without explanation and abruptly disconnect the call." }
    ],
    correctAnswer: "A",
    explanation: "The 'parking lot' method respects the speaker's idea while protecting the meeting's primary objective: 'That is a valuable point; let us capture it in the parking lot and return to our core decision.'"
  },
  "warmup-11-3": {
    question: "What essential alignment must be agreed upon before any meeting concludes?",
    options: [
      { key: "A", text: "Clear decisions made, agreed action items with single named owners, and committed due dates." },
      { key: "B", text: "A general verbal agreement that the conversation was enjoyable." },
      { key: "C", text: "Scheduling another meeting immediately to re-discuss the exact same agenda." }
    ],
    correctAnswer: "A",
    explanation: "A meeting without documented next steps was merely a conversation. The final 5 minutes should always be reserved for confirming: Who is doing What by When."
  },

  // === Unit 12: Feedback ===
  "warmup-12-1": {
    question: "Why do managers and colleagues sometimes avoid giving honest feedback?",
    options: [
      { key: "A", text: "Fear of hurting feelings, causing interpersonal conflict, or defensive reactions." },
      { key: "B", text: "Because professional employees never have areas for performance improvement." },
      { key: "C", text: "Honest feedback is illegal in modern corporate environments." }
    ],
    correctAnswer: "A",
    explanation: "Avoiding feedback harms growth. Reframing feedback as a collaborative coaching tool focused on future success helps overcome discomfort and drives continuous improvement."
  },
  "warmup-12-2": {
    question: "Should positive feedback be as specific as constructive criticism?",
    options: [
      { key: "A", text: "Yes; specific praise ('Your data analysis in slide 4 clarified the ROI') reinforces exact positive behaviors." },
      { key: "B", text: "No; a generic 'good job' is always superior to detailed feedback." },
      { key: "C", text: "Positive feedback should only be given once every five years." }
    ],
    correctAnswer: "A",
    explanation: "Generic praise feels hollow. Pinpointing exactly what was done well and the positive impact it created reinforces excellence and boosts motivation."
  },

  // === Unit 13: Workplace Conflict ===
  "warmup-13-1": {
    question: "What usually turns professional disagreement into destructive workplace conflict?",
    options: [
      { key: "A", text: "Personalizing the debate, making assumptions about intentions, and defensive communication." },
      { key: "B", text: "Using spreadsheets with too many rows of accurate financial data." },
      { key: "C", text: "Having clear and transparent organizational goals." }
    ],
    correctAnswer: "A",
    explanation: "Disagreement on ideas (cognitive conflict) is healthy and innovative; conflict on personal character or motives (affective conflict) destroys morale and collaboration."
  },
  "warmup-13-2": {
    question: "Is avoiding conflict ever a useful strategy?",
    options: [
      { key: "A", text: "Temporarily, when emotions are running too high to hold a rational discussion, but the underlying issue must still be addressed." },
      { key: "B", text: "Yes, permanent avoidance always eliminates workplace problems naturally." },
      { key: "C", text: "Never; every single minor disagreement must escalate to executive arbitration immediately." }
    ],
    correctAnswer: "A",
    explanation: "A temporary tactical pause allows tempers to cool, but permanent avoidance causes resentment to fester. Issues must be revisited calmly and constructively."
  },
  "warmup-13-3": {
    question: "What is harder: solving the operational issue or repairing the working relationship?",
    options: [
      { key: "A", text: "Repairing the relationship, because rebuilt trust requires time, sustained vulnerability, and consistent actions." },
      { key: "B", text: "Solving the operational issue, because software code is emotionally sensitive." },
      { key: "C", text: "Both are equally trivial once an email is dispatched." }
    ],
    correctAnswer: "A",
    explanation: "Processes and code can be updated in hours, but broken relational trust can linger for months. Restoring psychological safety demands intentional, respectful effort."
  },

  // === Unit 14: Negotiating Agreements ===
  "warmup-14-1": {
    question: "Should you reveal your core priorities early in a commercial negotiation?",
    options: [
      { key: "A", text: "Share underlying interests and priorities strategically to explore trade-offs, while keeping bottom-line reservation points protected." },
      { key: "B", text: "Conceal all information completely and refuse to state what your company needs." },
      { key: "C", text: "Reveal your maximum budget and minimum price in the first five seconds." }
    ],
    correctAnswer: "A",
    explanation: "Principled negotiation thrives on interest disclosure: sharing what matters most allows creative package deals (e.g. trading flexible delivery for favorable pricing)."
  },
  "warmup-14-2": {
    question: "What makes a negotiation concession strategically valuable?",
    options: [
      { key: "A", text: "It costs your organization relatively little to provide, but delivers high perceived value to the counterpart." },
      { key: "B", text: "Giving away your primary revenue stream for zero return." },
      { key: "C", text: "Making concessions without ever asking for anything in return." }
    ],
    correctAnswer: "A",
    explanation: "Asymmetric value is the heart of smart bargaining: find currencies that are cheap for you to give but high value for the other party, and always conditionalize concessions ('If we agree to X, we need Y')."
  },

  // === Unit 15: Building Buy In ===
  "warmup-15-1": {
    question: "Is empirical evidence and data alone enough to persuade stakeholders?",
    options: [
      { key: "A", text: "No; people make decisions based on emotion, organizational incentives, and risk perception alongside data." },
      { key: "B", text: "Yes; human beings are completely rational and ignore personal motivations." },
      { key: "C", text: "Data is useless in business; decisions are made purely on coin tosses." }
    ],
    correctAnswer: "A",
    explanation: "Data informs the intellect, but narrative and empathy move people to action. Persuasion requires showing how your proposal protects their goals and solves their daily pain."
  },
  "warmup-15-2": {
    question: "How should you adapt your message for different stakeholder audiences?",
    options: [
      { key: "A", text: "Tailor the focus: executives want strategic ROI and risk mitigation; engineers want technical feasibility; operations want workflow impact." },
      { key: "B", text: "Present the exact same technical 80-page slide deck to every group without alteration." },
      { key: "C", text: "Change the project's core truth and make contradictory promises to different departments." }
    ],
    correctAnswer: "A",
    explanation: "Executive communication speaks the language of the listener. Frame your narrative around the metrics each stakeholder group is held accountable for."
  },

  // === Unit 16: Consultative Sales ===
  "warmup-16-1": {
    question: "Why can pitching product features too early reduce sales conversion?",
    options: [
      { key: "A", text: "It prevents you from diagnosing the client's actual pain points, making the pitch feel generic and pushy." },
      { key: "B", text: "Because clients already memorize all competing product manuals." },
      { key: "C", text: "Sales cycles should never discuss product features under any circumstance." }
    ],
    correctAnswer: "A",
    explanation: "Prescription before diagnosis is malpractice in sales. Asking probing discovery questions first establishes trusted advisor status before positioning tailored solutions."
  },
  "warmup-16-2": {
    question: "What is the crucial difference between a feature and a benefit?",
    options: [
      { key: "A", text: "A feature is what the product has or does; a benefit is the specific value, time saved, or revenue the client gains." },
      { key: "B", text: "A feature is expensive, while a benefit is always free of charge." },
      { key: "C", text: "There is no difference; both terms mean software source code." }
    ],
    correctAnswer: "A",
    explanation: "'Our cloud platform has automated backup' is a feature; 'Your engineering team will never lose customer data or suffer downtime' is the compelling benefit."
  },

  // === Unit 17: Brand Positioning ===
  "warmup-17-1": {
    question: "What makes a corporate brand memorable in a crowded marketplace?",
    options: [
      { key: "A", text: "A distinct, consistent point of view, unmistakable visual identity, and delivering on an authentic promise." },
      { key: "B", text: "Copying the exact slogan, color scheme, and pricing of the market leader." },
      { key: "C", text: "Running confusing advertisements that leave the customer unsure what is being sold." }
    ],
    correctAnswer: "A",
    explanation: "Memorable brands stand for something specific. They carve out a clear conceptual position in the customer's mind and fulfill that promise reliably."
  },
  "warmup-17-2": {
    question: "Can a product truly be designed for 'everyone'?",
    options: [
      { key: "A", text: "No; trying to appeal to everyone dilutes your value proposition and resonates with no one." },
      { key: "B", text: "Yes; all consumer goods should target all 8 billion humans simultaneously." },
      { key: "C", text: "Targeting specific niches is illegal under fair competition laws." }
    ],
    correctAnswer: "A",
    explanation: "If you speak to everyone, you speak to no one. Strong positioning requires choosing who you are for, and crucially, who you are NOT for."
  },

  // === Unit 18: Recruitment Interviews ===
  "warmup-18-1": {
    question: "Can charismatic and confident candidates sometimes be overrated during interviews?",
    options: [
      { key: "A", text: "Yes; superficial charm can mask a lack of depth, teamwork ability, or genuine technical competence." },
      { key: "B", text: "No; charisma is the sole predictor of executive job performance." },
      { key: "C", text: "Quiet or thoughtful candidates should be disqualified immediately." }
    ],
    correctAnswer: "A",
    explanation: "Interviewers frequently suffer from confidence bias. Structured, competency-based behavioral questions and work sample tests predict job success far better than charisma."
  },
  "warmup-18-2": {
    question: "Should traditional unstructured interviews be the primary hiring method?",
    options: [
      { key: "A", text: "No; combining structured interviews with objective work simulations, skills assessments, and reference checks is far more reliable." },
      { key: "B", text: "Yes; gut instinct in a 15-minute chat is 100% foolproof." },
      { key: "C", text: "Hiring decisions should be outsourced entirely to automated coin flips." }
    ],
    correctAnswer: "A",
    explanation: "Unstructured chat interviews are notoriously prone to affinity bias. Standardized rubrics and practical problem-solving tasks yield vastly higher hiring accuracy."
  },

  // === Unit 19: Hybrid Teamwork ===
  "warmup-19-1": {
    question: "What is the single biggest communication risk in a hybrid work environment?",
    options: [
      { key: "A", text: "Information silos forming between co-located office workers and remote colleagues, creating two-tier knowledge." },
      { key: "B", text: "Having too many digital document backups in the cloud." },
      { key: "C", text: "Using noise-canceling headphones during deep focus hours." }
    ],
    correctAnswer: "A",
    explanation: "Hybrid friction emerges when hallway conversations exclude remote peers. Documentation must be digital-first and transparent to maintain equal footing for all."
  },
  "warmup-19-2": {
    question: "Should every team member be forced to follow the exact same rigid hybrid schedule?",
    options: [
      { key: "A", text: "Focus on agreed anchor days for collaborative workshops, while allowing flexibility for individual deep-work focus." },
      { key: "B", text: "Mandate clock-in surveillance software to monitor employee keystrokes every second." },
      { key: "C", text: "Never meet in person under any circumstance, even for annual strategy planning." }
    ],
    correctAnswer: "A",
    explanation: "The best hybrid cultures balance autonomy with intentional togetherness: team members gather on set days for collaborative design and whiteboarding, enjoying focus time at home."
  },

  // === Unit 20: Project Tradeoffs ===
  "warmup-20-1": {
    question: "Can an enterprise project be delivered fast, cheap, and with high quality simultaneously?",
    options: [
      { key: "A", text: "No; the 'Iron Triangle' requires balancing constraints: adjusting one constraint inevitably impacts the other two." },
      { key: "B", text: "Yes; skilled managers can achieve maximum speed, minimum budget, and perfection on every sprint." },
      { key: "C", text: "Quality does not matter as long as the delivery date is met." }
    ],
    correctAnswer: "A",
    explanation: "The project management Iron Triangle (Scope, Cost, Time) is universal. If leadership accelerates the timeline, either budget must increase or scope must be pruned."
  },
  "warmup-20-2": {
    question: "When an unexpected delay occurs, what should be evaluated first?",
    options: [
      { key: "A", text: "Identify non-critical scope that can be deferred or phased, protecting core quality and key launch dates." },
      { key: "B", text: "Force the team to work 24 hours a day until someone burns out." },
      { key: "C", text: "Conceal the delay from clients and pretend the project is on track." }
    ],
    correctAnswer: "A",
    explanation: "Scope de-scoping is usually the healthiest lever. Releasing a high-quality Minimum Viable Product on time beats launching a buggy, bloated release late."
  },
  "warmup-20-3": {
    question: "How do you communicate a difficult project trade-off to external clients without losing trust?",
    options: [
      { key: "A", text: "Be transparent early, provide clear data on trade-offs, and frame options around protecting their core business outcome." },
      { key: "B", text: "Send a terse one-line email canceling the contract without explanation." },
      { key: "C", text: "Blame individual junior developers and disavow company responsibility." }
    ],
    correctAnswer: "A",
    explanation: "Clients respect transparent partnership: 'To safeguard your high-traffic launch on Black Friday, we recommend phasing feature Y to sprint 6 to ensure 100% uptime for core checkout.'"
  },

  // === Unit 21: Leadership Styles ===
  "warmup-21-1": {
    question: "Can the same leadership style succeed with one team and fail with another?",
    options: [
      { key: "A", text: "Yes; situational leadership requires adapting style based on team maturity, domain ambiguity, and organizational context." },
      { key: "B", text: "No; one rigid leadership style works identically across all teams and industries." },
      { key: "C", text: "Leadership style has zero correlation with team performance." }
    ],
    correctAnswer: "A",
    explanation: "A high-direction style that steadies an inexperienced squad will frustrate a senior team of specialists. Great leaders diagnose context and adapt dynamically."
  },
  "warmup-21-2": {
    question: "When does executive decisiveness cross the line into destructive control?",
    options: [
      { key: "A", text: "When leaders stop listening to dissenting evidence, micromanage execution, and punish feedback." },
      { key: "B", text: "Whenever a leader makes a firm decision following consultation." },
      { key: "C", text: "Decisiveness can never have negative consequences in business." }
    ],
    correctAnswer: "A",
    explanation: "Decisiveness provides momentum; authoritarian control stifles innovation. Leaders must remain firm on strategic destination while empowering teams on execution."
  },

  // === Unit 22: Management Conversations ===
  "warmup-22-1": {
    question: "Why do managers often postpone difficult performance conversations?",
    options: [
      { key: "A", text: "Discomfort with emotional reactions, fear of damaging rapport, and lack of structured feedback frameworks." },
      { key: "B", text: "Because underperformance always fixes itself if left ignored." },
      { key: "C", text: "Corporate guidelines mandate waiting at least three years before offering feedback." }
    ],
    correctAnswer: "A",
    explanation: "Delaying feedback only compounds problems and is unfair to the employee. Clear, empathetic, and timely conversations show genuine investment in their growth."
  },
  "warmup-22-2": {
    question: "Does excessive diplomacy and softening often obscure the actual message being delivered?",
    options: [
      { key: "A", text: "Yes; the 'feedback sandwich' often leaves employees confused about whether they did well or need urgent improvement." },
      { key: "B", text: "No; burying criticism in ten compliments is the only polite way to manage." },
      { key: "C", text: "Diplomacy always guarantees 100% immediate behavioral change." }
    ],
    correctAnswer: "A",
    explanation: "Clarity is kindness. Softening a serious message with excessive praise obscures the urgency. Be direct, respectful, and crystal clear on expectations."
  },
  "warmup-22-3": {
    question: "How do you maintain fairness when addressing an individual performance block?",
    options: [
      { key: "A", text: "Focus objectively on observed behaviors and measurable impact, listen to root causes, and agree on clear support milestones." },
      { key: "B", text: "Rely on office rumors and make sweeping assumptions about their character." },
      { key: "C", text: "Publicly shame the employee in the company-wide chat." }
    ],
    correctAnswer: "A",
    explanation: "Separate the person from the performance. Anchor the discussion on specific observed instances, invite their perspective, and co-design a measurable roadmap for success."
  },

  // === Unit 23: Organisational Change ===
  "warmup-23-1": {
    question: "Is employee resistance to organizational change usually irrational?",
    options: [
      { key: "A", text: "No; resistance is typically a rational response to loss of autonomy, unfamiliarity, or poorly communicated rationale." },
      { key: "B", text: "Yes; employees resist purely out of spite for the company." },
      { key: "C", text: "Change resistance only occurs when salaries are doubled." }
    ],
    correctAnswer: "A",
    explanation: "People do not resist change; they resist being changed without consultation. Understanding their legitimate concerns is the first step toward effective change management."
  },
  "warmup-23-2": {
    question: "What critical information do employees need before they will genuinely support change?",
    options: [
      { key: "A", text: "The compelling 'why', how it affects their daily role, what training will be provided, and what success looks like." },
      { key: "B", text: "Just a top-down mandate stating that compliance is mandatory by Monday." },
      { key: "C", text: "Zero information so that the change remains an exciting surprise." }
    ],
    correctAnswer: "A",
    explanation: "Change fails without emotional buy-in. Leaders must over-communicate the purpose behind the transition and provide tangible scaffolding and training."
  },

  // === Unit 24: Cross Cultural Communication ===
  "warmup-24-1": {
    question: "Can broad cultural guidebooks sometimes inadvertently increase stereotyping?",
    options: [
      { key: "A", text: "Yes; applying broad national generalizations can blind professionals to individual nuances, corporate culture, and personal styles." },
      { key: "B", text: "No; every person from a given country behaves in 100% identical ways." },
      { key: "C", text: "Culture plays zero role in international business negotiations." }
    ],
    correctAnswer: "A",
    explanation: "Cultural frameworks provide helpful archetypes (e.g. high-context vs low-context), but they must be applied with humility and openness to individual variation."
  },
  "warmup-24-2": {
    question: "How should you respond when an international colleague's behavior feels abrupt or rude?",
    options: [
      { key: "A", text: "Pause and assume positive intent: consider whether direct communication norms or language differences explain the delivery." },
      { key: "B", text: "Retaliate immediately with aggressive hostility." },
      { key: "C", text: "Report them to international tribunals for breach of etiquette." }
    ],
    correctAnswer: "A",
    explanation: "In cross-cultural work, attribute misunderstandings to communication conventions before malicious intent. Direct cultures value brevity; indirect cultures value diplomatic phrasing."
  },

  // === Unit 25: Influencing Without Authority ===
  "warmup-25-1": {
    question: "Why is having a logically superior idea rarely enough to gain cross-functional cooperation?",
    options: [
      { key: "A", text: "Other teams have competing priorities, limited resources, and distinct departmental incentives." },
      { key: "B", text: "Because other departments intentionally try to harm company performance." },
      { key: "C", text: "Logic has been banned in modern corporate management." }
    ],
    correctAnswer: "A",
    explanation: "Lateral influence requires finding the 'WIIFM' (What's In It For Me) for the other department. Align your proposal with their core quarterly OKRs to secure genuine commitment."
  },
  "warmup-25-2": {
    question: "When trying to build a coalition for a new initiative, who is strategically easiest to influence first?",
    options: [
      { key: "A", text: "Open-minded neutral colleagues and natural innovators who can become visible champions." },
      { key: "B", text: "The most vocal, entrenched opponent in the executive committee." },
      { key: "C", text: "People who have already resigned from the company." }
    ],
    correctAnswer: "A",
    explanation: "Do not waste initial momentum trying to convert hardened cynics. Build social proof and momentum with curious fence-sitters and early adopters first."
  },

  // === Unit 26: Business Ethics ===
  "warmup-26-1": {
    question: "Who holds responsibility for ethical standards in an organization?",
    options: [
      { key: "A", text: "Every employee at all levels, guided by executive tone-at-the-top, psychological safety, and clear governance." },
      { key: "B", text: "Exclusively the compliance department when an audit is conducted." },
      { key: "C", text: "Only external regulatory bodies after a scandal occurs." }
    ],
    correctAnswer: "A",
    explanation: "Ethics is an everyday cultural behavior, not just a policy document. Leaders must model ethical courage and reward employees who raise concerns."
  },
  "warmup-26-2": {
    question: "Can an enterprise afford to choose an ethical but more costly business practice?",
    options: [
      { key: "A", text: "Yes; ethical integrity protects long-term brand equity, customer trust, and avoids catastrophic regulatory fines." },
      { key: "B", text: "No; short-term profit maximization must override all ethical considerations." },
      { key: "C", text: "Ethical decisions are only for non-profit charities." }
    ],
    correctAnswer: "A",
    explanation: "Short-term shortcuts often create systemic liabilities. Sustainable commercial success relies on reputation, talent retention, and institutional credibility."
  },

  // === Unit 27: Ai Workplace ===
  "warmup-27-1": {
    question: "What aspects of workplace decision-making should remain strictly under human judgment?",
    options: [
      { key: "A", text: "Ethical trade-offs, empathetic personnel decisions, creative direction, and accountability for consequences." },
      { key: "B", text: "Basic arithmetic calculations and spreadsheet formatting." },
      { key: "C", text: "Nothing; AI models should make all executive decisions without human oversight." }
    ],
    correctAnswer: "A",
    explanation: "AI accelerates synthesis and pattern matching, but humans must supply moral context, empathy, strategic intuition, and legal/ethical accountability."
  },
  "warmup-27-2": {
    question: "Can an AI tool boost team productivity while simultaneously introducing new organizational risks?",
    options: [
      { key: "A", text: "Yes; risks include data privacy leaks, algorithmic bias, hallucinated facts, and over-reliance on unverified outputs." },
      { key: "B", text: "No; automated software never generates erroneous or biased content." },
      { key: "C", text: "Technology adoption never introduces any operational trade-offs." }
    ],
    correctAnswer: "A",
    explanation: "High-performing organizations adopt AI with clear guardrails: protecting proprietary data, fact-checking outputs, and auditing models for fair representation."
  },

  // === Unit 28: Data Insights ===
  "warmup-28-1": {
    question: "Why do different departments frequently draw opposing conclusions from the same dataset?",
    options: [
      { key: "A", text: "Each department filters data through its own incentives, baseline assumptions, and chosen timeframes." },
      { key: "B", text: "Because numbers randomly change value depending on who opens the file." },
      { key: "C", text: "Only one team is mathematically literate; all other teams are incompetent." }
    ],
    correctAnswer: "A",
    explanation: "Data does not speak for itself; people interpret it. Marketing may celebrate high traffic while Finance flags high customer acquisition costs. Bridging perspectives is key."
  },
  "warmup-28-2": {
    question: "What makes a statistical claim misleading even when the underlying numbers are technically accurate?",
    options: [
      { key: "A", text: "Cherry-picking favorable date ranges, truncating chart axes, or confusing correlation with causation." },
      { key: "B", text: "Writing the numbers in blue ink instead of black ink." },
      { key: "C", text: "Presenting audited figures to a board committee." }
    ],
    correctAnswer: "A",
    explanation: "Context is everything. A '200% increase' could simply mean growing from 1 user to 3 users. Rigorous leaders look for baselines, sample sizes, and counter-metrics."
  },
  "warmup-28-3": {
    question: "How should leaders communicate statistical uncertainty in high-stakes strategic decisions?",
    options: [
      { key: "A", text: "State confidence intervals, highlight key risk assumptions, and outline scenario models (best, expected, worst case)." },
      { key: "B", text: "Feign 100% certainty and guarantee perfection to avoid looking weak." },
      { key: "C", text: "Refuse to show any data and ask everyone to rely purely on instinct." }
    ],
    correctAnswer: "A",
    explanation: "Executive maturity involves speaking probabilistic truth. Transparently discussing confidence bands builds credibility and prepares contingency plans."
  },

  // === Unit 29: Scaling Business ===
  "warmup-29-1": {
    question: "At what point does rapid customer demand become an operational hazard for a business?",
    options: [
      { key: "A", text: "When order volume outpaces fulfillment capacity, degrading quality, crashing support, and burning out staff." },
      { key: "B", text: "When profits exceed investor expectations." },
      { key: "C", text: "High demand is never a risk under any circumstance." }
    ],
    correctAnswer: "A",
    explanation: "Premature scaling is a leading cause of startup failure. Growing sales without scalable infrastructure destroys customer trust and operational stability."
  },
  "warmup-29-2": {
    question: "Can an initial regional market success be instantly replicated across multiple international markets?",
    options: [
      { key: "A", text: "Rarely; different regions require localized pricing, regulatory compliance, cultural nuances, and distribution channels." },
      { key: "B", text: "Always; customer preferences and legal frameworks are identical worldwide." },
      { key: "C", text: "International expansion requires zero capital or localization." }
    ],
    correctAnswer: "A",
    explanation: "Global expansion demands local validation. Products must be adapted for local regulations, consumer habits, payment infrastructure, and cultural expectations."
  },
  "warmup-29-3": {
    question: "How do leaders distinguish between temporary growing pains and fatal structural weaknesses?",
    options: [
      { key: "A", text: "Growing pains resolve as staff is trained and processes mature; structural flaws persist or worsen as volume increases." },
      { key: "B", text: "There is no difference; all challenges indicate immediate bankruptcy." },
      { key: "C", text: "Structural flaws only appear in construction companies." }
    ],
    correctAnswer: "A",
    explanation: "Monitor unit economics and retention. If your customer churn spikes or marginal cost per delivery increases as you scale, you have a structural flaw, not a growing pain."
  },

  // === Unit 30: Crisis Communication ===
  "warmup-30-1": {
    question: "What damages corporate reputation more during a crisis: the operational error or the communication response?",
    options: [
      { key: "A", text: "A defensive, deceptive, or sluggish communication response often destroys far more trust than the initial mistake." },
      { key: "B", text: "The operational error alone; communication has zero bearing on reputation." },
      { key: "C", text: "Stakeholders never care about how corporations handle crises." }
    ],
    correctAnswer: "A",
    explanation: "Mistakes happen in complex systems, but cover-ups and evasive spin destroy stakeholder trust forever. Transparent, accountable communication rescues credibility."
  },
  "warmup-30-2": {
    question: "Why are early communication statements during a crisis so difficult to get right?",
    options: [
      { key: "A", text: "You must communicate rapidly with empathy and accountability while verified facts are still incomplete and evolving." },
      { key: "B", text: "Because all journalists and stakeholders refuse to read corporate statements." },
      { key: "C", text: "Crisis communication is only released after all lawsuits conclude five years later." }
    ],
    correctAnswer: "A",
    explanation: "The golden rule of crisis PR: 'Share what we know, acknowledge what we do not yet know, commit to next updates, and demonstrate immediate care for affected parties.'"
  },

  // === Unit 31: Complex Negotiation ===
  "warmup-31-1": {
    question: "Which sensitive information should remain confidential during multi-party commercial negotiations?",
    options: [
      { key: "A", text: "Your absolute walk-away reservation price, internal cost structures, and non-disclosure client details." },
      { key: "B", text: "Your company name and the names of your negotiation representatives." },
      { key: "C", text: "The industry sector in which your business operates." }
    ],
    correctAnswer: "A",
    explanation: "Protect your reservation value (the least favorable point you will accept). If the other party knows your exact walk-away limit, they will extract all surplus."
  },
  "warmup-31-2": {
    question: "When is making a concession strategically advantageous rather than merely costly?",
    options: [
      { key: "A", text: "When it breaks a critical deadlock, signals collaborative goodwill, and is traded for a reciprocal high-value term." },
      { key: "B", text: "Whenever the counterpart asks for a discount without offering anything in return." },
      { key: "C", text: "Making concessions is always a sign of total organizational surrender." }
    ],
    correctAnswer: "A",
    explanation: "Concessions should never be free gifts. Use conditional phrasing: 'We can consider flexible payment terms if you commit to a multi-year service contract.'"
  },

  // === Unit 32: Stakeholder Trade Offs ===
  "warmup-32-1": {
    question: "Why is the popular executive label 'win-win' sometimes unrealistic in corporate governance?",
    options: [
      { key: "A", text: "Resource scarcity, regulatory mandates, and divergent stakeholder interests often necessitate genuine zero-sum trade-offs." },
      { key: "B", text: "Because all corporate stakeholders share the exact same priorities." },
      { key: "C", text: "Winning is impossible in international commerce." }
    ],
    correctAnswer: "A",
    explanation: "Honest leadership acknowledges trade-offs. Allocating capital to long-term R&D may reduce short-term shareholder dividends; pretending everyone gets 100% breeds cynicism."
  },
  "warmup-32-2": {
    question: "How should leaders make trade-off decisions when competing stakeholder groups have valid, conflicting claims?",
    options: [
      { key: "A", text: "Anchor decisions in core organizational mission, long-term sustainability, transparent criteria, and empathetic explanations." },
      { key: "B", text: "Secretly promise both groups everything they want and resign before implementation." },
      { key: "C", text: "Side with whichever group threatens litigation first." }
    ],
    correctAnswer: "A",
    explanation: "Process fairness matters as much as the outcome. When stakeholders understand the principled criteria behind a tough choice, they are far more likely to accept it."
  },

  // === Unit 33: Pricing Perceived Fairness ===
  "warmup-33-1": {
    question: "Why do consumers accept dynamic pricing for airline tickets but react with outrage to emergency price hikes?",
    options: [
      { key: "A", text: "Context and fairness norms: airline demand-pricing is customary, while surge pricing on essentials in crises feels exploitative." },
      { key: "B", text: "Consumers are irrational and have no awareness of money." },
      { key: "C", text: "Airlines are exempt from economic laws of supply and demand." }
    ],
    correctAnswer: "A",
    explanation: "Fairness perceptions govern pricing power. Pricing perceived as taking advantage of vulnerability or disaster destroys brand equity and triggers regulatory backlash."
  },
  "warmup-33-2": {
    question: "Does transparency alone make an unpopular price increase acceptable to customers?",
    options: [
      { key: "A", text: "Not alone, but explaining the underlying cost increases and reinvestments in quality helps mitigate churn." },
      { key: "B", text: "Yes; customers celebrate every price increase if sent an email." },
      { key: "C", text: "Companies should never communicate price changes and hope customers do not notice invoices." }
    ],
    correctAnswer: "A",
    explanation: "Transparency must be paired with demonstrable customer value. Explain how higher rates fund reliability, infrastructure, or enhanced service to cushion the impact."
  },

  // === Unit 34: Mergers Cultural Integration ===
  "warmup-34-1": {
    question: "Should an acquiring company aggressively replace the target company's culture immediately?",
    options: [
      { key: "A", text: "No; heavy-handed cultural erasure destroys morale, sparks key talent flight, and kills the very value acquired." },
      { key: "B", text: "Yes; all acquired employees must immediately surrender their working styles on day one." },
      { key: "C", text: "Acquired companies should be left completely unintegrated for 50 years." }
    ],
    correctAnswer: "A",
    explanation: "Most M&A deals fail on cultural friction. Smart integrators listen, identify what made the acquired team successful, and build a unified synthesis of both cultures."
  },
  "warmup-34-2": {
    question: "Which operational differences between merged companies should be preserved rather than standardized?",
    options: [
      { key: "A", text: "Unique innovation practices, specialized customer intimacy models, and local operational adaptability." },
      { key: "B", text: "Incompatible accounting software and fragmented payroll tax systems." },
      { key: "C", text: "Duplicate cybersecurity protocols with conflicting firewalls." }
    ],
    correctAnswer: "A",
    explanation: "Standardize back-office infrastructure (finance, IT, compliance) for efficiency, but protect the front-line cultural practices that drive customer loyalty and creativity."
  },

  // === Unit 35: Supply Chain Resilience ===
  "warmup-35-1": {
    question: "How should an enterprise balance supply chain efficiency (Just-in-Time) with resilience (Just-in-Case)?",
    options: [
      { key: "A", text: "Dual-sourcing critical components, maintaining regional safety stocks, and building real-time visibility." },
      { key: "B", text: "Relying on a single lowest-cost supplier on the other side of the planet for all core components." },
      { key: "C", text: "Hoarding 10 years of physical inventory in expensive rented warehouses." }
    ],
    correctAnswer: "A",
    explanation: "Pure cost-minimization creates fragile single points of failure. Resilience requires strategic redundancy, multi-sourcing, and stress-testing supplier contingency plans."
  },
  "warmup-35-2": {
    question: "Which supply-chain risks are historically the hardest for corporate risk teams to model?",
    options: [
      { key: "A", text: "Low-probability, high-impact 'Black Swan' geopolitical events, climate shocks, and multi-tier sub-supplier dependencies." },
      { key: "B", text: "Standard scheduled holiday postal closures." },
      { key: "C", text: "Minor packaging cardboard color variations." }
    ],
    correctAnswer: "A",
    explanation: "Companies often know their direct tier-1 suppliers, but lack visibility into tier-2 and tier-3 raw material bottlenecks until a geopolitical or environmental crisis hits."
  },

  // === Unit 36: Disagreement In The Boardroom ===
  "warmup-36-1": {
    question: "Should a corporate board director publicly support a decision after voting against it in the boardroom?",
    options: [
      { key: "A", text: "Yes; robust debate occurs behind closed doors, but corporate governance requires unified collective responsibility once decided." },
      { key: "B", text: "No; directors should immediately leak confidential boardroom dissent to press journalists." },
      { key: "C", text: "Directors are not permitted to vote in boardroom meetings." }
    ],
    correctAnswer: "A",
    explanation: "Board governance relies on 'dissent vigorously, then commit unified'. Factional public leaks destroy investor confidence and paralyze organizational execution."
  },
  "warmup-36-2": {
    question: "What is the primary distinction between healthy board dissent and destructive disloyalty?",
    options: [
      { key: "A", text: "Healthy dissent tests strategic assumptions for the company's best interest; disloyalty pursues personal agendas or sabotages implementation." },
      { key: "B", text: "Dissent is always treasonous; directors must agree with the CEO 100% of the time." },
      { key: "C", text: "Disloyalty is when a board member arrives five minutes late." }
    ],
    correctAnswer: "A",
    explanation: "A board that always agrees is useless. Directors have a fiduciary duty to challenge CEO assumptions, probe risks, and ensure rigor without malice."
  },

  // === Unit 37: Trust Reputation Corporate Communication ===
  "warmup-37-1": {
    question: "Can an enterprise truly communicate its way out of a severe reputational crisis?",
    options: [
      { key: "A", text: "No; public relations can amplify real operational reform, but words without demonstrable structural changes are dismissed as empty spin." },
      { key: "B", text: "Yes; a clever social media marketing campaign can erase any corporate malfeasance." },
      { key: "C", text: "Reputation has zero connection to what a company actually does." }
    ],
    correctAnswer: "A",
    explanation: "You cannot talk your way out of problems you behaved yourself into. Communication only works when anchored by real operational changes and transparent accountability."
  },
  "warmup-37-2": {
    question: "What concrete evidence do cynical stakeholders need before believing a company's reform is genuine?",
    options: [
      { key: "A", text: "Independent third-party audits, executive compensation tied to ethical metrics, and verifiable milestone benchmarks." },
      { key: "B", text: "A glossy brochure with stock photographs of handshakes." },
      { key: "C", text: "An internal email asking employees to feel more optimistic." }
    ],
    correctAnswer: "A",
    explanation: "Trust is rebuilt when organizations introduce external accountability: third-party monitoring, transparent reporting on failures, and linking leader bonuses to ethical outcomes."
  },

  // === Unit 38: Ai Automation Workforce Redesign ===
  "warmup-38-1": {
    question: "Is preserving obsolete job descriptions always the ethical priority during technological automation?",
    options: [
      { key: "A", text: "Not necessarily; true ethical leadership focuses on investing in worker upskilling, transition support, and redesigning roles toward higher value." },
      { key: "B", text: "Yes; companies should ban computers and return to manual paper ledgers." },
      { key: "C", text: "Employees should be terminated without notice the moment an algorithm is installed." }
    ],
    correctAnswer: "A",
    explanation: "Protecting the worker does not mean freezing obsolete tasks. Responsible transformation pairs technological efficiency with substantial retraining budgets and human-in-the-loop workflows."
  },
  "warmup-38-2": {
    question: "How can leaders ensure that the gains from AI automation are shared equitably across the organization?",
    options: [
      { key: "A", text: "Reinvest productivity dividends into employee skills training, improved working conditions, and rewarding collaborative innovation." },
      { key: "B", text: "Funnel 100% of automation savings into executive bonuses while cutting employee development." },
      { key: "C", text: "Refuse to disclose that automation has reduced operational costs." }
    ],
    correctAnswer: "A",
    explanation: "When automation creates surplus, visionary leaders reinvest in their people: funding continuous education, expanding compensation models, and elevating career trajectories."
  },

  // === Unit 39: Strategy Under Uncertainty ===
  "warmup-39-1": {
    question: "When does delaying an executive decision to gather 'more information' become a dangerous risk itself?",
    options: [
      { key: "A", text: "When market conditions change rapidly and the cost of missed opportunity exceeds the value of incremental data (analysis paralysis)." },
      { key: "B", text: "Waiting for information is never risky; leaders should wait indefinitely." },
      { key: "C", text: "Only when the company's internet connection is disrupted." }
    ],
    correctAnswer: "A",
    explanation: "As Jeff Bezos famously noted, most decisions should be made with around 70% of the information you wish you had. Waiting for 90% usually means you are already late."
  },
  "warmup-39-2": {
    question: "What is the strategic difference between Type 1 (irreversible) and Type 2 (reversible) decisions?",
    options: [
      { key: "A", text: "Type 1 decisions are one-way doors needing exhaustive analysis; Type 2 decisions are two-way doors that should be made quickly by empowered teams." },
      { key: "B", text: "Type 1 decisions are made on Mondays; Type 2 are made on Fridays." },
      { key: "C", text: "There is no difference; all business choices are permanent and irreversible." }
    ],
    correctAnswer: "A",
    explanation: "Velocity comes from classifying decisions correctly. Do not treat easily reversible experimental choices with bureaucratic board-level committees."
  },

  // === Unit 40: Executive Capstone The Company At A Crossroads ===
  "warmup-40-1": {
    question: "Should all diverse stakeholder groups receive the exact same communication during a major corporate crisis?",
    options: [
      { key: "A", text: "The core truth and values must remain consistent, but emphasis should be tailored to address the distinct concerns of each group." },
      { key: "B", text: "Lie to shareholders while telling the complete truth to customer support." },
      { key: "C", text: "Publish an identical 200-page regulatory filing to social media consumers." }
    ],
    correctAnswer: "A",
    explanation: "Consistency of truth is paramount, but relevance requires framing: employees need to understand job security; investors need cash-flow impact; customers need service continuity."
  },
  "warmup-40-2": {
    question: "How should executive leaders navigate situations where no strategic option is clearly best and all carry significant risk?",
    options: [
      { key: "A", text: "Evaluate choices against core institutional values, de-risk with staged commitments, communicate transparently, and lead with steady resolve." },
      { key: "B", text: "Paralyze the organization by refusing to decide anything." },
      { key: "C", text: "Abdicate leadership and let external commentators make the choice." }
    ],
    correctAnswer: "A",
    explanation: "True executive leadership begins when there are no easy answers. Leaders synthesize imperfect data, align behind core principles, take accountability, and execute decisively."
  }
};

console.log(`Configured multiple-choice warm-up data for ${Object.keys(WARMUP_MCQ_DATA).length} prompts.`);

// Update catalog
let updatedCount = 0;
for (const unit of catalog) {
  if (!unit.warmup || !Array.isArray(unit.warmup.prompts)) continue;

  const newPrompts = [];
  for (const prompt of unit.warmup.prompts) {
    const mcq = WARMUP_MCQ_DATA[prompt.id];
    if (mcq) {
      newPrompts.push({
        id: prompt.id,
        question: mcq.question,
        hint: prompt.hint || "Choose the most effective workplace approach.",
        options: mcq.options,
        correctAnswer: mcq.correctAnswer,
        explanation: mcq.explanation,
      });
      updatedCount++;
    }
  }

  unit.warmup.prompts = newPrompts;
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n", "utf8");
console.log(`Successfully updated ${updatedCount} warmup prompts in ${catalogPath}`);
