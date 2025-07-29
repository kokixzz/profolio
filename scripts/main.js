var PortfolioBuilder = /** @class */ (function () {
    function PortfolioBuilder() {
        this.selectedLanguages = [];
        this.initializeElements();
        this.setupEventListeners();
    }
    PortfolioBuilder.prototype.initializeElements = function () {
        this.form = document.getElementById('portfolioForm');
        this.projectsContainer = document.getElementById('projectsContainer');
        this.experiencesContainer = document.getElementById('experiencesContainer');
        this.addProjectButton = document.getElementById('addProject');
        this.addExperienceButton = document.getElementById('addExperience');
        this.languageSelect = document.getElementById('languageSelect');
        this.selectedChips = document.getElementById('selectedChips');
    };
    PortfolioBuilder.prototype.setupEventListeners = function () {
        var _this = this;
        this.form.addEventListener('submit', function (e) { return _this.handleSubmit(e); });
        this.addProjectButton.addEventListener('click', function () { return _this.addProjectEntry(); });
        this.addExperienceButton.addEventListener('click', function () { return _this.addExperienceEntry(); });
        this.languageSelect.addEventListener('change', function () { return _this.handleLanguageSelection(); });
        document.querySelectorAll('.remove-project').forEach(function (button) {
            button.addEventListener('click', function (e) { return _this.removeProjectEntry(e); });
        });
    };
    PortfolioBuilder.prototype.addProjectEntry = function () {
        var _this = this;
        var projectEntry = document.createElement('div');
        projectEntry.className = 'project-entry';
        projectEntry.innerHTML = "\n            <button type=\"button\" class=\"remove-project\">\u00D7</button>\n            <div class=\"form-group\">\n                <label>Project Name:</label>\n                <input type=\"text\" name=\"projectName[]\" required>\n            </div>\n            <div class=\"form-group\">\n                <label>Project Description:</label>\n                <textarea name=\"projectDescription[]\" rows=\"3\" required></textarea>\n            </div>\n            <div class=\"form-group\">\n                <label>Project Languages:</label>\n                <input type=\"text\" name=\"projectLanguages[]\" placeholder=\"e.g., HTML, CSS, JavaScript\" required>\n            </div>\n            <div class=\"form-group\">\n                <label>Project Link:</label>\n                <input type=\"url\" name=\"projectLink[]\" placeholder=\"GitHub or Live Demo URL\" required>\n            </div>\n        ";
        var removeButton = projectEntry.querySelector('.remove-project');
        removeButton === null || removeButton === void 0 ? void 0 : removeButton.addEventListener('click', function (e) { return _this.removeProjectEntry(e); });
        this.projectsContainer.appendChild(projectEntry);
    };
    PortfolioBuilder.prototype.removeProjectEntry = function (e) {
        var button = e.target;
        var projectEntry = button.closest('.project-entry');
        if (projectEntry) {
            projectEntry.remove();
        }
    };
    PortfolioBuilder.prototype.addExperienceEntry = function () {
        var _this = this;
        var experienceEntry = document.createElement('div');
        experienceEntry.className = 'experience-entry';
        experienceEntry.innerHTML = "\n            <button type=\"button\" class=\"remove-experience\">\u00D7</button>\n            <div class=\"form-group\">\n                <label>Company:</label>\n                <input type=\"text\" name=\"experienceCompany[]\" required>\n            </div>\n            <div class=\"form-group\">\n                <label>Position/Role:</label>\n                <input type=\"text\" name=\"experienceRole[]\" required>\n            </div>\n            <div class=\"form-group\">\n                <label>Years:</label>\n                <input type=\"text\" name=\"experienceYears[]\" placeholder=\"e.g., 2019 - 2022 or 2022 - Present\" required>\n            </div>\n            <div class=\"form-group\">\n                <label>Company Website:</label>\n                <input type=\"url\" name=\"experienceCompanyWebsite[]\" placeholder=\"Website of the Company\" required>\n            </div>\n        ";
        var removeExpButton = experienceEntry.querySelector('.remove-experience');
        removeExpButton === null || removeExpButton === void 0 ? void 0 : removeExpButton.addEventListener('click', function (e) { return _this.removeExperienceEntry(e); });
        this.experiencesContainer.appendChild(experienceEntry);
    };
    PortfolioBuilder.prototype.removeExperienceEntry = function (e) {
        var button = e.target;
        var experienceEntry = button.closest('.experience-entry');
        if (experienceEntry) {
            experienceEntry.remove();
        }
    };
    PortfolioBuilder.prototype.handleLanguageSelection = function () {
        var selectedValue = this.languageSelect.value;
        if (selectedValue && this.selectedLanguages.indexOf(selectedValue) === -1) {
            this.addLanguageChip(selectedValue);
            this.selectedLanguages.push(selectedValue);
            this.languageSelect.value = '';
        }
    };
    PortfolioBuilder.prototype.addLanguageChip = function (language) {
        var _this = this;
        var selectedOption = this.languageSelect.options[this.languageSelect.selectedIndex];
        var displayText = selectedOption.getAttribute('data-display') || language;
        var chip = document.createElement('div');
        chip.className = 'chip';
        chip.innerHTML = "\n            <span>".concat(displayText, "</span>\n            <button type=\"button\" aria-label=\"Remove ").concat(displayText, "\">&times;</button>\n        ");
        var removeButton = chip.querySelector('button');
        removeButton === null || removeButton === void 0 ? void 0 : removeButton.addEventListener('click', function () {
            chip.remove();
            var index = _this.selectedLanguages.indexOf(language);
            if (index > -1) {
                _this.selectedLanguages.splice(index, 1);
            }
        });
        this.selectedChips.appendChild(chip);
    };
    PortfolioBuilder.prototype.getSelectedLanguages = function () {
        return this.selectedLanguages;
    };
    PortfolioBuilder.prototype.collectFormData = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        var formData = new FormData(this.form);
        // Collect projects data
        var projectNames = formData.getAll('projectName[]');
        var projectDescriptions = formData.getAll('projectDescription[]');
        var projectLanguages = formData.getAll('projectLanguages[]');
        var projectLinks = formData.getAll('projectLink[]');
        // Collect experiences data
        var experienceCompany = formData.getAll('experienceCompany[]');
        var experienceRole = formData.getAll('experienceRole[]');
        var experienceYears = formData.getAll('experienceYears[]');
        var experienceCompanyWebsite = formData.getAll('experienceCompanyWebsite[]');
        var projects = projectNames.map(function (name, index) { return ({
            name: name.toString(),
            description: projectDescriptions[index].toString(),
            languages: projectLanguages[index].toString().split(',').map(function (lang) { return lang.trim(); }),
            link: projectLinks[index].toString()
        }); });
        var experiences = experienceCompany.map(function (name, index) { return ({
            company: name.toString(),
            role: experienceRole[index].toString(),
            years: experienceYears[index].toString(),
            companyWebsite: experienceCompanyWebsite[index].toString()
        }); });
        return {
            name: ((_a = formData.get('name')) === null || _a === void 0 ? void 0 : _a.toString()) || '',
            position: ((_b = formData.get('position')) === null || _b === void 0 ? void 0 : _b.toString()) || '',
            resume: ((_c = formData.get('resume')) === null || _c === void 0 ? void 0 : _c.toString()) || '',
            introduction: ((_d = formData.get('introduction')) === null || _d === void 0 ? void 0 : _d.toString()) || '',
            description: ((_e = formData.get('description')) === null || _e === void 0 ? void 0 : _e.toString()) || '',
            about: ((_f = formData.get('about')) === null || _f === void 0 ? void 0 : _f.toString()) || '',
            languages: this.getSelectedLanguages(),
            projects: projects,
            experiences: experiences,
            social: {
                facebook: ((_g = formData.get('facebook')) === null || _g === void 0 ? void 0 : _g.toString()) || '',
                instagram: ((_h = formData.get('instagram')) === null || _h === void 0 ? void 0 : _h.toString()) || '',
                github: ((_j = formData.get('github')) === null || _j === void 0 ? void 0 : _j.toString()) || '',
                linkedin: ((_k = formData.get('linkedin')) === null || _k === void 0 ? void 0 : _k.toString()) || ''
            }
        };
    };
    PortfolioBuilder.prototype.generatePortfolioHTML = function (data) {
        // This will generate the output file
        return "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>".concat(data.name, " - Portfolio</title>\n    <style>\n        /* Reset and base styles */\n        :root {\n            --primary-dark: #2c3e50;    /* Dark blue-gray */\n            --primary-light: #34495e;   /* Lighter blue-gray */\n            --accent: #3498db;          /* Professional blue */\n            --text-dark: #2c3e50;       /* Dark text */\n            --text-light: #ffffff;      /* Light text */\n            --bg-light: #f5f6fa;        /* Light background */\n            --bg-white: #ffffff;        /* White background */\n        }\n\n        body {\n            padding-top: 40px;\n            font-family: Arial, sans-serif;\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n            background: var(--bg-light);\n            color: var(--text-dark);\n        }\n\n        header {\n            background: linear-gradient(135deg, var(--primary-dark), var(--primary-light));\n            color: var(--text-light);\n            padding: 8px 0;\n            text-align: center;\n            position: fixed;\n            width: 100%;\n            top: 0;\n            z-index: 1000;\n            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n        }\n\n        nav {\n            margin: 5px 0;\n            text-align: center;\n        }\n\n        nav a {\n            text-decoration: none;  \n            margin: 0 12px;\n            color: #ffffff;\n            font-weight: bold;\n            transition: color 0.3s;\n            cursor: pointer;\n            font-size: 0.95em;\n            letter-spacing: 0.5px;\n        }\n\n        nav a:hover {\n            color: var(--accent);\n        }\n\n        .container, .main {\n            max-width: 1000px;\n            margin: 30px auto auto auto;\n            padding: 30px;\n        }\n\n        section {\n            margin-bottom: 100px;\n            scroll-margin-top: 60px;\n        }\n\n        .card {\n            background: white;\n            padding: 20px;\n            border-radius: 8px;\n            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n        }\n\n        #languages, #frameworks, #experience {\n            background: transparent;\n            box-shadow: none;\n            padding: 0;\n        }\n\n        .skills {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n            gap: 20px;\n            padding: 20px 0;\n        }\n\n        .skill {\n            background: var(--bg-white);\n            padding: 25px;\n            border-radius: 15px;\n            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);\n            transition: transform 0.3s, box-shadow 0.3s;\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            text-align: center;\n        }\n\n        .skill:hover {\n            transform: translateY(-10px);\n            box-shadow: 0 6px 12px rgba(44, 62, 80, 0.1);\n        }\n\n        .skill-icon {\n            width: 80px;\n            height: 80px;\n            margin-bottom: 15px;\n        }\n\n        .skill-name {\n            font-size: 1.2em;\n            font-weight: bold;\n            margin-top: 10px;\n            color: #333;\n        }\n\n        footer {\n            text-align: center;\n            padding: 15px 0;\n            background: linear-gradient(135deg, var(--primary-dark), var(--primary-light));\n            color: var(--text-light);\n            font-size: 0.9em;\n            box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);\n        }\n\n        footer p {\n            margin: 0;\n            line-height: 1.5;\n        }\n\n        footer a {\n            color: #3498db;\n            text-decoration: none;\n            transition: color 0.3s ease;\n        }\n\n        footer a:hover {\n            color: var(--text-light);\n            text-decoration: underline;\n        }\n\n        .hero-section {\n            text-align: center;\n            padding: 400px 20px;\n            background: linear-gradient(135deg, var(--bg-white), var(--bg-light));\n            margin-bottom: 30px;\n            border-bottom: 1px solid #e9ecef;\n        }\n\n        .hero-section h1 {\n            font-size: 3em;\n            margin-top: -120px;\n            margin-bottom: 20px;\n            color: #333;\n        }\n\n        .hero-section p {\n            font-size: 1.2em;\n            color: #666;\n            margin-bottom: 30px;\n        }\n\n        .cta-button {\n            display: inline-block;\n            padding: 15px 30px;\n            background: linear-gradient(135deg, var(--accent), #5dade2);\n            color: var(--text-light);\n            text-decoration: none;\n            border-radius: 25px;\n            font-weight: bold;\n            transition: transform 0.3s, box-shadow 0.3s;\n            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);\n            margin: 5px;\n        }\n\n        .cta-button:hover {\n            transform: translateY(-3px);\n            box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);\n        }\n\n        .cta-button span {\n            display: inline-block;\n            animation: arrowMove 1.5s infinite ease-in-out;\n        }\n\n        @keyframes arrowMove {\n            0% {\n                transform: translateX(0);\n            }\n            50% {\n                transform: translateX(5px);\n            }\n            100% {\n                transform: translateX(0);\n            }\n        }\n\n        .cta-button:hover span {\n            animation: none;\n            transform: translateX(3px);\n        }\n\n        .section-title {\n            text-align: center;\n            margin-bottom: 40px;\n            position: relative;\n        }\n\n        .section-title h2 {\n            font-size: 2.5em;\n            color: var(--primary-dark);\n            margin-bottom: 15px;\n            position: relative;\n            display: inline-block;\n        }\n\n        .title-underline {\n            width: 80px;\n            height: 4px;\n            background: linear-gradient(135deg, var(--accent), #5dade2);\n            margin: 0 auto 20px;\n            border-radius: 2px;\n        }\n\n        .section-title .subtitle {\n            color: var(--primary-light);\n            font-size: 1.2em;\n            line-height: 1.6;\n            max-width: 800px;\n            margin: 0 auto;\n            font-weight: 300;\n        }\n\n        .about-content {\n            padding: 20px;\n            border-radius: 15px;\n            background: var(--bg-white);\n            box-shadow: 0 10px 20px rgba(44, 62, 80, 0.05);\n            transition: transform 0.3s ease;\n        }\n\n        .about-content:hover {\n            transform: translateY(-5px);\n        }\n\n        .highlight-text {\n            font-size: 1.1em;\n            line-height: 1.8;\n            color: var(--text-dark);\n            padding: 20px;\n            border-left: 4px solid var(--accent);\n            background: rgba(52, 152, 219, 0.05);\n            margin: 0;\n        }\n\n        /* Add animation for the section */\n        @keyframes fadeInUp {\n            from {\n                opacity: 0;\n                transform: translateY(20px);\n            }\n            to {\n                opacity: 1;\n                transform: translateY(0);\n            }\n        }\n\n        #about {\n            animation: fadeInUp 0.8s ease-out;\n        }\n\n        html {\n            scroll-behavior: smooth;\n        }\n\n        .cta-button:active {\n            transform: scale(0.98);\n        }\n\n        .hidden-sec {\n            display: none;\n        }\n\n        .back-to-top {\n            position: fixed;\n            bottom: 60px;\n            right: 20px;\n            width: 50px;\n            height: 50px;\n            background: linear-gradient(135deg, var(--accent), #5dade2);\n            color: white;\n            border-radius: 50%;\n            display: none;\n            justify-content: center;\n            align-items: center;\n            text-decoration: none;\n            cursor: pointer;\n            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\n            transition: all 0.3s ease;\n            z-index: 1000;\n        }\n\n        .back-to-top .arrow {\n            font-size: 25px;\n            line-height: 50px;\n            margin-left: 17.5px;\n        }\n\n        .back-to-top .tooltip {\n            position: absolute;\n            top: -80px;\n            left: 35%;\n            transform: translateX(-50%);\n            background: rgba(0, 0, 0, 0.8);\n            color: white;\n            padding: 5px 10px;\n            border-radius: 5px;\n            font-size: 14px;\n            white-space: nowrap;\n            opacity: 0;\n            visibility: hidden;\n            transition: all 0.3s ease;\n        }\n\n        .back-to-top .tooltip::after {\n            content: '';\n            position: absolute;\n            bottom: -5px;\n            left: 50%;\n            transform: translateX(-50%);\n            border-width: 5px;\n            border-style: solid;\n            border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;\n        }\n\n        .back-to-top:hover .tooltip {\n            opacity: 1;\n            visibility: visible;\n            top: -45px;\n        }\n\n        .back-to-top:hover {\n            transform: translateY(-5px);\n            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);\n        }\n        \n        .main {\n            display: flex; /* Ensure flexbox is applied */\n            flex-direction: column; /* Stack children vertically */\n            align-items: center; /* Center children horizontally */\n            justify-content: center; /* Center children vertically */\n        }\n        \n        .projects {\n            margin-top: -30px;\n            text-align: center; /* Center the section title */\n        }\n\n        .projects-grid {\n            display: flex; /* Use flexbox for inline layout */\n            flex-wrap: wrap; /* Allow wrapping to the next line */\n            justify-content: center; /* Center the cards horizontally */\n            gap: 1.5rem; /* Space between cards */\n            padding: 1rem; /* Padding around the grid */\n        }\n\n        .project-card {\n            background: white; /* White background for cards */\n            border-radius: 8px; /* Rounded corners */\n            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */\n            padding: 1.5rem; /* Padding inside the card */\n            width: 300px; /* Fixed width for cards */\n            transition: transform 0.2s; /* Smooth transition for hover effect */\n        }\n\n        .project-card:hover {\n            transform: translateY(-5px); /* Lift effect on hover */\n        }\n\n        .project-info h3 {\n            margin-bottom: 0.5rem;\n            font-size: 1.5rem;\n            color: #2c3e50;\n        }\n\n        .project-info p {\n            margin-bottom: 1rem;\n            color: #666;\n        }\n\n        .project-languages {\n            margin-bottom: 1rem;\n        }\n\n        .language-tag {\n            background-color: #e3f2fd;\n            border-radius: 12px;\n            padding: 0.3rem 0.6rem;\n            margin-right: 0.5rem;\n            display: inline-block;\n            font-size: 0.9rem;\n            color: #3498db;\n        }\n\n        .project-link {\n            display: inline-block;\n            padding: 0.5rem 1rem;\n            background-color: #3498db;\n            color: white;\n            border-radius: 5px;\n            text-decoration: none;\n            transition: background-color 0.3s;\n        }\n\n        .project-link:hover {\n            background-color: #2980b9;\n        }\n        \n        .experience {\n            padding: 2rem 0; /* Add padding to the top and bottom */\n        }\n\n        .experience h2 {\n            text-align: center; /* Center the section title */\n            margin-bottom: 1.5rem; /* Space below the title */\n            color: var(--primary-dark); /* Use your primary color */\n        }\n\n        /* Base styles for experience grid */\n        .experience-grid {\n            display: grid; /* Use flexbox for layout */\n            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n            gap: 20px; /* Space between cards */\n            padding: 20px 0; /* Padding around the grid */\n        }\n\n        .experience-card {\n            background: white; /* White background for cards */\n            border-radius: 8px; /* Rounded corners */\n            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */\n            padding: 25px; /* Padding inside the card */\n            transition: transform 0.2s; /* Smooth transition for hover effect */\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n        }\n\n        .experience-card:hover {\n            transform: translateY(-5px); /* Lift effect on hover */\n        }\n\n        .experience-info h3 {\n            margin-bottom: 0.5rem; /* Space below the company name */\n            font-size: 1.5rem; /* Font size for company name */\n            color: #2c3e50; /* Dark color for text */\n        }\n\n        .experience-info p {\n            margin-bottom: 0.5rem; /* Space below paragraphs */\n            color: #666; /* Gray color for text */\n        }\n\n        .experience-info a {\n            color: var(--accent); /* Accent color for links */\n            text-decoration: none; /* Remove underline from links */\n        }\n\n        .experience-info a:hover {\n            text-decoration: underline; /* Underline on hover for links */\n        }\n\n        .social-links {\n            display: flex;\n            justify-content: center; /* Center the social links */\n            margin: 1rem 0; /* Add some margin */\n        }\n\n        .social-link {\n            display: inline-block; /* Make the link inline-block */\n            margin: 0 10px; /* Space between icons */\n        }\n\n        .social-icon {\n            width: 30px; /* Set width to 30px */\n            height: 30px; /* Set height to 30px */\n            transition: transform 0.2s; /* Add transition for hover effect */\n        }\n\n        .social-icon:hover {\n            transform: scale(1.1); /* Slightly enlarge the icon on hover */\n        }\n\n        footer {\n            text-align: center;\n            padding: 1rem 0;\n            background-color: #2c3e50;\n            color: white;\n            margin-top: 2rem;\n        }\n    </style>\n</head>\n<body>\n    <header>\n        <nav>\n            <a href=\"#about\">About</a>\n            <a href=\"#languages\">Languages</a>\n            <a href=\"#projects\">Projects</a>\n            <a href=\"#experience\">Experience</a>\n            <a href=\"#contact\">Contact</a>\n        </nav>\n    </header>\n\n    <div class=\"hero-section\">\n        <h1>").concat(data.name, "</h1>\n        <p>").concat(data.position, "</p>\n        <p>").concat(data.introduction, "</p>\n        <a href=\"#about\" class=\"cta-button\" onclick=\"smoothScroll(event, 'about')\">Get Started <span>&#187;</span></a>\n        <a href=\"").concat(data.resume, "\" class=\"cta-button\">Curriculum Vitae</span></a>\n    </div>\n\n    <div class=\"container\">\n        <section id=\"about\" class=\"card\">\n            <div class=\"section-title\">\n                <h2>About Me</h2>\n                <div class=\"title-underline\"></div>\n                <p class=\"subtitle\">").concat(data.description, "</p>\n            </div>\n            <div class=\"about-content\">\n                <div class=\"about-text\">\n                    <p class=\"highlight-text\">").concat(data.about, "</p>\n                </div>\n            </div>\n        </section>\n\n        <section id=\"languages\">\n            <div class=\"section-title\">\n                <h2>Languages</h2>\n                <p>Programming languages I work with</p>\n            </div>\n            <div class=\"skills\">\n                ").concat(data.languages.length > 0 ?
            data.languages.map(function (lang) {
                var _a, _b, _c;
                var displayName = ((_a = languageDisplayMap[lang]) === null || _a === void 0 ? void 0 : _a.display) || lang;
                var logoValue = ((_b = languageDisplayMap[lang]) === null || _b === void 0 ? void 0 : _b.logo) || lang;
                var logoType = ((_c = languageDisplayMap[lang]) === null || _c === void 0 ? void 0 : _c.logoType) || lang;
                return "\n                            <div class=\"skill\">\n                                <img src=\"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/".concat(logoValue.toLocaleLowerCase(), "/").concat(logoValue.toLocaleLowerCase()).concat(logoType.toLocaleLowerCase(), ".svg\" alt=\"").concat(displayName, "\" class=\"skill-icon\" onerror=\"this.onerror=null; this.src='path/to/default-icon.svg';\">\n                                <div class=\"skill-name\">").concat(displayName, "</div>\n                            </div>");
            }).join('') :
            '<p>No current skills available.</p>' // Fallback message if no languages are provided
        , "\n            </div>\n        </section>\n\n        <section id=\"projects\" class=\"projects\">\n            <h2>My Projects</h2>\n            <div class=\"projects-grid\">\n                ").concat(data.projects.map(function (project) { return "\n                    <div class=\"project-card\">\n                        <div class=\"project-info\">\n                            <h3>".concat(project.name, "</h3>\n                            <p>").concat(project.description, "</p>\n                            <div class=\"project-languages\">\n                                ").concat(project.languages.map(function (lang) { return "<span class=\"language-tag\">".concat(lang, "</span>"); }).join(''), "\n                            </div>\n                            <a href=\"").concat(project.link, "\" target=\"_blank\" class=\"project-link\">View Project</a>\n                        </div>\n                    </div>\n                "); }).join(''), "\n            </div>\n        </section>\n        \n        <section id=\"experience\">\n            <h2 style=\"text-align: center;\">Work Experience</h2>\n            <div class=\"experience-grid\">\n                ").concat(data.experiences.map(function (exp) { return "\n                    <div class=\"experience-card\">\n                        <div class=\"experience-info\">\n                            <h3>".concat(exp.company, "</h3>\n                            <p><strong>Position:</strong> ").concat(exp.role, "</p>\n                            <p><strong>Years:</strong> ").concat(exp.years, "</p>\n                            <p><strong>Website:</strong> <a href=\"").concat(exp.companyWebsite, "\" target=\"_blank\">").concat(exp.companyWebsite, "</a></p>\n                        </div>\n                    </div>\n                "); }).join(''), "\n            </div>\n        </section>\n\n        <section id=\"contact\" class=\"contact\">\n            <h2 style=\"text-align: center;\">Connect With Me</h2>\n            <div class=\"social-links\">\n                ").concat(data.social.facebook ? "\n                    <a href=\"".concat(data.social.facebook, "\" target=\"_blank\" class=\"social-link\">\n                        <img src=\"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg\" alt=\"Facebook\" class=\"social-icon\">\n                    </a>") : '', "\n                ").concat(data.social.instagram ? "\n                    <a href=\"".concat(data.social.instagram, "\" target=\"_blank\" class=\"social-link\">\n                        <img src=\"https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png\" alt=\"Instagram\" class=\"social-icon\">\n                    </a>") : '', "\n                ").concat(data.social.github ? "\n                    <a href=\"".concat(data.social.github, "\" target=\"_blank\" class=\"social-link\">\n                        <img src=\"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg\" alt=\"GitHub\" class=\"social-icon\">\n                    </a>") : '', "\n                ").concat(data.social.linkedin ? "\n                    <a href=\"".concat(data.social.linkedin, "\" target=\"_blank\" class=\"social-link\">\n                        <img src=\"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg\" alt=\"LinkedIn\" class=\"social-icon\">\n                    </a>") : '', "\n            </div>\n        </section>\n    </div>\n\n    <footer>\n        <p>&copy; ").concat(new Date().getFullYear(), " ").concat(data.name, ". All rights reserved.</p>\n    </footer>\n</body>\n</html>");
    };
    PortfolioBuilder.prototype.handleSubmit = function (e) {
        e.preventDefault();
        var portfolioData = this.collectFormData();
        var outputHTML = this.generatePortfolioHTML(portfolioData);
        // For development, you can console.log the output
        console.log(outputHTML);
        // In a real application, you would typically:
        // 1. Send this to a backend server to save as a file
        // 2. Or use the File System Access API (if supported)
        // 3. Or create a download link
        var blob = new Blob([outputHTML], { type: 'text/html' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    return PortfolioBuilder;
}());
// Initialize the portfolio builder when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new PortfolioBuilder();
});
// Mapping of language values to their display names
var languageDisplayMap = {
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
    'React Native': { display: 'React Native', logo: 'React', logoType: '-original' },
    'Vue Native': { display: 'Vue Native', logo: 'Vuejs', logoType: '-original' },
    Flutter: { display: 'Flutter', logo: 'Flutter', logoType: '-original' },
    MySQL: { display: 'MySQL', logo: 'MySQL', logoType: '-original' },
    PostgreSQL: { display: 'PostgreSQL', logo: 'PostgreSQL', logoType: '-original' },
    Cassandra: { display: 'Cassandra', logo: 'Cassandra', logoType: '-original' },
    Supabase: { display: 'Supabase', logo: 'Supabase', logoType: '-original' },
    MongoDB: { display: 'MongoDB', logo: 'MongoDB', logoType: '-original' },
};
