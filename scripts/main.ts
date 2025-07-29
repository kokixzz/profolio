interface Project {
    name: string;
    description: string;
    languages: string[];
    link: string;
}

interface Experience {
    company: string;
    role: string;
    years: string;
    companyWebsite: string;
}

interface PortfolioData {
    name: string;
    position: string;
    resume: string;
    introduction: string,
    description: string;
    about: string;
    languages: string[];
    projects: Project[];
    experiences: Experience[];
    social: {
        facebook: string;
        instagram: string;
        github: string;
        linkedin: string;
    };
}

class PortfolioBuilder {
    private form: HTMLFormElement;
    private projectsContainer: HTMLDivElement;
    private experiencesContainer: HTMLDivElement;
    private addProjectButton: HTMLButtonElement;
    private addExperienceButton: HTMLButtonElement;
    private languageSelect: HTMLSelectElement;
    private selectedChips: HTMLDivElement;
    private selectedLanguages: string[] = [];

    constructor() {
        this.initializeElements();
        this.setupEventListeners();
    }

    private initializeElements(): void {
        this.form = document.getElementById('portfolioForm') as HTMLFormElement;
        this.projectsContainer = document.getElementById('projectsContainer') as HTMLDivElement;
        this.experiencesContainer = document.getElementById('experiencesContainer') as HTMLDivElement;
        this.addProjectButton = document.getElementById('addProject') as HTMLButtonElement;
        this.addExperienceButton = document.getElementById('addExperience') as HTMLButtonElement;
        this.languageSelect = document.getElementById('languageSelect') as HTMLSelectElement;
        this.selectedChips = document.getElementById('selectedChips') as HTMLDivElement;
    }

    private setupEventListeners(): void {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.addProjectButton.addEventListener('click', () => this.addProjectEntry());
        this.addExperienceButton.addEventListener('click', () => this.addExperienceEntry());
        this.languageSelect.addEventListener('change', () => this.handleLanguageSelection());

        document.querySelectorAll('.remove-project').forEach(button => {
            button.addEventListener('click', (e) => this.removeProjectEntry(e));
        });
    }

    private addProjectEntry(): void {
        const projectEntry = document.createElement('div');
        projectEntry.className = 'project-entry';
        projectEntry.innerHTML = `
            <button type="button" class="remove-project">×</button>
            <div class="form-group">
                <label>Project Name:</label>
                <input type="text" name="projectName[]" required>
            </div>
            <div class="form-group">
                <label>Project Description:</label>
                <textarea name="projectDescription[]" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <label>Project Languages:</label>
                <input type="text" name="projectLanguages[]" placeholder="e.g., HTML, CSS, JavaScript" required>
            </div>
            <div class="form-group">
                <label>Project Link:</label>
                <input type="url" name="projectLink[]" placeholder="GitHub or Live Demo URL" required>
            </div>
        `;

        const removeButton = projectEntry.querySelector('.remove-project');
        removeButton?.addEventListener('click', (e) => this.removeProjectEntry(e));

        this.projectsContainer.appendChild(projectEntry);
    }
    

    private removeProjectEntry(e: Event): void {
        const button = e.target as HTMLButtonElement;
        const projectEntry = button.closest('.project-entry');
        if (projectEntry) {
            projectEntry.remove();
        }
    }

    private addExperienceEntry(): void {
        const experienceEntry = document.createElement('div');
        experienceEntry.className = 'experience-entry';
        experienceEntry.innerHTML = `
            <button type="button" class="remove-experience">×</button>
            <div class="form-group">
                <label>Company:</label>
                <input type="text" name="experienceCompany[]" required>
            </div>
            <div class="form-group">
                <label>Position/Role:</label>
                <input type="text" name="experienceRole[]" required>
            </div>
            <div class="form-group">
                <label>Years:</label>
                <input type="text" name="experienceYears[]" placeholder="e.g., 2019 - 2022 or 2022 - Present" required>
            </div>
            <div class="form-group">
                <label>Company Website:</label>
                <input type="url" name="experienceCompanyWebsite[]" placeholder="Website of the Company" required>
            </div>
        `;

        const removeExpButton = experienceEntry.querySelector('.remove-experience');
        removeExpButton?.addEventListener('click', (e) => this.removeExperienceEntry(e));

        this.experiencesContainer.appendChild(experienceEntry);
    }

