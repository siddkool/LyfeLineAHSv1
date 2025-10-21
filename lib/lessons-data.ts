import type { Lesson } from "./types"

export const LESSONS: Lesson[] = [
  // Health Category
  {
    id: "health-1",
    title: "Understanding Nicotine Addiction",
    category: "health",
    description: "Learn how nicotine affects your brain and body",
    content: `Nicotine is one of the most addictive substances known to science. When you vape, nicotine reaches your brain in just 10-20 seconds, hijacking your brain's reward system by triggering massive dopamine release.

**The Addiction Timeline:**

• **Week 1-2:** Experimentation phase - feels harmless
• **Week 3-4:** Daily use begins, mild cravings develop  
• **Month 2-3:** Can't go hours without vaping, tolerance builds
• **Month 4+:** Full addiction - life revolves around vaping

**Physical Effects:**

• Increased heart rate and blood pressure
• Reduced lung capacity and chronic cough
• Weakened immune system
• Disrupted sleep and energy levels
• Digestive issues

**Mental Effects:**

• Anxiety between vaping sessions
• Mood swings tied to nicotine levels
• Difficulty concentrating without nicotine
• Depression symptoms can worsen

**Why Teens Are More Vulnerable:**

Adolescent brains are still developing and form stronger neural pathways, making addiction more likely and harder to break. One JUUL pod contains as much nicotine as 20 cigarettes, and 40% of teen vapers didn't even know their product contained nicotine.

Remember: Addiction isn't weakness - nicotine is incredibly powerful. The best way to avoid addiction is never to start.`,
    difficulty: "beginner",
    pointsReward: 100,
    estimatedMinutes: 5,
  },
  {
    id: "health-2",
    title: "Lung Health and Vaping",
    category: "health",
    description: "Discover how vaping impacts your respiratory system",
    content: `Your lungs are designed to breathe clean air, not chemical-filled vapor. Vaping exposes your respiratory system to harmful substances that can cause both immediate and long-term damage.

**Short-Term Effects:**

• Throat and lung irritation
• Coughing and wheezing
• Shortness of breath
• Chest tightness

**Long-Term Risks:**

• EVALI (vaping-associated lung injury)
• Chronic bronchitis
• Reduced lung function
• Increased respiratory infections

**What You're Really Inhaling:**

When you vape, you're breathing in ultrafine particles that penetrate deep into your lungs, along with heavy metals like nickel, tin, and lead. Volatile organic compounds and flavoring chemicals damage lung tissue over time.

**The Good News:**

Your lungs have an amazing ability to heal when you stop exposing them to harmful substances. It's never too late to quit and give your respiratory system a chance to recover.`,
    difficulty: "beginner",
    pointsReward: 100,
    estimatedMinutes: 3,
  },
  {
    id: "health-3",
    title: "Brain Development and Teen Vaping",
    category: "health",
    description: "Why vaping is especially harmful for developing brains",
    content: `Your brain continues developing until around age 25. Nicotine exposure during this critical time can cause lasting damage that affects you for life.

**How Nicotine Impacts Teen Brains:**

• Disrupts brain circuits controlling attention and learning
• Affects mood regulation and impulse control
• Increases risk of future addiction to other substances
• Can lead to permanent cognitive impairment

**Brain Areas Affected:**

• **Prefrontal Cortex:** Controls decision-making and planning
• **Hippocampus:** Manages memory and learning
• **Reward Pathways:** Regulates motivation and pleasure

**Academic Consequences:**

Students who vape often experience difficulty concentrating in class, memory problems that affect test performance, reduced ability to learn new information, and increased mental health issues.

**The Science:**

Nicotine primes the adolescent brain for addiction by permanently changing how brain cells communicate. These changes make future addiction more likely and can last a lifetime.

Protecting your developing brain now sets you up for success later. Don't let nicotine steal your potential.`,
    difficulty: "intermediate",
    pointsReward: 150,
    estimatedMinutes: 4,
  },
  {
    id: "health-4",
    title: "Heart Health Risks",
    category: "health",
    description: "How vaping affects your cardiovascular system",
    content: `Vaping puts significant stress on your heart and blood vessels, even in young, healthy people.

**Immediate Effects:**

• Heart rate jumps 10-15 beats per minute
• Elevated blood pressure
• Constricted blood vessels
• Reduced oxygen delivery to organs

**Long-Term Risks:**

• Increased risk of heart attack
• Higher chance of stroke
• Arterial stiffness and damage
• Irregular heartbeat

**Why This Happens:**

Nicotine triggers your body's "fight or flight" response, releasing adrenaline that makes your heart work harder and narrows blood vessels, reducing blood flow throughout your body.

**Youth at Risk:**

Even young, healthy people can experience serious cardiovascular problems from vaping. Heart attacks in teens who vape have been documented and are becoming more common.

Your heart is designed to last a lifetime. Don't put unnecessary stress on this vital organ that keeps you alive.`,
    difficulty: "intermediate",
    pointsReward: 150,
    estimatedMinutes: 3,
  },

  // Science Category
  {
    id: "science-1",
    title: "What's Really in Your Vape?",
    category: "science",
    description: "Breaking down the chemicals in vape juice",
    content: `Vape juice contains a complex mixture of chemicals you're inhaling directly into your lungs. Just because something is safe to eat doesn't mean it's safe to inhale.

**Main Ingredients:**

**Propylene Glycol (PG):**
Creates the "throat hit" sensation. While safe for eating, it's not meant for inhaling and causes respiratory irritation. When heated, it breaks down into toxic compounds.

**Vegetable Glycerin (VG):**
Creates the vapor clouds. Long-term effects of inhaling it are unknown, but it can cause airway inflammation.

**Nicotine:**
Highly addictive stimulant that raises blood pressure and heart rate while damaging developing brains.

**Flavorings:**
Thousands of different chemicals are used for flavoring. Many are safe to eat but dangerous to inhale. Diacetyl is linked to serious lung disease, and cinnamaldehyde damages lung cells.

**Hidden Dangers:**

• Heavy metals from heating coils (lead, nickel, chromium)
• Formaldehyde (carcinogen) formed when heated
• Acrolein (used in weed killer)
• Benzene (linked to cancer)

The chemicals in vape juice become even more dangerous when heated and inhaled into your lungs.`,
    difficulty: "beginner",
    pointsReward: 100,
    estimatedMinutes: 4,
  },
  {
    id: "science-2",
    title: "How Vaping Devices Work",
    category: "science",
    description: "The technology behind e-cigarettes",
    content: `Understanding how vaping devices work helps you understand the risks involved.

**Basic Components:**

• **Battery:** Powers the device, can overheat or explode if damaged
• **Heating Element:** Metal coil reaching 200-400°F, degrades over time releasing metal particles
• **E-liquid Reservoir:** Holds vape juice, can leak causing nicotine poisoning
• **Mouthpiece:** Where you inhale, can harbor bacteria

**The Vaping Process:**

1. Battery activates heating coil
2. Coil heats e-liquid to create aerosol
3. User inhales aerosol into lungs
4. Chemicals absorbed into bloodstream

**Temperature Matters:**

Higher temperatures create more harmful chemicals. "Sub-ohm" vaping produces significantly more toxic compounds than standard vaping.

**Device Dangers:**

• Battery explosions causing serious injuries
• Overheating can cause burns
• Faulty devices deliver inconsistent nicotine doses
• Counterfeit devices contain unknown substances

What you're inhaling isn't harmless water vapor - it's an aerosol of fine particles and chemicals that can damage your lungs.`,
    difficulty: "intermediate",
    pointsReward: 150,
    estimatedMinutes: 4,
  },
  {
    id: "science-3",
    title: "Nicotine Absorption and Metabolism",
    category: "science",
    description: "How your body processes nicotine",
    content: `Understanding nicotine's journey through your body reveals why it's so addictive and hard to quit.

**The Nicotine Journey:**

**Lungs → Bloodstream (10-20 seconds):**
Nicotine crosses lung membranes instantly and enters your bloodstream.

**Heart → Brain (Seconds):**
Your heart pumps nicotine-rich blood to your brain, where it easily crosses the blood-brain barrier.

**Brain Response (Seconds to Minutes):**
Nicotine binds to receptors and triggers dopamine release, creating intense pleasure that your brain quickly craves again.

**Metabolism (1-2 hours):**
Your liver breaks down nicotine with a half-life of 1-2 hours, and metabolites are excreted through your kidneys.

**Why This Creates Addiction:**

The rapid delivery and short duration create a cycle of craving and use. Your brain quickly associates vaping with pleasure and reward.

**Tolerance Development:**

Over time, your brain creates more nicotine receptors, requiring more nicotine for the same effect. This is why people progressively increase their vaping frequency.

**Genetic Factors:**

Some people metabolize nicotine faster than others, leading to more frequent use and stronger addiction. Your genetics can make you more vulnerable to nicotine dependence.`,
    difficulty: "advanced",
    pointsReward: 200,
    estimatedMinutes: 4,
  },

  // Social Category
  {
    id: "social-1",
    title: "Peer Pressure and Vaping",
    category: "social",
    description: "Strategies to resist social pressure to vape",
    content: `Peer pressure is one of the main reasons young people start vaping. Here's how to handle it confidently.

**Common Pressure Lines:**

• "Everyone's doing it, just try it once"
• "It's just flavored vapor, not a big deal"
• "You're not cool if you don't vape"

**Effective Resistance Strategies:**

**1. Confident "No Thanks"**
Keep it simple and direct. No explanation needed. "I'm good, thanks."

**2. Change the Subject**
Redirect the conversation to something else. "Hey, did you see that new movie?"

**3. Suggest an Alternative**
Offer a different activity. "Let's go get food instead."

**4. Use Humor**
Lighten the mood. "My lungs are already working hard enough."

**5. Be Honest**
Share your real reason. "I'm an athlete, I need my lungs" or "I've seen what it did to my cousin."

**6. Find Your Crew**
Surround yourself with friends who support your choices and respect your decisions.

**Building Confidence:**

Practice saying no in low-pressure situations, remember your reasons for not vaping, and know that saying no gets easier with practice.

Real confidence comes from making choices that align with your values, not following the crowd.`,
    difficulty: "beginner",
    pointsReward: 100,
    estimatedMinutes: 3,
  },
  {
    id: "social-2",
    title: "Marketing Tactics Targeting Youth",
    category: "social",
    description: "How vape companies manipulate young people",
    content: `Vape companies spend millions targeting youth with sophisticated marketing tactics. Understanding these strategies helps you resist manipulation.

**Flavoring Strategy:**

Over 15,000 flavors are designed specifically to appeal to youth, with names like "Gummy Bear," "Cotton Candy," and "Unicorn Milk." Sweet flavors mask the harshness of nicotine and create a false perception of safety.

**Social Media Manipulation:**

• Influencers paid to promote vaping
• Viral challenges and trends
• Glamorous lifestyle imagery
• Hidden ads disguised as organic content

**Design and Packaging:**

• Sleek, tech-like appearance
• Bright colors and fun designs
• Devices that look like USB drives
• Easy to hide from parents and teachers

**False Health Claims:**

Companies make misleading claims like "95% safer than cigarettes," call it "just water vapor" (completely false), and suggest it "helps you quit smoking" (not FDA approved for this use).

**Targeting Tactics:**

Vape companies advertise near schools, sponsor youth events, use young-looking models, and place products at eye-level in stores where teens shop.

**The Reality:**

These companies care about profits, not your health. Creating lifelong addicts starting in youth is their business model.

**How to Resist:**

Recognize marketing when you see it, question the source of vaping information, understand that influencers are paid advertisers, and make decisions based on science rather than marketing.`,
    difficulty: "intermediate",
    pointsReward: 150,
    estimatedMinutes: 4,
  },
  {
    id: "social-3",
    title: "The Cost of Vaping",
    category: "social",
    description: "Financial impact of a vaping habit",
    content: `Vaping is expensive, and the costs add up quickly. Let's break down what you're really spending.

**Annual Costs:**

• **Disposable Vapes:** $960-$5,400 per year
• **Refillable Devices:** $1,440-$2,640 per year

**What $2,000/Year Could Buy Instead:**

• New iPhone or laptop
• 6 months of car insurance
• 40 concert tickets
• 200 restaurant meals
• College textbooks for a year
• Down payment on a car
• Investment that grows to $10,000+ in 10 years

**Hidden Costs:**

• Doctor visits for vaping-related health issues
• Emergency room visits
• Long-term addiction treatment programs
• Medications for health problems

**Social Costs:**

• Strained relationships with family and friends
• Time lost to constant vaping breaks
• Reduced athletic performance
• Academic struggles and lower grades

**The Addiction Tax:**

As your tolerance builds, you need more nicotine to feel satisfied, which means spending even more money to feed your addiction.

**Breaking Free:**

Imagine what you could do with an extra $2,000+ per year. That's the freedom of not vaping - money in your pocket for things you actually want.`,
    difficulty: "beginner",
    pointsReward: 100,
    estimatedMinutes: 3,
  },

  // Legal Category
  {
    id: "legal-1",
    title: "Vaping Laws and Regulations",
    category: "legal",
    description: "Understanding the legal landscape of vaping",
    content: `Vaping is heavily regulated at federal, state, and local levels. Breaking these laws has serious consequences that can affect your future.

**Federal Laws:**

• Must be 21+ to purchase vaping products (nationwide)
• E-cigarettes regulated as tobacco products
• Flavored cartridge-based products banned (except tobacco/menthol)
• Online sales require strict age verification

**State and Local Laws:**

Laws vary by location. Some states ban vaping in all public places, school zones have stricter penalties, and some cities ban flavored vapes entirely.

**Consequences for Minors:**

**Getting Caught:**
• Device confiscation
• Fines ranging from $50-$500+
• Mandatory community service
• Required education programs
• Suspension or expulsion from school
• Possible criminal record

**School Consequences:**
• Suspension lasting 3-10 days
• Loss of extracurricular eligibility
• Required parent meetings
• Possible expulsion for repeat offenses
• Negative impact on college applications

**Travel Restrictions:**

Vaping on planes is a federal crime. Devices must be carried in carry-on luggage, and some countries ban vapes entirely.

**The Bottom Line:**

Legal risks extend far beyond just getting caught. A criminal record can affect college admissions, job opportunities, and your entire future.`,
    difficulty: "intermediate",
    pointsReward: 150,
    estimatedMinutes: 4,
  },
  {
    id: "legal-2",
    title: "School Policies on Vaping",
    category: "legal",
    description: "What happens when you get caught vaping at school",
    content: `Schools take vaping seriously, and the consequences can significantly impact your education and future opportunities.

**Typical Consequences:**

**First Offense:**
• 3-5 day suspension
• Parent notification and meeting
• Device confiscation
• Required administrator meeting
• Possible police involvement

**Second Offense:**
• 5-10 day suspension
• Loss of parking privileges
• Removal from extracurricular activities
• Required counseling sessions

**Third Offense:**
• Long-term suspension or expulsion
• Alternative school placement
• Permanent record notation
• Possible criminal charges

**How Schools Detect Vaping:**

• Vape detectors in bathrooms (detect vapor, THC, and nicotine)
• Security cameras in hallways and common areas
• Staff observations and reports
• Student reports
• Random locker and bag searches

**Impact on Your Future:**

**Academic:**
Missing class time, falling behind in coursework, and lower GPA.

**Extracurricular:**
Removal from sports teams, loss of leadership positions, and scholarship opportunities lost.

**College Applications:**
Disciplinary actions appear on transcripts, you must disclose suspensions, it can affect admissions decisions, and you may lose scholarship opportunities.

**The Reality:**

That quick vape break isn't worth risking your education and future. Schools are investing in better detection technology and taking vaping violations more seriously than ever.`,
    difficulty: "intermediate",
    pointsReward: 150,
    estimatedMinutes: 4,
  },

  // Myths Category
  {
    id: "myths-1",
    title: "Debunking Common Vaping Myths",
    category: "myths",
    description: "Separating fact from fiction about vaping",
    content: `Let's bust common vaping myths with scientific facts.

**Myth: "It's Just Water Vapor"**

**FACT:** Vape aerosol contains nicotine, heavy metals, volatile organic compounds, ultrafine particles, and cancer-causing chemicals. It's NOT water vapor.

**Myth: "Vaping Helps You Quit Smoking"**

**FACT:** E-cigarettes aren't FDA-approved for quitting smoking. Most people end up using both cigarettes and vapes. Youth who vape are actually more likely to start smoking traditional cigarettes.

**Myth: "Vaping is 95% Safer Than Smoking"**

**FACT:** This widely-cited claim comes from one flawed 2014 study. "Safer than cigarettes" doesn't mean safe - it's like saying getting hit by a car is safer than getting hit by a truck.

**Myth: "Nicotine-Free Vapes Are Harmless"**

**FACT:** Even without nicotine, vapes still contain harmful chemicals. Flavoring chemicals damage lungs, and ultrafine particles cause inflammation and respiratory problems.

**Myth: "You Can't Get Addicted"**

**FACT:** Nicotine is highly addictive regardless of delivery method. Vapes often contain MORE nicotine than cigarettes, and addiction can develop within just a few weeks of regular use.

**Myth: "Everyone is Doing It"**

**FACT:** Only 20% of high school students vape, which means 80% DON'T. Non-vapers are actually the majority - you're not missing out.

**Myth: "It Doesn't Affect Athletic Performance"**

**FACT:** Vaping reduces lung capacity, decreases endurance, slows reaction time, and impairs recovery. Professional athletes don't vape because they know it hurts performance.

**Myth: "Natural/Organic Vapes Are Safe"**

**FACT:** "Natural" doesn't mean safe to inhale. Poison ivy is natural too. These products still contain harmful chemicals when heated and inhaled.

**Myth: "You Can Quit Anytime"**

**FACT:** Nicotine addiction is incredibly powerful. Most people need multiple attempts to quit, withdrawal symptoms are challenging, and professional help is often needed.

**The Truth:**

Don't believe everything you hear about vaping. Always check scientific sources and be skeptical of claims that sound too good to be true.`,
    difficulty: "beginner",
    pointsReward: 100,
    estimatedMinutes: 4,
  },
  {
    id: "myths-2",
    title: "Vaping vs. Smoking: The Real Comparison",
    category: "myths",
    description: "Understanding the truth about vaping and smoking",
    content: `Many people think vaping is a safe alternative to smoking. Let's examine the truth with scientific facts.

**What They Have in Common:**

**Both Contain Nicotine:**
Highly addictive substance that raises blood pressure, increases heart rate, and harms brain development in teens and young adults.

**Both Harm Your Lungs:**
Both cause inflammation, reduce lung function, increase infection risk, and damage lung tissue over time.

**Both Affect Your Heart:**
Both increase cardiovascular disease risk, cause arterial damage, and raise the risk of heart attack and stroke.

**Key Differences:**

**Cigarettes:**
• Contain tobacco
• Produce tar and carbon monoxide
• 7,000+ chemicals, 70+ known carcinogens
• Decades of research on health effects
• Distinctive smell that's hard to hide

**Vapes:**
• No tobacco
• No tar or carbon monoxide
• Hundreds of chemicals, many effects unknown
• Limited long-term research
• Easier to hide from parents and teachers

**Why "Safer Than Cigarettes" is Misleading:**

Both are harmful to your health. Comparing them is like debating whether being hit by a car or a truck is better. Vaping has unique risks that cigarettes don't have, and the long-term effects are still largely unknown.

**Unique Vaping Risks:**

• EVALI (vaping-associated lung injury)
• Battery explosions and device malfunctions
• Higher nicotine concentrations per puff
• Easier to use more frequently throughout the day
• More appealing flavors and designs targeting youth

**The Youth Epidemic:**

More teens now vape than smoke, reversing decades of declining youth tobacco use and creating a new generation of nicotine addicts.

**The Bottom Line:**

Comparing vaping to smoking is like debating which poison is better. The real answer is neither.

**The Best Choice:**

Don't smoke. Don't vape. Keep your lungs clean and your body healthy for the life you want to live.`,
    difficulty: "intermediate",
    pointsReward: 150,
    estimatedMinutes: 4,
  },
]
