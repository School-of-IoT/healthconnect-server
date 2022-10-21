# Security Policy
## Reporting a vulnerability
**Please do not open GitHub issues or pull requests** - this makes the problem immediately visible to everyone, including malicious actors.

Security issues or vulnerabilities may include:
- XSS attack
- CSRF attack 
- SQL injection vulnerability 
- DNS hijacking
- Session vulnerability 
- Unsecured API 
- Authentication spoofing 

#### Please mail to - **info.healthconnect@pm.me** using provided template only


## Title of the vulnerability
When creating a title for the vulnerability, be explicit about what the vulnerability is. Don’t write show-off titles. Let’s consider an cross-site scripting example (XSS vulnerability example):

Example of a good title — Reflected XSS on reference parameter at product page

Example of a bad title — CRITICAL — XSS on your program

Keep in mind that this is the first thing the program owners or clients will see. It’s their first impression of you and your report.

#### Description
A vulnerability description must be short, clear, and direct. Program owners and clients don’t want to spend much time reading.

A great way to describe a vulnerability in a short, clear way is to include references/links to trusted sources that can help others understand, identify, and fix the bug. This could be an OWASP link, CVE references or links to other public advisories and standards. (Don’t reference Wikipedia or other less respected sites.)

e.g. If I find a XSS bug, I’ll explain what it is, give an OWASP reference, tell them what type of XSS was found, and so on.

Don’t copy-paste information from automated tools or other sources into the description. It shows the program owners or clients that you didn’t even take the time to write a few words specific to their scenario.

If it is my first time submitting a report to a bounty program, I’ll introduce myself and say “hello.” There’s nothing wrong with showing a little politeness.

## Proof-of-concept
In the proof-of-concept section, I always treat program owners and clients as if they are newbies. I provide a clear step-by-step guide or process showing how to replicate the vulnerability.

Example of a XSS proof of concept:

Step 1: Go to the following [URL]

Step 2: Enter your username and password (you need an account to do this)

Step 3: In the Search box at top right, insert the following information:

<script>alert(document.domain);</script>

Step 4: Click the “Search” button

Step 5: You’ll see a JavaScript popup box showing your domain

Check the attached screenshot to see the actual XSS vulnerability.

Depending on the type of vulnerability, I may also show the reflected code so the program owners and clients can identify faster where the payload is loading. Example:

great report 2

## Criticality Assessment
To give the program owners and clients an idea of the seriousness or criticality of a security weakness, you can explain how a malicious user or black hat hacker could attack by exploiting the vulnerability you found. Describe how and what the company (and its clients and customers) can lose with this vulnerability, in particular the impact on confidentiality, integrity, and availability. The criticality assessment could consider factors such as customer privacy, reputation impact for the company, inappropriate access to proprietary or confidential data such as intellectual property or marketing plans, potential regulatory fines, or compliance risks.

You might also be called upon to assign a criticality rating. In the Cobalt.io platform, the rating is based on impact and business context such as the damage potential, reproducibility, exploitability, number of affected users, and discoverability of each finding.

## Tools
Share which tool or tools you used when finding the vulnerability. If you used only a browser, identify the required browser version. For particular types of vulns, the proof of concept will only work on some versions so be specific.

Example: Burp, Nmap and Firefox 47.0

## Attachments
Provide screenshots, video, or audio recording to improve and add value to your report.

Sometimes program owners and clients can’t replicate the vulnerability so helping them with images or a step-by-step video or audio will help them significantly.

If you can’t do a video, just send an audio version explaining how to replicate your finding. This will also show the owners and clients that you took time to create a good report and they may even evaluate you a little higher for the extra effort.

## Suggested Fixes/Solutions
Show the program owners clear solutions for their problem. Give examples, don’t just tell them to sanitize the input, but also give them references and possible ways to do it. They’ll greatly appreciate it. Sometimes the developers don’t know how to fix a vulnerability, and if you provide a great description of a suggested fix it’s a win-win situation. After all, the key mission is to fix the vulnerabilities.
