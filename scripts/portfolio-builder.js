/**
 * ProFolio - Portfolio Builder JS
 * Handles dynamic portfolio generation and user interactions
 */

class PortfolioBuilder {
  constructor() {
    this.portfolioData = {
      basics: {
        name: '',
        title: '',
        bio: '',
        email: '',
        website: '',
        profileImage: ''
      },
      skills: [],
      projects: [],
      experience: [],
      education: [],
      theme: {
        primaryColor: '#4F46E5',
        accentColor: '#F59E0B',
        layout: 'modern',
        fontFamily: 'Inter, sans-serif'
      }
    };
    
    this.projectCount = 1;
    this.experienceCount = 1;
    this.educationCount = 1;
    
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.init();
      });
    } else {
      this.init();
    }
  }
  
  init() {
    console.log("Initializing PortfolioBuilder...");
    
    // Make sure we initialize form field styles
    this.fixFormFields();
    
    this.initEventListeners();
    this.setupNavigationLinks();
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      });
    }
    
    // Load saved data if available
    this.loadPortfolio();
    
    // Set up theme controls with defaults
    this.loadThemeDefaults();
    
    // Render initial skills display
    this.renderSkills();
    
    // Show welcome notification
    setTimeout(() => {
      this.showNotification('Welcome to ProFolio! Start building your portfolio.');
    }, 1000);
    
    console.log("Portfolio Builder initialized");
  }
  
  fixFormFields() {
    // Fix for form fields not showing up correctly in Safari and some browsers
    document.querySelectorAll('input, textarea, select').forEach(field => {
      // Make sure a valid display style is applied
      if (getComputedStyle(field).display === 'none' && !field.classList.contains('sr-only')) {
        field.style.display = 'block';
      }
      
      // Force any hidden elements to be visible
      if (field.style.visibility === 'hidden') {
        field.style.visibility = 'visible';
      }
      
      // Make sure field has proper dimensions
      if (field.tagName.toLowerCase() === 'input' && field.offsetHeight < 20) {
        field.style.height = 'auto';
        field.style.minHeight = '30px';
      }
      
      // Add debugging borders temporarily if needed
      // field.style.border = '1px solid red';
    });
    
    // Try to fix styling issues with the form sections
    document.querySelectorAll('.form-section').forEach(section => {
      if (section.id === 'basic-info') {
        console.log("Basic info section found:", section);
        // Make sure it's visible
        section.style.display = 'block';
        section.classList.remove('hidden');
      }
    });
  }
  
  setupNavigationLinks() {
    // Setup navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Hide all sections
        document.querySelectorAll('.form-section').forEach(section => {
          section.classList.add('hidden');
        });
        
        // Show target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.classList.remove('hidden');
        }
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(navLink => {
          navLink.classList.remove('active', 'bg-primary/10', 'text-primary');
          navLink.classList.add('hover:bg-gray-100', 'text-gray-700');
        });
        
        link.classList.add('active', 'bg-primary/10', 'text-primary');
        link.classList.remove('hover:bg-gray-100', 'text-gray-700');
      });
    });
  }
  
  initEventListeners() {
    // Add skill event
    const addSkillBtn = document.getElementById('add-skill');
    const skillInput = document.getElementById('skill-input');
    
    if (addSkillBtn && skillInput) {
      addSkillBtn.addEventListener('click', () => {
        this.addSkill();
      });
      
      skillInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.addSkill();
        }
      });
    }
    
    // Project events
    const addProjectBtn = document.getElementById('add-project');
    if (addProjectBtn) {
      addProjectBtn.addEventListener('click', () => this.addProject());
    }
    
    // Add experience event
    const addExperienceBtn = document.getElementById('add-experience');
    if (addExperienceBtn) {
      addExperienceBtn.addEventListener('click', () => this.addExperience());
    }
    
    // Add education event
    const addEducationBtn = document.getElementById('add-education');
    if (addEducationBtn) {
      addEducationBtn.addEventListener('click', () => this.addEducation());
    }
    
    // Theme color pickers and inputs
    const primaryColorPicker = document.getElementById('primaryColor');
    const primaryColorInput = document.getElementById('primaryColorHex');
    const accentColorPicker = document.getElementById('accentColor');
    const accentColorInput = document.getElementById('accentColorHex');
    
    if (primaryColorPicker && primaryColorInput) {
      // Sync color picker with text input
      primaryColorPicker.addEventListener('input', () => {
        primaryColorInput.value = primaryColorPicker.value;
        this.portfolioData.theme.primaryColor = primaryColorPicker.value;
        this.updateThemePreview();
      });
      
      primaryColorInput.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(primaryColorInput.value)) {
          primaryColorPicker.value = primaryColorInput.value;
          this.portfolioData.theme.primaryColor = primaryColorInput.value;
          this.updateThemePreview();
        }
      });
    }
    
    if (accentColorPicker && accentColorInput) {
      // Sync color picker with text input
      accentColorPicker.addEventListener('input', () => {
        accentColorInput.value = accentColorPicker.value;
        this.portfolioData.theme.accentColor = accentColorPicker.value;
        this.updateThemePreview();
      });
      
      accentColorInput.addEventListener('input', () => {
        if (/^#[0-9A-F]{6}$/i.test(accentColorInput.value)) {
          accentColorPicker.value = accentColorInput.value;
          this.portfolioData.theme.accentColor = accentColorInput.value;
          this.updateThemePreview();
        }
      });
    }
    
    // Layout radio buttons
    const layoutRadios = document.querySelectorAll('input[name="layout"]');
    if (layoutRadios.length) {
      layoutRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          if (e.target.checked) {
            const layoutValue = e.target.value;
            this.portfolioData.theme.layout = layoutValue;
            this.updateThemePreview();
          }
        });
      });
    }
    
    // Font family select
    const fontSelect = document.getElementById('fontFamily');
    if (fontSelect) {
      fontSelect.addEventListener('change', () => {
        this.portfolioData.theme.fontFamily = fontSelect.value;
        this.updateThemePreview();
      });
    }
    
    // Preview theme button
    const previewThemeBtn = document.getElementById('previewTheme');
    if (previewThemeBtn) {
      previewThemeBtn.addEventListener('click', () => {
        this.updateThemePreview();
      });
    }
    
    // Reset theme button
    const resetThemeBtn = document.getElementById('resetTheme');
    if (resetThemeBtn) {
      resetThemeBtn.addEventListener('click', () => {
        this.resetTheme();
      });
    }
    
    // Save button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.savePortfolio());
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportPortfolio());
    }
    
    // Preview button
    const previewBtn = document.getElementById('previewBtn');
    const closePreviewBtn = document.getElementById('closePreview');
    if (previewBtn) {
      previewBtn.addEventListener('click', () => this.previewPortfolio());
    }
    if (closePreviewBtn) {
      closePreviewBtn.addEventListener('click', () => {
        const previewModal = document.getElementById('previewModal');
        if (previewModal) previewModal.classList.add('hidden');
      });
    }
    
    // Setup event delegation for dynamic elements
    document.addEventListener('click', (e) => {
      // Remove skill chip
      if (e.target.closest('.skill-chip button')) {
        const skillChip = e.target.closest('.skill-chip');
        const skillText = skillChip.textContent.trim().replace('×', '');
        this.removeSkill(skillText);
      }
      
      // Remove project
      if (e.target.closest('.project-entry button') || e.target.closest('.project-entry svg')) {
        const projectEntry = e.target.closest('.project-entry');
        if (projectEntry) {
          this.removeProject(projectEntry);
        }
      }
      
      // Remove experience
      if (e.target.closest('.experience-entry button') || e.target.closest('.experience-entry svg')) {
        const experienceEntry = e.target.closest('.experience-entry');
        if (experienceEntry) {
          this.removeExperience(experienceEntry);
        }
      }
      
      // Remove education
      if (e.target.closest('.education-entry button') || e.target.closest('.education-entry svg')) {
        const educationEntry = e.target.closest('.education-entry');
        if (educationEntry) {
          this.removeEducation(educationEntry);
        }
      }
    });
  }
  
  addSkill() {
    const skillInput = document.getElementById('skill-input');
    if (!skillInput) return;
    
    const skill = skillInput.value.trim();
    
    if (skill && !this.portfolioData.skills.includes(skill)) {
      this.portfolioData.skills.push(skill);
      skillInput.value = '';
      this.renderSkills();
    }
  }
  
  renderSkills() {
    const skillsContainer = document.querySelector('.flex.flex-wrap.gap-2.mb-4');
    if (!skillsContainer) return;
    
    skillsContainer.innerHTML = '';
    
    this.portfolioData.skills.forEach(skill => {
      const skillChip = document.createElement('span');
      skillChip.className = 'skill-chip px-3 py-1 bg-primary/10 text-primary rounded-full flex items-center';
      skillChip.innerHTML = `${skill}<button class="ml-1 text-primary focus:outline-none">×</button>`;
      
      skillsContainer.appendChild(skillChip);
    });
  }
  
  removeSkill(skillToRemove) {
    this.portfolioData.skills = this.portfolioData.skills.filter(skill => skill !== skillToRemove);
    this.renderSkills();
  }
  
  // Project methods
  addProject() {
    this.projectCount++;
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;
    
    const projectEntry = document.createElement('div');
    projectEntry.className = 'project-entry bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6';
    projectEntry.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-medium text-gray-700">Project #${this.projectCount}</h3>
        <button type="button" class="remove-project text-gray-400 hover:text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
          <input type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
        </div>
        
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
          <input type="url" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" placeholder="https://github.com/yourusername/project">
        </div>
      </div>
      
      <div class="form-group mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
        <textarea rows="3" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"></textarea>
      </div>
      
      <div class="form-group mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
        <input type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" placeholder="e.g. React, Node.js, MongoDB">
      </div>
    `;
    
    projectsContainer.appendChild(projectEntry);
    
    // Add data-project-id attribute for tracking
    projectEntry.dataset.projectId = `project-${Date.now()}`;
    
    // Animate the new entry
    if (typeof gsap !== 'undefined') {
      gsap.from(projectEntry, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }
  
  removeProject(projectEntry) {
    if (!projectEntry) return;
    
    if (typeof gsap !== 'undefined') {
      // Animate removal
      gsap.to(projectEntry, {
        opacity: 0,
        height: 0,
        marginTop: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          projectEntry.remove();
          this.updateProjectNumbers();
        }
      });
    } else {
      projectEntry.remove();
      this.updateProjectNumbers();
    }
  }
  
  updateProjectNumbers() {
    const projectEntries = document.querySelectorAll('.project-entry h3');
    projectEntries.forEach((heading, index) => {
      heading.textContent = `Project #${index + 1}`;
    });
    this.projectCount = projectEntries.length;
  }
  
  // Experience methods
  addExperience() {
    this.experienceCount++;
    const experienceContainer = document.getElementById('experience-container');
    if (!experienceContainer) return;
    
    const experienceEntry = document.createElement('div');
    experienceEntry.className = 'experience-entry bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6';
    experienceEntry.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-medium text-gray-700">Experience #${this.experienceCount}</h3>
        <button type="button" class="remove-experience text-gray-400 hover:text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input type="text" name="company" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50">
        </div>
        
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <input type="text" name="position" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" placeholder="e.g. Software Developer">
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input type="text" name="startDate" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" placeholder="e.g. Jan 2020">
        </div>
        
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input type="text" name="endDate" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" placeholder="e.g. Present or Dec 2022">
        </div>
      </div>
      
      <div class="form-group mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="expDescription" rows="3" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" placeholder="Describe your responsibilities and achievements..."></textarea>
      </div>
    `;
    
    experienceContainer.appendChild(experienceEntry);
    
    // Add data-experience-id attribute for tracking
    experienceEntry.dataset.experienceId = `experience-${Date.now()}`;
    
    // Animate the new entry
    if (typeof gsap !== 'undefined') {
      gsap.from(experienceEntry, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }
  
  removeExperience(experienceEntry) {
    if (!experienceEntry) return;
    
    if (typeof gsap !== 'undefined') {
      // Animate removal
      gsap.to(experienceEntry, {
        opacity: 0,
        height: 0,
        marginTop: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          experienceEntry.remove();
          this.updateExperienceNumbers();
        }
      });
    } else {
      experienceEntry.remove();
      this.updateExperienceNumbers();
    }
  }
  
  updateExperienceNumbers() {
    const experienceEntries = document.querySelectorAll('.experience-entry h3');
    experienceEntries.forEach((heading, index) => {
      heading.textContent = `Experience #${index + 1}`;
    });
    this.experienceCount = experienceEntries.length;
  }
  
  // Education methods
  addEducation() {
    this.educationCount++;
    const educationContainer = document.getElementById('education-container');
    if (!educationContainer) return;
    
    const educationEntry = document.createElement('div');
    educationEntry.className = 'education-entry bg-gray-50 p-4 rounded-lg border border-gray-200 mt-6';
    educationEntry.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-medium text-gray-700">Education #${this.educationCount}</h3>
        <button type="button" class="remove-education text-gray-400 hover:text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Institution</label>
          <input type="text" name="institution" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" placeholder="e.g. University of Example">
        </div>
        
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Degree</label>
          <input type="text" name="degree" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" placeholder="e.g. Bachelor of Science in Computer Science">
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input type="text" name="eduStartDate" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" placeholder="e.g. Sep 2018">
        </div>
        
        <div class="form-group">
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input type="text" name="eduEndDate" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" placeholder="e.g. Present or Jun 2022">
        </div>
      </div>
      
      <div class="form-group mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
        <textarea name="eduDescription" rows="3" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" placeholder="Additional information about your studies, achievements, etc."></textarea>
      </div>
    `;
    
    educationContainer.appendChild(educationEntry);
    
    // Add data-education-id attribute for tracking
    educationEntry.dataset.educationId = `education-${Date.now()}`;
    
    // Animate the new entry
    if (typeof gsap !== 'undefined') {
      gsap.from(educationEntry, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  }
  
  removeEducation(educationEntry) {
    if (!educationEntry) return;
    
    if (typeof gsap !== 'undefined') {
      // Animate removal
      gsap.to(educationEntry, {
        opacity: 0,
        height: 0,
        marginTop: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          educationEntry.remove();
          this.updateEducationNumbers();
        }
      });
    } else {
      educationEntry.remove();
      this.updateEducationNumbers();
    }
  }
  
  updateEducationNumbers() {
    const educationEntries = document.querySelectorAll('.education-entry h3');
    educationEntries.forEach((heading, index) => {
      heading.textContent = `Education #${index + 1}`;
    });
    this.educationCount = educationEntries.length;
  }
  
  resetTheme() {
    // Reset theme to defaults
    this.portfolioData.theme = {
      primaryColor: '#4F46E5',
      accentColor: '#F59E0B',
      layout: 'modern',
      fontFamily: 'Inter, sans-serif'
    };
    
    // Update the UI
    document.getElementById('primaryColor').value = this.portfolioData.theme.primaryColor;
    document.getElementById('primaryColorHex').value = this.portfolioData.theme.primaryColor;
    document.getElementById('accentColor').value = this.portfolioData.theme.accentColor;
    document.getElementById('accentColorHex').value = this.portfolioData.theme.accentColor;
    document.getElementById('fontFamily').value = this.portfolioData.theme.fontFamily;
    document.getElementById('layoutModern').checked = true;
    
    this.showNotification('Theme reset to default settings');
  }
  
  savePortfolio() {
    // First collect all data from the form fields
    this.collectFormData();
    
    // Then save to localStorage
    localStorage.setItem('portfolioData', JSON.stringify(this.portfolioData));
    
    // Show success notification
    this.showNotification('Portfolio saved successfully!');
  }
  
  collectFormData() {
    // Collect basic info
    const nameInput = document.getElementById('name');
    const titleInput = document.getElementById('title');
    const bioInput = document.getElementById('bio');
    const emailInput = document.getElementById('email');
    const websiteInput = document.getElementById('website');
    
    if (nameInput) this.portfolioData.basics.name = nameInput.value;
    if (titleInput) this.portfolioData.basics.title = titleInput.value;
    if (bioInput) this.portfolioData.basics.bio = bioInput.value;
    if (emailInput) this.portfolioData.basics.email = emailInput.value;
    if (websiteInput) this.portfolioData.basics.website = websiteInput.value;
    
    // Skills are already collected in addSkill and removeSkill methods
    
    // Collect projects
    this.portfolioData.projects = [];
    document.querySelectorAll('.project-entry').forEach(projectEntry => {
      const nameInput = projectEntry.querySelector('input[type="text"]');
      const urlInput = projectEntry.querySelector('input[type="url"]');
      const descInput = projectEntry.querySelector('textarea');
      const techInput = projectEntry.querySelectorAll('input[type="text"]')[1]; // Second text input is tech
      
      if (nameInput && descInput) {
        let technologies = [];
        if (techInput && techInput.value) {
          technologies = techInput.value.split(',').map(tech => tech.trim()).filter(tech => tech);
        }
        
        this.portfolioData.projects.push({
          title: nameInput.value,
          description: descInput.value,
          link: urlInput ? urlInput.value : '',
          technologies: technologies
        });
      }
    });
    
    // Collect experience
    this.portfolioData.experience = [];
    document.querySelectorAll('.experience-entry').forEach(expEntry => {
      const companyInput = expEntry.querySelector('input[name="company"]');
      const positionInput = expEntry.querySelector('input[name="position"]');
      const startDateInput = expEntry.querySelector('input[name="startDate"]');
      const endDateInput = expEntry.querySelector('input[name="endDate"]');
      const descInput = expEntry.querySelector('textarea[name="expDescription"]');
      
      if (companyInput && positionInput) {
        this.portfolioData.experience.push({
          company: companyInput.value,
          title: positionInput.value,
          startDate: startDateInput ? startDateInput.value : '',
          endDate: endDateInput ? endDateInput.value : '',
          description: descInput ? descInput.value : ''
        });
      }
    });
    
    // Collect education
    this.portfolioData.education = [];
    document.querySelectorAll('.education-entry').forEach(eduEntry => {
      const institutionInput = eduEntry.querySelector('input[name="institution"]');
      const degreeInput = eduEntry.querySelector('input[name="degree"]');
      const startDateInput = eduEntry.querySelector('input[name="eduStartDate"]');
      const endDateInput = eduEntry.querySelector('input[name="eduEndDate"]');
      const descInput = eduEntry.querySelector('textarea[name="eduDescription"]');
      
      if (institutionInput && degreeInput) {
        this.portfolioData.education.push({
          institution: institutionInput.value,
          degree: degreeInput.value,
          startDate: startDateInput ? startDateInput.value : '',
          endDate: endDateInput ? endDateInput.value : '',
          description: descInput ? descInput.value : ''
        });
      }
    });
    
    // Collect theme settings
    const primaryColorInput = document.getElementById('primaryColorHex');
    const accentColorInput = document.getElementById('accentColorHex');
    const fontFamilySelect = document.getElementById('fontFamily');
    
    if (primaryColorInput) this.portfolioData.theme.primaryColor = primaryColorInput.value;
    if (accentColorInput) this.portfolioData.theme.accentColor = accentColorInput.value;
    if (fontFamilySelect) this.portfolioData.theme.fontFamily = fontFamilySelect.value;
    
    // Layout is collected from radio buttons
    const selectedLayout = document.querySelector('input[name="layout"]:checked');
    if (selectedLayout) this.portfolioData.theme.layout = selectedLayout.value;
    
    return this.portfolioData;
  }
  
  loadPortfolio() {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      try {
        this.portfolioData = JSON.parse(savedData);
        this.populateFormFields();
        this.renderSkills();
      } catch (e) {
        console.error('Error loading saved portfolio data:', e);
        this.showNotification('Error loading saved data', 'error');
      }
    }
  }
  
  populateFormFields() {
    const { basics, theme } = this.portfolioData;
    
    // Populate basic info
    if (basics.name) document.getElementById('name').value = basics.name;
    if (basics.title) document.getElementById('title').value = basics.title;
    if (basics.bio) document.getElementById('bio').value = basics.bio;
    if (basics.email) document.getElementById('email').value = basics.email;
    if (basics.website) document.getElementById('website').value = basics.website;
    
    // Populate theme settings
    if (theme.primaryColor) {
      document.getElementById('primaryColor').value = theme.primaryColor;
      document.getElementById('primaryColorHex').value = theme.primaryColor;
    }
    if (theme.accentColor) {
      document.getElementById('accentColor').value = theme.accentColor;
      document.getElementById('accentColorHex').value = theme.accentColor;
    }
    if (theme.fontFamily) document.getElementById('fontFamily').value = theme.fontFamily;
    
    // Set layout radio button
    if (theme.layout) {
      const layoutRadio = document.getElementById(`layout${theme.layout.charAt(0).toUpperCase() + theme.layout.slice(1)}`);
      if (layoutRadio) layoutRadio.checked = true;
    }
    
    // TODO: Populate projects, experience, and education sections
    // For now, we'll just rely on the user re-entering this data
  }
  
  exportPortfolio() {
    // First collect all data
    this.collectFormData();
    
    // Generate HTML for the portfolio
    const html = this.generatePortfolioHTML();
    
    // Create a blob with the HTML content
    const blob = new Blob([html], { type: 'text/html' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-portfolio.html';
    
    // Append to the document
    document.body.appendChild(a);
    
    // Programmatically click the link to trigger the download
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    // Show success notification
    this.showNotification('Portfolio exported successfully!');
  }
  
  generatePortfolioHTML() {
    const { basics, skills, projects, experience, education, theme } = this.portfolioData;
    
    // Basic template for portfolio
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${basics.name || 'My Portfolio'} - ${basics.title || 'Professional Portfolio'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: "${theme.primaryColor || '#4F46E5'}",
            accent: "${theme.accentColor || '#F59E0B'}"
          },
          fontFamily: {
            sans: ["${theme.fontFamily || 'Inter, sans-serif'}"]
          }
        }
      }
    }
  </script>
  <style>
    /* Base styles */
    body {
      font-family: ${theme.fontFamily || 'Inter, sans-serif'};
    }
    
    /* Smooth transitions */
    .transition-all {
      transition: all 0.3s ease;
    }
    
    /* Fade-in animation */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.6s ease-out forwards;
    }
    
    /* Tailwind-like utilities */
    .hover-scale:hover {
      transform: scale(1.03);
      transition: transform 0.3s ease;
    }
    
    /* Scrollbar styling */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #aaa;
    }
    
    html {
      scroll-behavior: smooth;
    }
  </style>
