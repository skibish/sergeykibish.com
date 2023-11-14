---
title: "Who the heck is a Full-Stack Developer?"
description: >
  Thinking about the term "Full-Stack Developer" made me realize that
  it's a highly overloaded term that has most likely lost its meaning (if it had any) in 2023.
  In this post, we will explore who Full-Stack Developers are and whether they still exist or not.
date: 2023-05-16T19:53:15+02:00
blog/categories:
  - Talk Transcriptions
blog/tags:
  - Development
---

## Preface

This post is based on the talk given in Tallinn at [Devclub.eu](https://devclub.eu/#/) event in January 2023.

## Intro

In this post, I would like to discuss something that has been puzzling me for quite some time:
Who the heck is a Full-Stack Developer?

Every time I come across someone using the term "Full-Stack" in their vocabulary, something inside of me starts to ignite.

![JetBrains ad on Twitter](images/jetbrains-ad-full-stack.jpeg)

To add a little more flavor and to better convey my level of frustration, let's examine some job descriptions for Full-Stack positions.
Please note that the sources of these job descriptions are intentionally not specified.

> - Collaborate with **engineering, product management and design teams** to **understand customer pain points, come up with solutions** that will ultimately better the lives of both [..] and supporting care teams.
> **Develop seamless user experiences** for the [..] teams using our product.
> - **Develop, test, document and deploy easy to understand and secure backend service APIs** to enable the creation of web application features.
> - **Design and implement secure and fault tolerant systems** to handle large amounts of health data using container based technologies such as **Docker and Kubernetes.**
> - **Tackle a wide variety of technical problems** throughout the stack and contribute daily to all parts of our product code base as well as our **overall quality engineering processes.**

> - **Own software from beginning to end**: identify requirements, dev, test, deploy, and
> - Build ground-based services to support both machine-machine and browser-based scenarios
> - **Build a browser application with offline capability**
>
> ADDITIONAL REQUIREMENTS:
>
> - **Willing to work extended hours and weekends when needed**

> - **Responsible for converting business requirements into exceptional** digital experience (speed, simplicity, aesthetics) using best-practice design patterns and modern development technologies (Headless/Hybrid) that deliver highly responsive and decoupled digital properties that follow the brand [..] styles.
> - **Define and deliver overall technical architecture** of all brands [..] digital properties: building a centralized reusable library of components to maximize efficiency and consistency in share components for use in multi-tenant environment.
> - **Own all environments (dev,stage,production)** and related configurations, code repository, backup process, uptime, and deployment process and schedule.
> - **Conduct monthly/quarterly technical performance reports** for all digital properties: speed, uptime, code efficiency, etc.
> Share with leadership team in a visual and explanatory manner.
> - Recommend and help implement technologies needed to achieve business requirements.
> **Ensures compliance with and/or follows all organizational systems**, programs, training, policies, and procedures as required and complies with relevant legal mandates.
> Seeks guidance as necessary.
> - **Must have a strong hunger to grow and learn as a developer.**
> Actively supports and participates in the safety program, both for self-protection and the protection of other employees, by reading and abiding by all requirements in the Safety Manual and Injury Illness Prevention Program (IIPP).
> - **Carries out all responsibilities in an honest, ethical and professional manner.**
> Must be able to fulfill essential job function in a consistent state of alertness and safe manner.
> Complete web tactics and handle workflow and timelines of multiple, simultaneous projects, with prioritization guidance from supervisor.

> - **Work across the entire stack and enjoy new professional and technological challenges;**
> - In addition you like to share your knowledge with motivated team members, which also helps you to constantly push each other and improve your skills;
> - **The users are in your focus and you always try to improve the product to maximize the value for the company.**
>
> Tech requirements:
>
> - **Profound knowledge in HTML, CSS, Angular, Typescript, REST, Golang, TDD, BDD, Frontend Architecture, Cypress, Cucumber;**
> Experience with C/CD tooling Problem solving skills;
> **Experience with backend technologies (Java, C#) + willingness to challenge yourself in Golang.**
> **Particularly the ability to develop quick and sound solutions to resolve complex issues.** Agile team player.

> - Design and develop **high quality** and **scalable front-end** (Angular 8+, TypeScript) and back-end (Node.js., TypeScript) applications, and **deploy it** all on GCP
> - Write structured, tested, readable, and maintainable code
> - Participate in code reviews to ensure code quality and distributed knowledge
> - Perform profiling, debugging, and performance tuning of TypeScript based applications
> - Stay current with the latest front-end and back-end technologies, best practices, and share your findings with the rest of the team
> - Contribute to each step of the development process (from ideation, to implementation and release)
> - Work as part of an agile team across multiple application domains and technologies
> - **Evolve our application stack and mentor other team members** on development patterns and best practices
> - **Interact at a high level with different stakeholders: architects, team leads, managers, documentation, etc**

> We're looking for a full-stack engineer who is capable of shipping **entire feature sets on their own, and with a knack for shipping fast.**
> You'll be working alongside a team of highly competent full-stack engineers who have shipped end-to-end

> - Work directly with our Lead Software Engineer on applications.
> - **Design beautiful, engaging and performant UIs.**
> - **Build Back-End layers to support individual applications.**
> - Work closely with the engineering, product and design team **to plan, architect, and launch features** within our applications.
> - Grow technically in the Web3 space through research and product initiatives.
> - Develop and own high-quality code across all levels of the stack that allows us to scale to millions of active users.

> - Develop software according to end user requirements and quality standards.
> - **Collaborate with product managers** to provide contributions on technical elements of sprint/iteration planning, estimation, risk, dependencies, and user stories definition.
> - **Mentor and guide junior team members** on development best practices.
> - Participate in **sprint planning and/or provide accurate estimates** on projects/tasks.
> - **Identify, document and implement** programming patterns and set standards.
> - Utilize software based system maintenance and tracking tools (Ex: Jira, etc).
> - **Support, troubleshoot and resolve production issues**, including direct interactions with internal and/or external customers as needed.
> - Identify and implement process improvements in Engineering.
> - Demonstrate willingness to work on your craft and take initiative in learning new skills.
> - Perform code reviews as requested to enforce standards in the code base.

> [..] is responsible for **leading a team of engineers building and designing a product** that our customers and associates love.
> [..] you will be part of a dynamic team with engineers of all experience levels who help each other build and grow technical and leadership skills while creating, deploying, and supporting production applications.
> In addition, will assist in product and tool selection, configuration, security, resilience, performance tuning and production monitoring.
> [..] contribute to foundational code elements that can be reused as well as architectural diagrams and other **product-related documentation.**
> [..] you will be a **core player on the product team** and are expected to build and grow the skillsets of the more junior Engineers.
> As a **leader of a feature team**, you should be a reliable pillar for the team that they trust and turn to, providing technical guidance, mentorship, as well as being able to make necessary decisions to keep work moving and the team focused on the task at hand.
> You should be able to conduct and engage in solutioning discussions, develop foundational units of code, as well as produce architectural diagrams.

## Nobody is searching for a developer

Let's pause for a moment and consider something interesting.
Have you noticed that none of the listed job ads are actually seeking a *developer*?
Instead, everyone seems to be on the hunt for a miraculous individual who can do it all, and most likely at a low salary.

> A full-stack developer is expected to be able to work in **all the layers of the stack**.
> A full-stack web developer can be defined by some as a developer or engineer who works with both the **front and back ends of a website or application**.
> This means they can **lead platform builds** that involve databases, user-facing websites, and **working with clients** during the **planning** phase of projects.
>
> --- [Wikipedia](https://en.m.wikipedia.org/wiki/Solution_stack#Full-stack_developer)

According to Wikipedia's definition, a Full-Stack Developer is someone who possesses a wide range of skills.
But here's the question: Full-Stack of which stack?

The same page lists around 34 (!!) stacks.
It's safe to assume that many of us are not familiar with all of them.
There are countless letters and abbreviations involved, making things even more confusing.

## The origin of the term "Full-Stack Developer"

Now, let's take a look at the other end of the spectrum: who actually coined the term "Full-Stack Developer"?

Many sources attribute the origin of this term to a quote by Randy Schmidt, which dates back to 2008.
Here's what he wrote:

> A full stack web developer is someone that does design, markup, styling, behavior, and programming.
>
> --- [Randy Schmidt, 2008](https://web.archive.org/web/20110210194715/http://forge38.com:80/blog/2008/06/full-stack-web-developers/)

Back then, in 2008, the web development landscape revolved around "markup," "styling," and "behavior," which referred to HTML, CSS, and JavaScript, respectively.
"Programming" mainly encompassed backend logic.
This definition solely pertained to early web development.

Two years later, another notable quote by a Facebook engineer emerged:

> A "full-stack programmer" is a generalist, someone who can create a non-trivial application by themselves.
> People who develop broad skills also tend to develop a good mental model of how different layers of a system behave.
> This turns out to be especially valuable for performance & optimisation work.
> No one can know everything about everything, but you should be able to visualise what happens up and down the stack as an application does its thing.
>
> --- [Carlos Bueno, 2010](https://www.facebook.com/note.php?note_id=461505383919)

As you can see, within just two years, the definition evolved from being solely about web development to encompassing any type of application.
However, it's worth noting that many employers overlook the last line of that quote and still expect Full-Stack Developers to possess deep knowledge in every aspect.
They believe that one person can replace two, three, or even five individuals.

These quotes are now 15 and 13 years old, respectively
A significant amount of time has passed since then.
So, what about now?
What are the expectations for developers to meet the "know everything" standards?
Surely, technology hasn't remained stagnant during this period.
As we know, the field of IT is incredibly dynamic.

## Creating Full-Stack Developer

There's a fantastic resource available on the internet called [roadmap.sh](https://roadmap.sh), which provides comprehensive roadmaps for various development paths.
Let's explore how we can build a Full-Stack Developer using these roadmaps:

- The [Backend Developer roadmap](https://roadmap.sh/backend) spans approximately 3 screens.
It covers essential skills for backend development.
- Understanding proper application development requires knowledge of [Software Design and Architecture principles](https://roadmap.sh/software-design-architecture), which is another 2 screens worth of roadmap.
- Deploying applications in today's world necessitates familiarity with [DevOps](https://roadmap.sh/devops).
Another 2.5 screens of content.
- Now, what's missing? Frontend skills! The
[Frontend roadmap](https://roadmap.sh/frontend) spans about 3 screens and covers the necessary knowledge for frontend development.
- Additionally, considering the prevalence of mobile applications, it's beneficial to explore mobile development.
However, for the sake of brevity, I'll stop here.

I assume, you either, after learning everything in theory and practice will find zen, piece inside yourself and with everyone around...
or you'll burnout to hell.
From my personal experience, second has more chances to happen than the first one.

## Full-Stack Developer is a myth

I wholeheartedly agree with those who argue that Full-Stack Developers are nothing more than a myth.
The ever-changing landscape of technology makes it unrealistic for anyone to truly know everything.
Completing those extensive roadmaps without going crazy would require either being an exceptional prodigy or sacrificing one's personal life.

Here's another piece of evidence that supports the impossibility of being a Full-Stack Developer: the [CNCF Landscape](https://landscape.cncf.io).
This comprehensive list consists of over 157 projects, many of which are considered part of the DevOps roadmap.
It's simply unfeasible to possess knowledge of all these projects.

Let's also consider the vast number of services provided by cloud providers:

- AWS offers more than 200 services.
- GCP offers more than 100 services.
- Azure offers more than 200 services.

It becomes abundantly clear that knowing every single one of these services is an unattainable feat.
The sheer quantity of technologies and their rapid evolution makes it nearly impossible for someone to keep up with everything.
Beware of those who collect certificates from all these cloud providers --- they may appear knowledgeable, but the reality is that they cannot keep up with the relentless pace of progress, and their knowledge may quickly become outdated.

Therefore, in 2023, I conclude that Full-Stack Developers do not truly exist. 
Instead, we have software engineers who possess a variety of skills and knowledge in different areas.
Some may excel in backend development, others in CI/CD, and some may have the ability to create applications independently (thanks to the abstractions available today), some in other areas.
However, there will always come a point where deep expertise in a specific area is necessary.

It is futile to search for a person who knows everything.
The likelihood of finding such an individual is incredibly low.
It's time to abandon the term "Full-Stack" and remove it from our, HR and recruiter vocabularies.
Instead, let's focus on recognizing engineers with diverse skills and knowledge.

## The need for generalists

However, there is still a crucial need for individuals who possess the ability to quickly learn new technologies and apply them effectively.
As Carlos mentioned in his quote, what we truly require are generalists-people with a broad spectrum of knowledge who can adapt rapidly.
These individuals have gained diverse experiences, fearlessly exploring new frontiers.
They can blaze a trail and guide others along it.

They are the "movers" who drive progress forward.
Often, they possess leadership skills and well-developed soft skills, allowing them to consistently get stuff done.

Is it realistic to remove the term "Full-Stack Developer" from our industry?
Unfortunately, I must state that it is an unrealistic goal.
The term has already penetrated too deeply into our vernacular, much like other marketing terms such as DevOps or Platform Engineer.

## The influence of marketing

It's understandable why angel investors are drawn to the title of "Full-Stack Developer."
They are often looking for cost-effective solutions and rapid progress. Some even provide enticing numbers, as seen in the article [here](https://wellfound.com/blog/what-skeptics-get-wrong-about-full-stack-engineers-and-why-we-need-them), to promote the idea of Full-Stack Developers.
While the salary for Full-Stack Developers may be lower than that of specialized Frontend or Backend developers, the promise of a substantial 2% equity can be quite enticing.

In [LinkedIn's 2020 U.S. Emerging Jobs Report U.S. Emerging Jobs Report](https://business.linkedin.com/content/dam/me/business/en-us/talent-solutions/emerging-jobs-report/Emerging_Jobs_Report_U.S._FINAL.pdf), Full-Stack Developers ranked fourth among the jobs that emerged in the past five years, following AI and Data Sciences.
This indicates a significant demand for such roles.
Scary.

It's interesting to note that there are other roles in the industry that share similar expectations to Full-Stack Developers.
Consider the role of a CTO in a new startup.
This position often requires a broad skill set, making it highly likely that the CTO is essentially a Full-Stack Developer.
They are responsible for creating the first Minimum Viable Product (MVP) with limited resources, often compensated with equity rather than a high salary.

Another role to consider is an Engineering Manager.
This role is unique, as it requires both engineering expertise and managerial skills.
Engineering Managers are leaders who drive their teams forward, mentor individuals, make strategic decisions, and even write code.
Additionally, they may be involved in configuring CI/CD pipelines and other technical responsibilities.

Similarly, Solutions Architects, particularly those who go beyond being cloud-specific, often find themselves tackling tasks similar to those of a CTO or Engineering Manager.
They are responsible for designing comprehensive solutions.

Lastly, Staff Engineers also have a wide range of responsibilities on their plate, demonstrating the need for diverse skills in their role.

## Conclusion

In conclusion, it's important to recognize that "Full-Stack" is not solely determined by the depth of knowledge but rather by the degree of responsibility one can handle.
Can you effectively implement what is asked of you?
How much responsibility and tasks can you take on without burning out?

Therefore, keep the following points in mind:

- It is impossible to know everything, and that's perfectly normal.
Avoid the fear of missing out (FOMO) and don't exhaust yourself trying to learn everything.
- Full-Stack Developers, as commonly understood, do not truly exist.
Instead, we have engineers with diverse skills, backgrounds, and experiences.
- The need for generalists, those responsible "movers" who can adapt and excel in various areas, remains significant.
- Advancements in AI, such as [GitHub Copilot](https://github.com/features/copilot), [ChatGPT](https://openai.com/blog/chatgpt), [Bard](https://bard.google.com), and other tools, will likely contribute to the emergence of more individuals with "Full-Stack" capabilities.
- If you choose to take on a multitude of responsibilities, ensure that you are appropriately compensated for your efforts.
- Learn to delegate tasks to other people or leverage automation whenever possible.

That wraps up today's post. Thank you for reading!