    private removeExperienceEntry(e: Event): void {
        const button = e.target as HTMLButtonElement;
        const experienceEntry = button.closest('.experience-entry');
        if (experienceEntry) {
            experienceEntry.remove();
        }
    }

    private handleLanguageSelection(): void {
        const selectedValue = this.languageSelect.value;
        if (selectedValue && this.selectedLanguages.indexOf(selectedValue) === -1) {
            this.addLanguageChip(selectedValue);
            this.selectedLanguages.push(selectedValue);
            this.languageSelect.value = '';
        }
    }

    private addLanguageChip(language: string): void {
        const selectedOption = this.languageSelect.options[this.languageSelect.selectedIndex];
        const displayText = selectedOption.getAttribute('data-display') || language;

        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.innerHTML = `
            <span>${displayText}</span>
            <button type="button" aria-label="Remove ${displayText}">&times;</button>
        `;

        const removeButton = chip.querySelector('button');
        removeButton?.addEventListener('click', () => {
            chip.remove();
            const index = this.selectedLanguages.indexOf(language);
            if (index > -1) {
                this.selectedLanguages.splice(index, 1);
            }
        });

        this.selectedChips.appendChild(chip);
    }

    private getSelectedLanguages(): string[] {
        return this.selectedLanguages;
    }

    private collectFormData(): PortfolioData {
        const formData = new FormData(this.form);
        
        // Collect projects data
        const projectNames = formData.getAll('projectName[]');
        const projectDescriptions = formData.getAll('projectDescription[]');
        const projectLanguages = formData.getAll('projectLanguages[]');
        const projectLinks = formData.getAll('projectLink[]');

        // Collect experiences data
        const experienceCompany = formData.getAll('experienceCompany[]');
        const experienceRole = formData.getAll('experienceRole[]');
        const experienceYears = formData.getAll('experienceYears[]');
        const experienceCompanyWebsite = formData.getAll('experienceCompanyWebsite[]');

        const projects: Project[] = projectNames.map((name, index) => ({
            name: name.toString(),
            description: projectDescriptions[index].toString(),
            languages: projectLanguages[index].toString().split(',').map(lang => lang.trim()),
            link: projectLinks[index].toString()
        }));

        const experiences: Experience[] = experienceCompany.map((name, index) => ({
            company: name.toString(),
            role: experienceRole[index].toString(),
            years: experienceYears[index].toString(),
            companyWebsite: experienceCompanyWebsite[index].toString()
        }));

        return {
            name: formData.get('name')?.toString() || '',
            position: formData.get('position')?.toString() || '',
            resume: formData.get('resume')?.toString() || '',
            introduction: formData.get('introduction')?.toString() || '',
            description: formData.get('description')?.toString() || '',
            about: formData.get('about')?.toString() || '',
            languages: this.getSelectedLanguages(),
            projects: projects,
            experiences: experiences,
            social: {
                facebook: formData.get('facebook')?.toString() || '',
                instagram: formData.get('instagram')?.toString() || '',
                github: formData.get('github')?.toString() || '',
                linkedin: formData.get('linkedin')?.toString() || ''
            }
        };
    }

    private generatePortfolioHTML(data: PortfolioData): string {
        // This will generate the output file
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.name} - Portfolio</title>
    <style>
        /* Reset and base styles */
        :root {
            --primary-dark: #2c3e50;    /* Dark blue-gray */
            --primary-light: #34495e;   /* Lighter blue-gray */
            --accent: #3498db;          /* Professional blue */
            --text-dark: #2c3e50;       /* Dark text */
            --text-light: #ffffff;      /* Light text */
            --bg-light: #f5f6fa;        /* Light background */
            --bg-white: #ffffff;        /* White background */
        }

        body {
            padding-top: 40px;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            background: var(--bg-light);
            color: var(--text-dark);
        }