</head>
<body class="bg-gray-50 text-gray-800 overflow-x-hidden">
  ${this.generateHeader(basics, theme.layout)}
  
  <main class="container mx-auto max-w-5xl py-12 px-6 animate-fadeIn" style="animation-delay: 0.3s;">
    ${basics.bio ? `
    <section id="about" class="mb-16">
      <h2 class="text-2xl md:text-3xl font-bold mb-6 pb-2 border-b border-gray-200">About Me</h2>
      <div class="bg-white rounded-lg shadow-sm p-6 hover-scale">
        <p class="text-gray-700 leading-relaxed">${basics.bio}</p>
      </div>
    </section>
    ` : ''}

    ${skills.length > 0 ? `
    <section id="skills" class="mb-16">
      <h2 class="text-2xl md:text-3xl font-bold mb-6 pb-2 border-b border-gray-200">Skills & Expertise</h2>
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex flex-wrap gap-2">
          ${skills.map(skill => `<span class="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium">${skill}</span>`).join('')}
        </div>
      </div>
    </section>
    ` : ''}

    ${projects.length > 0 ? `
    <section id="projects" class="mb-16">
      <h2 class="text-2xl md:text-3xl font-bold mb-6 pb-2 border-b border-gray-200">Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${projects.map(project => `
        <div class="bg-white rounded-lg shadow-sm overflow-hidden hover-scale">
          <div class="p-6">
            <h3 class="text-xl font-semibold mb-2">${project.title || 'Untitled Project'}</h3>
            <p class="text-gray-700 mb-4">${project.description || 'No description provided.'}</p>
            
            ${project.technologies && project.technologies.length > 0 ? `
            <div class="flex flex-wrap gap-1 mb-4">
              ${project.technologies.map(tech => `<span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">${tech}</span>`).join('')}
            </div>
            ` : ''}
            
            ${project.link ? `<a href="${project.link}" target="_blank" class="text-primary hover:underline font-medium inline-flex items-center">
              View Project
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>` : ''}
          </div>
        </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    ${experience.length > 0 ? `
    <section id="experience" class="mb-16">
      <h2 class="text-2xl md:text-3xl font-bold mb-6 pb-2 border-b border-gray-200">Work Experience</h2>
      <div class="space-y-6">
        ${experience.map(job => `
        <div class="bg-white rounded-lg shadow-sm p-6 hover-scale">
          <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
            <h3 class="text-xl font-semibold">${job.title || 'Position'}</h3>
            <span class="text-gray-500 text-sm font-medium mt-1 md:mt-0">${job.startDate || ''} - ${job.endDate || 'Present'}</span>
          </div>
          <p class="text-primary font-medium mb-2">${job.company || 'Company'}</p>
          ${job.description ? `<p class="text-gray-700 mt-2">${job.description}</p>` : ''}
        </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    ${education.length > 0 ? `
    <section id="education" class="mb-16">
      <h2 class="text-2xl md:text-3xl font-bold mb-6 pb-2 border-b border-gray-200">Education</h2>
      <div class="space-y-6">
        ${education.map(edu => `
        <div class="bg-white rounded-lg shadow-sm p-6 hover-scale">
          <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
            <h3 class="text-xl font-semibold">${edu.degree || 'Degree'}</h3>
            <span class="text-gray-500 text-sm font-medium mt-1 md:mt-0">${edu.startDate || ''} - ${edu.endDate || 'Present'}</span>
          </div>
          <p class="text-primary font-medium mb-2">${edu.institution || 'Institution'}</p>
          ${edu.description ? `<p class="text-gray-700 mt-2">${edu.description}</p>` : ''}
        </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <section id="contact" class="mb-16">
      <h2 class="text-2xl md:text-3xl font-bold mb-6 pb-2 border-b border-gray-200">Contact</h2>
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex flex-col md:flex-row gap-6 items-center justify-center md:justify-start">
          ${basics.email ? `
          <a href="mailto:${basics.email}" class="flex items-center gap-2 text-primary hover:text-primary/80 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            ${basics.email}
          </a>
          ` : ''}
          
          ${basics.website ? `
          <a href="${basics.website}" target="_blank" class="flex items-center gap-2 text-primary hover:text-primary/80 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.1-1.1" />
            </svg>
            ${basics.website.replace('https://', '').replace('http://', '')}
          </a>
          ` : ''}
        </div>
      </div>
    </section>
  </main>

  <footer class="bg-gray-800 text-white py-8">
    <div class="container mx-auto max-w-5xl px-6 text-center">
      <p>&copy; ${new Date().getFullYear()} ${basics.name || 'Portfolio Owner'}. All rights reserved.</p>
      <p class="text-gray-400 text-sm mt-2">Made with ProFolio</p>
    </div>
  </footer>

  <script>
    // Simple fade-in animation for sections
    document.addEventListener('DOMContentLoaded', function() {
      const sections = document.querySelectorAll('section');
      const fadeInOnScroll = function() {
        sections.forEach(section => {
          const sectionTop = section.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          if (sectionTop < windowHeight * 0.8) {
            section.style.opacity = 1;
            section.style.transform = 'translateY(0)';
          }
        });
      };
      
      // Set initial styles
      sections.forEach((section, index) => {
        if (index > 0) { // Don't animate first section
          section.style.opacity = 0;
          section.style.transform = 'translateY(20px)';
          section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
      });
      
      // Run on load and scroll
      fadeInOnScroll();
      window.addEventListener('scroll', fadeInOnScroll);
    });
  </script>
</body>
</html>`;
  }
  
  generateHeader(basics, layoutType) {
    const { skills, projects, experience, education } = this.portfolioData;
    
    // Generate different headers based on layout type
    switch(layoutType) {
      case 'minimal':
        return `
  <header class="bg-white shadow-sm py-8">
    <div class="container mx-auto max-w-5xl px-6">
      <div class="flex flex-col items-center">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900">${basics.name || 'Your Name'}</h1>
        <p class="text-xl text-gray-600 mt-2">${basics.title || 'Your Title'}</p>
        <nav class="mt-6">
          <ul class="flex space-x-8">
            <li><a href="#about" class="text-gray-600 hover:text-primary transition-colors">About</a></li>
            ${skills.length > 0 ? '<li><a href="#skills" class="text-gray-600 hover:text-primary transition-colors">Skills</a></li>' : ''}
            ${projects.length > 0 ? '<li><a href="#projects" class="text-gray-600 hover:text-primary transition-colors">Projects</a></li>' : ''}
            ${experience.length > 0 ? '<li><a href="#experience" class="text-gray-600 hover:text-primary transition-colors">Experience</a></li>' : ''}
            ${education.length > 0 ? '<li><a href="#education" class="text-gray-600 hover:text-primary transition-colors">Education</a></li>' : ''}
            <li><a href="#contact" class="text-gray-600 hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
        `;
      
      case 'creative':
        return `
  <header class="relative">
    <div class="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90"></div>
    <div class="relative z-10 min-h-[70vh] flex flex-col items-center justify-center text-white text-center p-6">
      <h1 class="text-4xl md:text-6xl font-bold mb-4 animate-fadeIn">${basics.name || 'Your Name'}</h1>
      <p class="text-xl md:text-2xl mb-8 animate-fadeIn" style="animation-delay: 0.2s;">${basics.title || 'Your Title'}</p>
      <nav class="mt-8 animate-fadeIn" style="animation-delay: 0.4s;">
        <ul class="flex flex-wrap justify-center gap-2 md:gap-6">
          <li><a href="#about" class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all">About</a></li>
          ${skills.length > 0 ? '<li><a href="#skills" class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all">Skills</a></li>' : ''}
          ${projects.length > 0 ? '<li><a href="#projects" class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all">Projects</a></li>' : ''}
          ${experience.length > 0 ? '<li><a href="#experience" class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all">Experience</a></li>' : ''}
          ${education.length > 0 ? '<li><a href="#education" class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all">Education</a></li>' : ''}
          <li><a href="#contact" class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>
        `;
      
      case 'modern':
      default:
        return `
  <header class="bg-primary text-white">
    <div class="container mx-auto max-w-5xl px-6 py-16 md:py-24">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center">
        <div class="mb-8 md:mb-0 animate-fadeIn">
          <h1 class="text-3xl md:text-5xl font-bold mb-2">${basics.name || 'Your Name'}</h1>
          <p class="text-xl opacity-90">${basics.title || 'Your Title'}</p>
        </div>
        <nav class="animate-fadeIn" style="animation-delay: 0.2s;">
          <ul class="flex flex-wrap gap-6">
            <li><a href="#about" class="hover:text-white/80 transition-colors">About</a></li>
            ${skills.length > 0 ? '<li><a href="#skills" class="hover:text-white/80 transition-colors">Skills</a></li>' : ''}
            ${projects.length > 0 ? '<li><a href="#projects" class="hover:text-white/80 transition-colors">Projects</a></li>' : ''}
            ${experience.length > 0 ? '<li><a href="#experience" class="hover:text-white/80 transition-colors">Experience</a></li>' : ''}
            ${education.length > 0 ? '<li><a href="#education" class="hover:text-white/80 transition-colors">Education</a></li>' : ''}
            <li><a href="#contact" class="hover:text-white/80 transition-colors">Contact</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
        `;
    }
  }
  
  showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg z-50 transform transition-all duration-500 translate-y-20 opacity-0 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.classList.remove('translate-y-20', 'opacity-0');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.add('translate-y-20', 'opacity-0');
      
      // Remove from DOM after animation
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }
  
  previewPortfolio() {
    console.log("Opening preview modal...");
    
    // First collect all data
    this.collectFormData();
    
    const { basics, skills, projects, experience, education } = this.portfolioData;
    
    // Update preview modal
    const previewName = document.getElementById('preview-name');
    const previewTitle = document.getElementById('preview-title');
    const previewEmail = document.getElementById('preview-email');
    const previewEmailText = document.getElementById('preview-email-text');
    const previewWebsite = document.getElementById('preview-website');
    const previewWebsiteText = document.getElementById('preview-website-text');
    const previewBio = document.getElementById('preview-bio');
    
    // Basic info
    if (previewName) previewName.textContent = basics.name || 'Your Name';
    if (previewTitle) previewTitle.textContent = basics.title || 'Your Title';
    
    // Email
    if (previewEmail && previewEmailText && basics.email) {
      previewEmail.href = `mailto:${basics.email}`;
      previewEmailText.textContent = basics.email;
      previewEmail.classList.remove('hidden');
    } else if (previewEmail) {
      previewEmail.classList.add('hidden');
    }
    
    // Website
    if (previewWebsite && previewWebsiteText && basics.website) {
      previewWebsite.href = basics.website;
      const displayUrl = basics.website.replace(/^https?:\/\//, '');
      previewWebsiteText.textContent = displayUrl;
      previewWebsite.classList.remove('hidden');
    } else if (previewWebsite) {
      previewWebsite.classList.add('hidden');
    }
    
    // Bio
    if (previewBio) previewBio.textContent = basics.bio || 'Your bio will appear here.';
    
    // Skills
    const previewSkills = document.getElementById('preview-skills');
    const previewSkillsSection = document.getElementById('preview-skills-section');
    
    if (previewSkills && previewSkillsSection) {
      previewSkills.innerHTML = '';
      
      if (skills.length > 0) {
        skills.forEach(skill => {
          const skillElement = document.createElement('span');
          skillElement.className = 'px-3 py-1 bg-primary/10 text-primary rounded-full text-sm';
          skillElement.textContent = skill;
          previewSkills.appendChild(skillElement);
        });
        previewSkillsSection.classList.remove('hidden');
      } else {
        previewSkillsSection.classList.add('hidden');
      }
    }
    
    // Projects
    const previewProjects = document.getElementById('preview-projects');
    const previewProjectsSection = document.getElementById('preview-projects-section');
    
    if (previewProjects && previewProjectsSection) {
      previewProjects.innerHTML = '';
      
      if (projects.length > 0) {
        projects.forEach(project => {
          let techsHtml = '';
          if (project.technologies && project.technologies.length > 0) {
            techsHtml = `
              <div class="flex flex-wrap gap-1 mt-2">
                ${project.technologies.map(tech => `<span class="px-2 py-0.5 bg-gray-200 text-gray-800 rounded-full text-xs">${tech}</span>`).join('')}
              </div>
            `;
          }
          
          let linkHtml = '';
          if (project.link) {
            linkHtml = `<a href="${project.link}" target="_blank" class="text-primary hover:underline text-sm mt-2 inline-flex items-center">
              View Project
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>`;
          }
          
          const projectElement = document.createElement('div');
          projectElement.className = 'bg-gray-50 rounded-lg p-4 mb-4';
          projectElement.innerHTML = `
            <h3 class="font-medium text-gray-800">${project.title || 'Untitled Project'}</h3>
            <p class="text-gray-600 mt-1">${project.description || 'No description provided.'}</p>
            ${techsHtml}
            ${linkHtml}
          `;
          
          previewProjects.appendChild(projectElement);
        });
        previewProjectsSection.classList.remove('hidden');
      } else {
        previewProjectsSection.classList.add('hidden');
      }
    }
    
    // Experience
    const previewExperience = document.getElementById('preview-experience');
    const previewExperienceSection = document.getElementById('preview-experience-section');
    
    if (previewExperience && previewExperienceSection) {
      previewExperience.innerHTML = '';
      
      if (experience.length > 0) {
        experience.forEach(exp => {
          const expElement = document.createElement('div');
          expElement.className = 'bg-gray-50 rounded-lg p-4';
          expElement.innerHTML = `
            <div class="flex flex-wrap justify-between">
              <h3 class="font-medium text-gray-800">${exp.title || 'Position'}</h3>
              <span class="text-sm text-gray-500">${exp.startDate} - ${exp.endDate || 'Present'}</span>
            </div>
            <p class="text-primary font-medium text-sm">${exp.company || 'Company'}</p>
            ${exp.description ? `<p class="text-gray-600 mt-2">${exp.description}</p>` : ''}
          `;
          
          previewExperience.appendChild(expElement);
        });
        previewExperienceSection.classList.remove('hidden');
      } else {
        previewExperienceSection.classList.add('hidden');
      }
    }
    
    // Education
    const previewEducation = document.getElementById('preview-education');
    const previewEducationSection = document.getElementById('preview-education-section');
    
    if (previewEducation && previewEducationSection) {
      previewEducation.innerHTML = '';
      
      if (education.length > 0) {
        education.forEach(edu => {
          const eduElement = document.createElement('div');
          eduElement.className = 'bg-gray-50 rounded-lg p-4';
          eduElement.innerHTML = `
            <div class="flex flex-wrap justify-between">
              <h3 class="font-medium text-gray-800">${edu.degree || 'Degree'}</h3>
              <span class="text-sm text-gray-500">${edu.startDate} - ${edu.endDate || 'Present'}</span>
            </div>
            <p class="text-primary font-medium text-sm">${edu.institution || 'Institution'}</p>
            ${edu.description ? `<p class="text-gray-600 mt-2">${edu.description}</p>` : ''}
          `;
          
          previewEducation.appendChild(eduElement);
        });
        previewEducationSection.classList.remove('hidden');
      } else {
        previewEducationSection.classList.add('hidden');
      }
    }
    
    // Show preview modal
    const previewModal = document.getElementById('previewModal');
    if (previewModal) {
      previewModal.classList.remove('hidden');
      console.log("Preview modal opened");
    } else {
      console.error("Preview modal element not found");
    }
    
    // Set up close button - direct DOM approach as backup
    const closePreviewBtn = document.getElementById('closePreview');
    if (closePreviewBtn) {
      // Remove any existing listeners to avoid duplicates
      const newCloseBtn = closePreviewBtn.cloneNode(true);
      closePreviewBtn.parentNode.replaceChild(newCloseBtn, closePreviewBtn);
      
      // Add a fresh event listener
      newCloseBtn.addEventListener('click', () => {
        if (previewModal) {
          previewModal.classList.add('hidden');
          console.log("Preview modal closed");
        }
      });
    }
  }
  
  updateThemePreview() {
    // Apply current theme settings to the preview area
    const previewArea = document.getElementById('themePreview');
    if (!previewArea) return;
    
    const { primaryColor, accentColor, fontFamily } = this.portfolioData.theme;
    
    // Apply colors and font to preview area
    previewArea.style.setProperty('--primary-color', primaryColor);
    previewArea.style.setProperty('--accent-color', accentColor);
    previewArea.style.fontFamily = fontFamily;
    
    // Update preview elements with current colors
    const primaryElements = previewArea.querySelectorAll('.theme-primary');
    const accentElements = previewArea.querySelectorAll('.theme-accent');
    
    primaryElements.forEach(el => {
      el.style.backgroundColor = primaryColor;
    });
    
    accentElements.forEach(el => {
      el.style.backgroundColor = accentColor;
    });
    
    // Update text elements
    const primaryTextElements = previewArea.querySelectorAll('.theme-primary-text');
    primaryTextElements.forEach(el => {
      el.style.color = primaryColor;
    });
    
    // Update current values display
    const currentPrimaryColor = document.getElementById('currentPrimaryColor');
    const currentAccentColor = document.getElementById('currentAccentColor');
    const currentFontFamily = document.getElementById('currentFontFamily');
    
    if (currentPrimaryColor) currentPrimaryColor.textContent = primaryColor;
    if (currentAccentColor) currentAccentColor.textContent = accentColor;
    if (currentFontFamily) currentFontFamily.textContent = fontFamily.split(',')[0].trim();
  }
  
  loadThemeDefaults() {
    const defaultTheme = this.portfolioData.theme;
    const primaryColorPicker = document.getElementById('primaryColor');
    const primaryColorInput = document.getElementById('primaryColorHex');
    const accentColorPicker = document.getElementById('accentColor');
    const accentColorInput = document.getElementById('accentColorHex');
    
    if (primaryColorPicker && primaryColorInput) {
      primaryColorPicker.value = defaultTheme.primaryColor;
      primaryColorInput.value = defaultTheme.primaryColor;
    }
    
    if (accentColorPicker && accentColorInput) {
      accentColorPicker.value = defaultTheme.accentColor;
      accentColorInput.value = defaultTheme.accentColor;
    }
    
    // Set layout radio
    const layoutRadio = document.getElementById(`layout${defaultTheme.layout.charAt(0).toUpperCase() + defaultTheme.layout.slice(1)}`);
    if (layoutRadio) {
      layoutRadio.checked = true;
    }
    
    // Set font family
    const fontFamilySelect = document.getElementById('fontFamily');
    if (fontFamilySelect) {
      fontFamilySelect.value = defaultTheme.fontFamily;
    }
  }
}

// Create a global instance that will be used throughout the application
window.portfolioBuilder = new PortfolioBuilder(); 