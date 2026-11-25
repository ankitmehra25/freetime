Build an Interactive Executive Briefing: Understanding Our AI Tools

Act as a senior technology communication specialist, UX designer, and frontend developer.

I need you to create a polished, interactive, executive-level HTML briefing for a 30-minute introductory discussion with a non-technical business partner (VP).

The audience has little or no technical knowledge. Assume the person does not understand terms such as AI agents, LLMs, orchestration, CLI, repositories, worktrees, APIs, or coding environments.

Your job is not to teach technology. Your job is to help the VP understand, in simple business language:

* What each AI tool is.
* Why we have multiple tools.
* What makes each tool different.
* Where their capabilities overlap.
* Which tool is best suited to which type of work.
* Which tool would not be the natural first choice for certain tasks.
* How these tools complement each other.
* What enterprise integration, access, and governance considerations exist.

The experience should feel like a thoughtful conversation with a senior business leader, not a technical training session or a product marketing presentation.

⸻

1. The five AI experiences we need to explain

Cover exactly these five experiences:

1. GitHub Copilot – VS Code Extension
2. GitHub Copilot – Desktop App (the standalone Copilot application, NOT GitHub Desktop or GitHub Mobile)
3. GitHub Copilot CLI (the command-line experience)
4. Claude Desktop – Chat
5. Claude Desktop – Cowork

Important: We do NOT use Claude Code. Do not mention Claude Code or include it in the comparison.

Also, do not present these as five completely different AI brains. The central message must be:

These are different ways of putting AI to work. They have overlapping intelligence and capabilities, but offer different working environments, workflows, integrations, and user experiences.

⸻

2. Explain each tool using simple analogies

Use familiar office-work analogies that a traditional business leader can immediately understand.

A. GitHub Copilot in VS Code – The developer’s workbench

Explain it as an assistant sitting alongside a developer at their desk.

It helps developers:

* Understand existing software.
* Write and modify code.
* Work across multiple files.
* Explain complex logic.
* Identify and fix problems.
* Run tests and validate changes.
* Work through multiple AI-assisted sessions.

Important distinction:
VS Code already supports advanced agent-based work, including multiple sessions and parallel tasks. It is not a basic tool, and it must not be portrayed as incapable of coordinating complex work.

B. GitHub Copilot Desktop App – The development control centre

Explain it as a dedicated workspace or control centre for managing AI-assisted development work.

It provides a graphical workspace to:

* Manage and monitor coding-agent sessions.
* Work with supported repositories.
* Coordinate separate development tasks.
* Work with local or cloud-based sessions where supported.
* Use worktrees to keep parallel work isolated.
* Review progress and manage supported pull-request workflows.

The key distinction is not that it can do coding tasks that VS Code cannot.

VS Code already supports multiple agent sessions and sophisticated coding workflows.

The Desktop App provides a dedicated environment to organise, coordinate, and monitor agent work without having everything centred on the code editor.

Use this answer if the VP asks, “Why do we need this when VS Code already does it?”

“For many development tasks, VS Code is sufficient. The Desktop App offers another way to organise and monitor multiple coding-agent sessions, repositories, and parallel work. It is an additional workspace, not a mandatory replacement for VS Code.”

C. GitHub Copilot CLI – The command-window assistant

Explain it as giving instructions through a command window rather than through a graphical application.

It helps developers:

* Run commands and scripts.
* Inspect software projects.
* Execute tests.
* Troubleshoot issues.
* Automate repetitive technical work.
* Modify files and interact with supported Git workflows.

Use a simple analogy: Instead of asking an assistant to work through a graphical desk, you give instructions through an operations command window.

Explain that this is especially useful when the work naturally involves commands, scripts, automation, or troubleshooting.

Do not suggest that CLI is necessarily more intelligent or more capable than the other Copilot experiences.

D. Claude Desktop – Chat: The conversational assistant

Explain it as talking to a knowledgeable colleague.

It is useful for:

* Asking questions.
* Understanding unfamiliar subjects.
* Brainstorming ideas.
* Analysing documents.
* Summarising reports.
* Drafting emails and presentations.
* Refining business communication.
* Exploring a problem through conversation.

The strength is the interactive, conversational experience.

E. Claude Desktop – Cowork: The colleague you delegate work to

Explain it as assigning a broader task to a colleague rather than simply asking questions.

For example:
“Here are three business reports. Review them, identify common themes, compare the differences, and prepare a consolidated management summary.”

Cowork is designed for broader, multi-step knowledge-work assignments involving permitted files and supported tools.

It can help:

* Work through multiple files.
* Perform multi-step assignments.
* Organise and analyse information.
* Produce structured deliverables.
* Complete a task through a more delegated workflow.