        header {
            background: linear-gradient(135deg, var(--primary-dark), var(--primary-light));
            color: var(--text-light);
            padding: 8px 0;
            text-align: center;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        nav {
            margin: 5px 0;
            text-align: center;
        }

        nav a {
            text-decoration: none;  
            margin: 0 12px;
            color: #ffffff;
            font-weight: bold;
            transition: color 0.3s;
            cursor: pointer;
            font-size: 0.95em;
            letter-spacing: 0.5px;
        }

        nav a:hover {
            color: var(--accent);
        }

        .container, .main {
            max-width: 1000px;
            margin: 30px auto auto auto;
            padding: 30px;
        }

        section {
            margin-bottom: 100px;
            scroll-margin-top: 60px;
        }

        .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        #languages, #frameworks, #experience {
            background: transparent;
            box-shadow: none;
            padding: 0;
        }

        .skills {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 20px 0;
        }

        .skill {
            background: var(--bg-white);
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s, box-shadow 0.3s;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .skill:hover {
            transform: translateY(-10px);
            box-shadow: 0 6px 12px rgba(44, 62, 80, 0.1);
        }

        .skill-icon {
            width: 80px;
            height: 80px;
            margin-bottom: 15px;
        }

        .skill-name {
            font-size: 1.2em;
            font-weight: bold;
            margin-top: 10px;
            color: #333;
        }

        footer {
            text-align: center;
            padding: 15px 0;
            background: linear-gradient(135deg, var(--primary-dark), var(--primary-light));
            color: var(--text-light);
            font-size: 0.9em;
            box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
        }

        footer p {
            margin: 0;
            line-height: 1.5;
        }

        footer a {
            color: #3498db;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        footer a:hover {
            color: var(--text-light);
            text-decoration: underline;
        }

        .hero-section {
            text-align: center;
            padding: 400px 20px;
            background: linear-gradient(135deg, var(--bg-white), var(--bg-light));
            margin-bottom: 30px;
            border-bottom: 1px solid #e9ecef;
        }

        .hero-section h1 {
            font-size: 3em;
            margin-top: -120px;
            margin-bottom: 20px;
            color: #333;
        }

        .hero-section p {
            font-size: 1.2em;
            color: #666;
            margin-bottom: 30px;
        }

        .cta-button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, var(--accent), #5dade2);
            color: var(--text-light);
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            transition: transform 0.3s, box-shadow 0.3s;
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
            margin: 5px;
        }

        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
        }

        .cta-button span {
            display: inline-block;
            animation: arrowMove 1.5s infinite ease-in-out;
        }

        @keyframes arrowMove {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translateX(5px);
            }
            100% {
                transform: translateX(0);
            }
        }

        .cta-button:hover span {
            animation: none;
            transform: translateX(3px);
        }

        .section-title {
            text-align: center;
            margin-bottom: 40px;
            position: relative;
        }

        .section-title h2 {
            font-size: 2.5em;
            color: var(--primary-dark);
            margin-bottom: 15px;
            position: relative;
            display: inline-block;
        }

        .title-underline {
            width: 80px;
            height: 4px;
            background: linear-gradient(135deg, var(--accent), #5dade2);
            margin: 0 auto 20px;
            border-radius: 2px;
        }

        .section-title .subtitle {
            color: var(--primary-light);
            font-size: 1.2em;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            font-weight: 300;
        }

        .about-content {
            padding: 20px;
            border-radius: 15px;
            background: var(--bg-white);
            box-shadow: 0 10px 20px rgba(44, 62, 80, 0.05);
            transition: transform 0.3s ease;
        }

        .about-content:hover {
            transform: translateY(-5px);
        }

        .highlight-text {
            font-size: 1.1em;
            line-height: 1.8;
            color: var(--text-dark);
            padding: 20px;
            border-left: 4px solid var(--accent);
            background: rgba(52, 152, 219, 0.05);
            margin: 0;
        }

        /* Add animation for the section */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        #about {
            animation: fadeInUp 0.8s ease-out;
        }

        html {
            scroll-behavior: smooth;
        }

        .cta-button:active {
            transform: scale(0.98);
        }

        .hidden-sec {
            display: none;
        }

        .back-to-top {
            position: fixed;
            bottom: 60px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--accent), #5dade2);
            color: white;
            border-radius: 50%;
            display: none;
            justify-content: center;
            align-items: center;
            text-decoration: none;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
            z-index: 1000;
        }

        .back-to-top .arrow {
            font-size: 25px;
            line-height: 50px;
            margin-left: 17.5px;
        }

        .back-to-top .tooltip {
            position: absolute;
            top: -80px;
            left: 35%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 14px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        .back-to-top .tooltip::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px;
            border-style: solid;
            border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
        }

        .back-to-top:hover .tooltip {
            opacity: 1;
            visibility: visible;
            top: -45px;
        }

        .back-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .main {
            display: flex; /* Ensure flexbox is applied */
            flex-direction: column; /* Stack children vertically */
            align-items: center; /* Center children horizontally */
            justify-content: center; /* Center children vertically */
        }
        
        .projects {
            margin-top: -30px;
            text-align: center; /* Center the section title */
        }

        .projects-grid {
            display: flex; /* Use flexbox for inline layout */
            flex-wrap: wrap; /* Allow wrapping to the next line */
            justify-content: center; /* Center the cards horizontally */
            gap: 1.5rem; /* Space between cards */
            padding: 1rem; /* Padding around the grid */
        }

        .project-card {
            background: white; /* White background for cards */
            border-radius: 8px; /* Rounded corners */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
            padding: 1.5rem; /* Padding inside the card */
            width: 300px; /* Fixed width for cards */
            transition: transform 0.2s; /* Smooth transition for hover effect */
        }

        .project-card:hover {
            transform: translateY(-5px); /* Lift effect on hover */
        }

        .project-info h3 {
            margin-bottom: 0.5rem;
            font-size: 1.5rem;
            color: #2c3e50;
        }

        .project-info p {
            margin-bottom: 1rem;
            color: #666;
        }

        .project-languages {
            margin-bottom: 1rem;
        }

        .language-tag {
            background-color: #e3f2fd;
            border-radius: 12px;
            padding: 0.3rem 0.6rem;
            margin-right: 0.5rem;
            display: inline-block;
            font-size: 0.9rem;
            color: #3498db;
        }

        .project-link {
            display: inline-block;
            padding: 0.5rem 1rem;
            background-color: #3498db;
            color: white;
            border-radius: 5px;
            text-decoration: none;
            transition: background-color 0.3s;
        }

        .project-link:hover {
            background-color: #2980b9;
        }
        
        .experience {
            padding: 2rem 0; /* Add padding to the top and bottom */
        }

        .experience h2 {
            text-align: center; /* Center the section title */
            margin-bottom: 1.5rem; /* Space below the title */
            color: var(--primary-dark); /* Use your primary color */
        }

        /* Base styles for experience grid */
        .experience-grid {
            display: grid; /* Use flexbox for layout */
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px; /* Space between cards */
            padding: 20px 0; /* Padding around the grid */
        }

        .experience-card {
            background: white; /* White background for cards */
            border-radius: 8px; /* Rounded corners */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
            padding: 25px; /* Padding inside the card */
            transition: transform 0.2s; /* Smooth transition for hover effect */
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .experience-card:hover {
            transform: translateY(-5px); /* Lift effect on hover */
        }

        .experience-info h3 {
            margin-bottom: 0.5rem; /* Space below the company name */
            font-size: 1.5rem; /* Font size for company name */
            color: #2c3e50; /* Dark color for text */
        }

        .experience-info p {
            margin-bottom: 0.5rem; /* Space below paragraphs */
            color: #666; /* Gray color for text */
        }

        .experience-info a {
            color: var(--accent); /* Accent color for links */
            text-decoration: none; /* Remove underline from links */
        }

        .experience-info a:hover {
            text-decoration: underline; /* Underline on hover for links */
        }

        .social-links {
            display: flex;
            justify-content: center; /* Center the social links */
            margin: 1rem 0; /* Add some margin */
        }

        .social-link {
            display: inline-block; /* Make the link inline-block */
            margin: 0 10px; /* Space between icons */
        }

        .social-icon {
            width: 30px; /* Set width to 30px */
            height: 30px; /* Set height to 30px */
            transition: transform 0.2s; /* Add transition for hover effect */
        }

        .social-icon:hover {
            transform: scale(1.1); /* Slightly enlarge the icon on hover */
        }

        footer {
            text-align: center;
            padding: 1rem 0;
            background-color: #2c3e50;
            color: white;
            margin-top: 2rem;
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="#about">About</a>
            <a href="#languages">Languages</a>
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>

    <div class="hero-section">
        <h1>${data.name}</h1>
        <p>${data.position}</p>
        <p>${data.introduction}</p>
        <a href="#about" class="cta-button" onclick="smoothScroll(event, 'about')">Get Started <span>&#187;</span></a>
        <a href="${data.resume}" class="cta-button">Curriculum Vitae</span></a>
    </div>

    <div class="container">
        <section id="about" class="card">
            <div class="section-title">
                <h2>About Me</h2>
                <div class="title-underline"></div>
                <p class="subtitle">${data.description}</p>
            </div>
            <div class="about-content">
                <div class="about-text">
                    <p class="highlight-text">${data.about}</p>
                </div>
            </div>
        </section>

        <section id="languages">
            <div class="section-title">
                <h2>Languages</h2>
                <p>Programming languages I work with</p>
            </div>
            <div class="skills">
                ${data.languages.length > 0 ? 
                    data.languages.map(lang => {
                        const displayName = languageDisplayMap[lang]?.display || lang;
                        const logoValue = languageDisplayMap[lang]?.logo || lang;
                        const logoType = languageDisplayMap[lang]?.logoType || lang;
                        return `
                            <div class="skill">
                                <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${logoValue.toLocaleLowerCase()}/${logoValue.toLocaleLowerCase()}${logoType.toLocaleLowerCase()}.svg" alt="${displayName}" class="skill-icon" onerror="this.onerror=null; this.src='path/to/default-icon.svg';">
                                <div class="skill-name">${displayName}</div>
                            </div>`;
                    }).join('') : 
                    '<p>No current skills available.</p>' // Fallback message if no languages are provided
                }
            </div>
        </section>

        <section id="projects" class="projects">
            <h2>My Projects</h2>
            <div class="projects-grid">
                ${data.projects.map(project => `
                    <div class="project-card">
                        <div class="project-info">
                            <h3>${project.name}</h3>
                            <p>${project.description}</p>
                            <div class="project-languages">
                                ${project.languages.map(lang => `<span class="language-tag">${lang}</span>`).join('')}
                            </div>
                            <a href="${project.link}" target="_blank" class="project-link">View Project</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        
        <section id="experience">
            <h2 style="text-align: center;">Work Experience</h2>
            <div class="experience-grid">
                ${data.experiences.map(exp => `
                    <div class="experience-card">
                        <div class="experience-info">
                            <h3>${exp.company}</h3>
                            <p><strong>Position:</strong> ${exp.role}</p>
                            <p><strong>Years:</strong> ${exp.years}</p>
                            <p><strong>Website:</strong> <a href="${exp.companyWebsite}" target="_blank">${exp.companyWebsite}</a></p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>

        <section id="contact" class="contact">
            <h2 style="text-align: center;">Connect With Me</h2>
            <div class="social-links">
                ${data.social.facebook ? `
                    <a href="${data.social.facebook}" target="_blank" class="social-link">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg" alt="Facebook" class="social-icon">
                    </a>` : ''}
                ${data.social.instagram ? `
                    <a href="${data.social.instagram}" target="_blank" class="social-link">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" class="social-icon">
                    </a>` : ''}
                ${data.social.github ? `
                    <a href="${data.social.github}" target="_blank" class="social-link">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" class="social-icon">
                    </a>` : ''}
                ${data.social.linkedin ? `
                    <a href="${data.social.linkedin}" target="_blank" class="social-link">
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" class="social-icon">
                    </a>` : ''}
            </div>
        </section>
    </div>

    <footer>
        <p>&copy; ${new Date().getFullYear()} ${data.name}. All rights reserved.</p>
    </footer>
</body>
</html>`;
    }

    private handleSubmit(e: Event): void {
        e.preventDefault();
        const portfolioData = this.collectFormData();
        const outputHTML = this.generatePortfolioHTML(portfolioData);
        
        // For development, you can console.log the output
        console.log(outputHTML);
        
        // In a real application, you would typically:
        // 1. Send this to a backend server to save as a file
        // 2. Or use the File System Access API (if supported)
        // 3. Or create a download link
        
        const blob = new Blob([outputHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the portfolio builder when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioBuilder();
});

// Mapping of language values to their display names
const languageDisplayMap: { [key: string]: { display: string; logo: string, logoType: string } } = {
    HTML5: { display: 'HTML5', logo: 'HTML5', logoType: '-original' },
    CSS3: { display: 'CSS3', logo: 'CSS3', logoType: '-original' },
    JavaScript: { display: 'Javascript', logo: 'Javascript', logoType: '-original' },
    TypeScript: { display: 'Typescript', logo: 'Typescript', logoType: '-original' },
    Python: { display: 'Python', logo: 'Python', logoType: '-original' },
    Java: { display: 'Java', logo: 'Java', logoType: '-original' },
    CPLUSPLUS: { display: 'C++', logo: 'CPLUSPLUS', logoType: '-original' },
    CSHARP: { display: 'C#', logo: 'CSHARP', logoType: '-original' },
    C: { display: 'C', logo: 'C', logoType: '-original' },
    DotNetCore: { display: '.NET Core', logo: 'DotNetCore', logoType: '-original' },
    PHP: { display: 'PHP', logo: 'PHP', logoType: '-original' },
    Ruby: { display: 'Ruby', logo: 'Ruby', logoType: '-original' },
    Swift: { display: 'Swift', logo: 'Swift', logoType: '-original' },
    Rust: { display: 'Rust', logo: 'Rust', logoType: '-original' },
    Perl: { display: 'Perl', logo: 'Perl', logoType: '-original' },
    Go: { display: 'Go', logo: 'Go', logoType: '-original' },
    Node: { display: 'Node.js', logo: 'Nodejs', logoType: '-original' },
    Vue: { display: 'Vue.js', logo: 'Vuejs', logoType: '-original' },
    Angular: { display: 'AngularJS', logo: 'Angular', logoType: '-original' },
    React: { display: 'React', logo: 'React', logoType: '-original' },
    JQuery: { display: 'jQuery', logo: 'JQuery', logoType: '-original' },
    Next: { display: 'Next.js', logo: 'NextJS', logoType: '-original' },
    Laravel: { display: 'Laravel', logo: 'Laravel', logoType: '-original' },
    'Spring Boot': { display: 'Spring Boot', logo: 'Spring', logoType: '-original' },
    Django: { display: 'Django', logo: 'Django', logoType: '-plain' },
    Drupal: { display: 'Drupal', logo: 'Drupal', logoType: '-plain' },
    Flask: { display: 'Flask', logo: 'Flask', logoType: '-original' },
    Wordpress: { display: 'WordPress', logo: 'Wordpress', logoType: '-original' },
    Codeigniter: { display: 'CodeIgniter', logo: 'Codeigniter', logoType: '-plain' },
    TailwindCSS: { display: 'Tailwind CSS', logo: 'TailwindCSS', logoType: '-original' },
    'React Native': { display: 'React Native', logo: 'React', logoType: '-original' }, // Use React logo
    'Vue Native': { display: 'Vue Native', logo: 'Vuejs', logoType: '-original' },       // Use Vue logo
    Flutter: { display: 'Flutter', logo: 'Flutter', logoType: '-original' },
    MySQL: { display: 'MySQL', logo: 'MySQL', logoType: '-original' },
    PostgreSQL: { display: 'PostgreSQL', logo: 'PostgreSQL', logoType: '-original' },
    Cassandra: { display: 'Cassandra', logo: 'Cassandra', logoType: '-original' },
    Supabase: { display: 'Supabase', logo: 'Supabase', logoType: '-original' },
    MongoDB: { display: 'MongoDB', logo: 'MongoDB', logoType: '-original' },
}; 