Important distinction:
Claude Chat can also analyse documents and create deliverables. Cowork is not a completely separate AI brain and does not have exclusive access to all document-analysis capabilities.

The distinction is primarily the working experience: conversational exploration versus delegating a larger assignment.

⸻

3. The most important section: Where do the tools overlap?

This must be a major part of the briefing.

Do not make the tools look artificially different just to justify having five of them.

Show honestly that capabilities overlap.

Create an intuitive comparison matrix covering these activities:

* Ask questions and get explanations.
* Understand existing code.
* Generate or modify code.
* Work across multiple files.
* Run commands and tests.
* Troubleshoot technical issues.
* Manage parallel development tasks.
* Analyse business documents.
* Summarise multiple reports.
* Brainstorm and draft business content.
* Execute multi-step assignments.
* Produce structured deliverables.

For each tool, use simple labels such as:

* Strong fit
* Supported / useful
* Possible, but not the natural first choice

Avoid suggesting that a tool cannot do something simply because another tool is better suited to it.

The matrix must be visually clear and understandable to a non-technical person.

Include a short explanation below the matrix:

“Overlap is expected. These tools are not five isolated products with five unrelated capabilities. The difference is how we access AI, what environment it works in, and how naturally that environment supports a particular task.”

⸻

4. Explain why we need multiple tools

This should be one of the strongest sections.

Use a practical analogy:

Imagine an organisation has:

* A person working at a desk.
* A manager coordinating multiple assignments.
* An operations team using a command centre.
* A colleague available for questions.
* Another colleague who can take ownership of a larger assignment and return with a finished output.

They may have overlapping knowledge, but their working environments and responsibilities differ.

Then connect this analogy to our five tools.

Make these points clear:

* We do not need to use all five for every task.
* There is no single universally best tool.
* Some tools are more naturally integrated into software development.
* Others are better suited to general business knowledge work.
* Convenience, workflow integration, permissions, and the nature of the task influence the choice.
* The objective is to select the right working experience, not to create unnecessary tool complexity.

⸻

5. Include a practical “Which tool should I use?” decision guide

Use real-world scenarios rather than product feature descriptions.

Examples:

Scenario 1: A developer needs to modify an existing application.
Recommended: GitHub Copilot in VS Code.

Scenario 2: A developer wants to manage and monitor several parallel coding-agent assignments.
Recommended: GitHub Copilot Desktop App.
Explain that VS Code can also support multiple sessions; Desktop provides a dedicated coordination workspace.

Scenario 3: A developer needs to run scripts, commands, tests, or troubleshoot through a terminal.
Recommended: GitHub Copilot CLI.

Scenario 4: A business leader wants to understand a new concept or discuss a business problem.
Recommended: Claude Chat.

Scenario 5: A business team wants to consolidate several reports into a management summary.
Recommended: Claude Cowork.
Explain that Chat can also do document analysis; Cowork is designed for a more delegated, multi-step workflow.

Scenario 6: A developer wants an explanation of unfamiliar code.
VS Code Copilot is a natural choice when working directly in the project. Claude Chat can also help when the code can be safely shared and analysed outside the development environment.

Scenario 7: Someone wants to draft an email or prepare a presentation.
Claude Chat is a natural starting point. Cowork may be useful if the task involves gathering information from several permitted files and creating a complete deliverable.

Make the recommendations practical, not absolute.

⸻

6. Include a “What I would not recommend” section

This is important because the VP should understand that tools have natural strengths and limitations.

Examples:

* I would not recommend opening a command-line interface for someone who simply wants to brainstorm a business idea.
* I would not recommend using the Copilot Desktop App just because someone needs to edit one small piece of code; VS Code may be sufficient.
* I would not recommend treating Claude Chat and Cowork as two unrelated AI engines.
* I would not recommend using Cowork for every simple question when a normal conversation in Chat is enough.
* I would not recommend treating Copilot CLI as a replacement for every graphical development workflow.
* I would not recommend assuming Claude Desktop automatically has access to GitHub Enterprise repositories or internal company systems.

Phrase these as recommendations about the natural fit of a tool, not hard technical restrictions.

⸻

7. Explain enterprise integration and governance

Keep this section simple and business-oriented.

Important points:

* GitHub Copilot is integrated into our GitHub development ecosystem, subject to organisation configuration, licences, and permissions.
* Copilot experiences may use shared underlying services and supported GitHub workflows; the desktop application is not an independent AI that automatically knows all company code.
* Claude Desktop and Cowork belong to a separate AI ecosystem from GitHub Enterprise Copilot.
* Claude does not automatically connect to our GitHub Enterprise environment.
* Any connection to company files, repositories, applications, or external systems requires supported integration, appropriate permissions, and enterprise approval.
* Cowork can only access the files, folders, and tools that have been permitted and configured.
* AI should not be assumed to have unrestricted access to company information.
* Sensitive business decisions and consequential actions should retain appropriate human review and approval.

Avoid making unverified security or compliance claims.

If a feature depends on licensing, product version, or enterprise configuration, label it as such.

⸻

8. Make the briefing interactive and conversational

The VP should feel like they are participating in a discussion, not watching a product demonstration.

Include:

* A simple opening question: “When you hear AI tools, do you think they all do the same thing?”
* Short discussion prompts between sections.
* Click-to-reveal explanations for technical terms.
* Expandable “If you are wondering…” question-and-answer sections.
* A dedicated section titled “Questions you may naturally ask.”

Include these likely VP questions and simple answers:

1. Why do we need five tools?
2. Are these five different AI brains?
3. Why not use VS Code for everything?
4. If VS Code supports multiple agents, why do we need the Desktop App?
5. Why would a developer use CLI instead of a graphical interface?
6. Can Claude also write code?
7. Why do we need both Claude Chat and Cowork?
8. Can Cowork access all my company files?
9. Can AI take actions on my behalf?
10. Does Claude automatically have access to our GitHub Enterprise code?
11. Which tool should a non-technical business user start with?
12. Are we replacing human decision-making?

Answers must be concise, accurate, and understandable to a non-technical executive.

⸻

9. Suggested 30-minute discussion structure

Organise the page to support this flow:

* 0–3 minutes: Introduce the idea that different AI tools provide different working experiences.
* 3–10 minutes: Explain the five tools with simple analogies.
* 10–17 minutes: Discuss overlaps and meaningful distinctions.
* 17–21 minutes: Explain why multiple tools exist.
* 21–25 minutes: Walk through real-world scenarios and tool selection.
* 25–28 minutes: Discuss enterprise integration, access, and governance.
* 28–30 minutes: Questions and discussion.

Clearly identify which sections are essential and which are optional if time is limited.

⸻

10. HTML design and technical requirements

Create a professional, visually engaging, executive-quality HTML webpage.

This should NOT look like a basic PowerPoint converted into HTML.

Design direction:

* Modern enterprise editorial style.
* Clean, sophisticated visual hierarchy.
* Professional typography.
* Strong visual storytelling.
* Clear diagrams and comparisons.
* Subtle colours, not excessive gradients or flashy animations.
* Appropriate icons and illustrations.
* Plenty of whitespace.
* Avoid walls of text.
* Use simple language throughout.

The page should include:

1. A compelling opening section.
2. A visual overview of the five tools.
3. Five individual tool explanation sections.
4. A visual overlap/capability matrix.
5. A “Why multiple tools?” explanation.
6. A practical scenario-based recommendation guide.
7. A “What I would not recommend” section.
8. Enterprise integration and governance.
9. Expandable VP questions and answers.
10. A 30-minute presenter guide.

Use interactive elements:

* Tabs or navigation to move between the five tools.
* Expandable cards for details.
* Hover or click explanations for technical terms.
* Interactive capability matrix if practical.
* A sticky navigation bar or section navigation.
* A presentation mode that makes the content easy to walk through during the meeting.
* A print-friendly stylesheet so the page can be printed or saved as PDF.

Technical requirements:

* Prefer a single self-contained index.html file with embedded CSS and JavaScript.
* Do not require a backend or database.
* Do not require external API keys.
* Avoid unnecessary dependencies.
* Make the page responsive for laptop and tablet screens.
* Keep all content easy to edit directly in the HTML.
* Use semantic HTML and accessible controls.
* Ensure navigation, tabs, accordions, and other interactions actually work.
* Include a print button using the browser’s print functionality.
* Do not make up product features or claim capabilities that are not established.
* Where capabilities vary by licence, version, or enterprise configuration, state this clearly.

Before finishing:

* Validate the HTML and JavaScript.
* Test all navigation and interactive controls.
* Check the print layout.
* Ensure the output is a working HTML page, not merely a mock-up or static design.

Save the final deliverable as index.html in the project directory.

Also provide a short README explaining how to open the page, edit the content, and print or save it as a PDF.

⸻

Final quality test

Before declaring the work complete, ask yourself:

“If I show this to a senior VP who has never used any of these tools, will they understand within 30 minutes why these five experiences exist, what each is good at, where they overlap, and when we should use one instead of another?”

If the answer is no, improve the page.

The final output must communicate one central message:

We are not introducing five different AI brains. We are providing different ways to access and apply AI, depending on the nature of the work, the user’s role, the working environment, and the level of task delegation required.
