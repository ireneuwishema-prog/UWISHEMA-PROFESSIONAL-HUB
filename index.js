
/* =========================================
   UWISHEMA PROFESSIONAL HUB
   JavaScript Functionality
========================================= */

document.addEventListener("DOMContentLoaded", function () {
  // 1. SELECT HTML ELEMENTS

  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector(".primary-nav");
  const navLinks = document.querySelectorAll(".primary-nav a");

  const pathwayButtons = document.querySelectorAll("[data-pathway]");
  const pathDialog = document.querySelector(".path-dialog");

  const dialogTitle = document.querySelector("#dialog-title");
  const dialogText = document.querySelector("#dialog-text");
  const dialogClose = document.querySelector(".dialog-close");
  const dialogOk = document.querySelector(".dialog-ok");

  const copyrightYear = document.querySelector("#copyright-year");

  // 2. MOBILE NAVIGATION MENU

  function closeMenu() {
    if (!menuToggle || !primaryNav) return;

    primaryNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    document.body.classList.remove("menu-open");
  }

  if (menuToggle && primaryNav) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", function () {
      const isOpen = primaryNav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );

      document.body.classList.toggle("menu-open", isOpen);
    });

    // Close the menu after a navigation link is clicked.
    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close the menu when Escape is pressed.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    // Close the menu when returning to desktop layout.

 window.addEventListener("resize", function () {
  if (window.innerWidth > 720) {
    closeMenu();
  }
});
 }
  // 3. DEVELOPER AND TEACHER PATHWAY DIALOGS

  const pathwayInformation = {
    developer: {
      title: "Software Developers",
      description:
        "Build your professional profile, showcase your projects, " +
        "highlight your technical skills, and prepare to connect " +
        "with opportunities in software development."
    },

    teacher: {
      title: "Private School Teachers",
      description:
        "Showcase your teaching experience, subjects, qualifications, " +
        "and classroom skills to build a professional profile " +
        "for teaching opportunities."
    }
  };

  pathwayButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      const pathway = button.dataset.pathway;
      const information = pathwayInformation[pathway];

      if (!information) {
        console.warn("Unknown career pathway:", pathway);
        return;
      }

      // If the dialog exists, display the selected pathway.
      if (pathDialog && dialogTitle && dialogText) {
        dialogTitle.textContent = information.title;
        dialogText.textContent = information.description;

        if (typeof pathDialog.showModal === "function") {
          pathDialog.showModal();
        } else {
          alert(
            information.title + "\n\n" + information.description
          );
        }
      } else {
        // Safe fallback if the dialog has not been added to HTML.
        alert(
          information.title + "\n\n" + information.description
        );
      }
    });
  });

  // 4. CLOSE THE DIALOG

  function closeDialog() {
    if (pathDialog && pathDialog.open) {
      pathDialog.close();
    }
  }

  if (dialogClose) {
    dialogClose.addEventListener("click", closeDialog);
  }

  if (dialogOk) {
    dialogOk.addEventListener("click", closeDialog);
  }

  if (pathDialog) {
    // Close the dialog when the user clicks its backdrop.
    pathDialog.addEventListener("click", function (event) {
      if (event.target === pathDialog) {
        closeDialog();
      }
    });
  }

  // 5. SMOOTH SCROLLING

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");

      // Ignore empty links.
      if (!targetId || targetId === "#") {
        return;
      }

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault();

        targetElement.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
            ? "auto"
            : "smooth",
          block: "start"
        });

        // Update the URL fragment without jumping.
        if (window.location.hash !== targetId) {
          history.pushState(null, "", targetId);
        }
      }
    });
  });

  // 6. AUTOMATIC COPYRIGHT YEAR

  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

  // 7. WELCOME MESSAGE IN THE CONSOLE

  console.log("Uwishema Professional Hub is ready!");
});
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  const showLoginButton = document.getElementById("show-login");
  const showSignupButton = document.getElementById("show-signup");

  const authTitle = document.getElementById("auth-title");
  const authDescription = document.getElementById("auth-description");
  const authMessage = document.getElementById("auth-message");

  const dashboard = document.getElementById("user-dashboard");
  const logoutButton = document.getElementById("logout-button");

  const navLogin = document.getElementById("nav-login");
  const navSignup = document.getElementById("nav-signup");

  const STORAGE_KEY = "uwishemaHubUsers";
  const SESSION_KEY = "uwishemaHubCurrentUser";

  // Read the saved accounts from localStorage.
  // If no accounts exist, begin with an empty array.
  function getUsers() {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(users) ? users : [];
    } catch {
      return [];
    }
  }

  // Save the accounts back into localStorage.
  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  // Display a message to the user.
  function showMessage(message, type = "") {
    authMessage.textContent = message;
    authMessage.className = "auth-message";

    if (type) {
      authMessage.classList.add(type);
    }
  }

  // Show the registration form.
  function showSignup() {
    signupForm.hidden = false;
    loginForm.hidden = true;
    dashboard.hidden = true;

    authTitle.textContent = "Create your account";
    authDescription.textContent =
      "Join our community of developers and teachers.";

    showMessage("");
  }

  // Show the login form.
  function showLogin() {
    signupForm.hidden = true;
    loginForm.hidden = false;
    dashboard.hidden = true;

    authTitle.textContent = "Welcome back";
    authDescription.textContent =
      "Log in with your registered account.";

    showMessage("");
  }

  // Show the dashboard after successful login.
  function showDashboard(user) {
    signupForm.hidden = true;
    loginForm.hidden = true;
    dashboard.hidden = false;

    authTitle.textContent = "Your account";
    authDescription.textContent = "You are successfully logged in.";

    document.getElementById("welcome-name").textContent = user.name;
    document.getElementById("welcome-email").textContent = user.email;

    document.getElementById("welcome-category").textContent =
      user.category === "developer"
        ? "Software Developer"
        : "Private School Teacher";

    showMessage("");
  }

  // Switch forms when users click the links.
  showLoginButton.addEventListener("click", showLogin);
  showSignupButton.addEventListener("click", showSignup);

  // Open the sign-up form from the navigation.
  if (navSignup) {
    navSignup.addEventListener("click", showSignup);
  }

  // Open the login form from the navigation.
  if (navLogin) {
    navLogin.addEventListener("click", showLogin);
  }

  // CREATE ACCOUNT
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("signup-name")
      .value.trim();

    const email = document.getElementById("signup-email")
      .value.trim().toLowerCase();

    const category = document.getElementById("signup-category")
      .value;

    const password = document.getElementById("signup-password")
      .value;

    const confirmPassword =
      document.getElementById("signup-confirm-password").value;

    if (!name || !email || !category || !password) {
      showMessage("Please complete all fields.", "error");
      return;
    }

    if (password.length < 8) {
      showMessage(
        "Your password must contain at least 8 characters.",
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      showMessage("The passwords do not match.", "error");
      return;
    }

    const users = getUsers();

    // Prevent duplicate accounts.
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      showMessage(
        "This email already has an account. Please log in.",
        "error"
      );
      return;
    }

    // DEMO ONLY: password is stored as plain text.
    // Never use this password-storage method in production.
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      category,
      password,
      createdAt: new Date().toISOString()
    };

    try {
      users.push(newUser);
      saveUsers(users);

      // Clear the registration fields.
      signupForm.reset();

      // Put the registered email into the login form.
      document.getElementById("login-email").value = email;

      // Preselect the category the user registered with.
      document.getElementById("login-category").value = category;

      // Show the login form directly after registration.
      showLogin();

      showMessage(
        "Account created successfully! Please log in.",
        "success"
      );

      document.getElementById("login-password").focus();
    } catch (error) {
      showMessage(
        "Could not save the account. Check your browser storage settings.",
        "error"
      );
    }
  });

  // LOG IN
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("login-email")
      .value.trim().toLowerCase();

    const category = document.getElementById("login-category")
      .value;

    const password = document.getElementById("login-password").value;

    const users = getUsers();

    // Find an account matching the email, category, and password.
    const user = users.find((savedUser) =>
      savedUser.email === email &&
      savedUser.category === category &&
      savedUser.password === password
    );

    if (!user) {
      showMessage(
        "Login failed. Check your email, category, and password.",
        "error"
      );
      return;
    }

    try {
      // Save only basic session information, not the password.
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          category: user.category
        })
      );

      loginForm.reset();
      showDashboard(user);
    } catch (error) {
      showMessage(
        "Could not start your session. Check your browser settings.",
        "error"
      );
    }
  });

  // LOG OUT
  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    loginForm.reset();
    showLogin();
    showMessage("You have logged out successfully.", "success");
  });

  // Restore the dashboard if the current browser session still exists.
  try {
    const savedSession = sessionStorage.getItem(SESSION_KEY);

    if (savedSession) {
      const session = JSON.parse(savedSession);

      // Confirm the account still exists before restoring the session.
      const user = getUsers().find(
        (savedUser) => savedUser.id === session.id
      );

      if (user) {
        showDashboard(user);
      } else {
        sessionStorage.removeItem(SESSION_KEY);
        showSignup();
      }
    } else {
      showSignup();
    }
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    showSignup();
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const USERS_KEY = "uwishemaHubUsers";
  const SESSION_KEY = "uwishemaHubCurrentUser";

  const profileNav = document.getElementById("profile-nav");
  const avatarButton = document.getElementById("profile-avatar-button");
  const dropdown = document.getElementById("profile-dropdown");
  const navInitial = document.getElementById("nav-profile-initial");
  const navImage = document.getElementById("nav-profile-image");
  const navName = document.getElementById("nav-profile-name");
  const navEmail = document.getElementById("nav-profile-email");

  const dashboard = document.getElementById("user-dashboard");
  const photoInput = document.getElementById("profile-photo-input");
  const dashboardAvatar = document.getElementById("dashboard-avatar");
  const profileName = document.getElementById("profile-display-name");
  const completionText = document.getElementById("profile-completion");

  const developerDashboard =
    document.getElementById("developer-dashboard");
  const teacherDashboard =
    document.getElementById("teacher-dashboard");

  if (!profileNav || !avatarButton || !dashboard) {
    console.error("Profile dashboard HTML elements are missing.");
    return;
  }

  // Example opportunities for testing the dashboard.
  // Replace these with jobs returned by your backend later.
  const developerJobs = [
    {
      id: "dev-001",
      title: "Junior Web Developer",
      company: "Example Technology Company",
      location: "Kigali, Rwanda",
      type: "Entry level",
      description:
        "An example opportunity for someone with HTML, CSS and JavaScript skills."
    },
    {
      id: "dev-002",
      title: "PHP Developer Intern",
      company: "Example Digital Agency",
      location: "Kigali, Rwanda",
      type: "Internship",
      description:
        "An example internship for learners interested in PHP and databases."
    },
    {
      id: "dev-003",
      title: "Frontend Developer",
      company: "Example Software Studio",
      location: "Remote / Rwanda",
      type: "Junior",
      description:
        "An example role focused on responsive interfaces and JavaScript."
    }
  ];

  const teacherJobs = [
    {
      id: "teacher-001",
      title: "Mathematics Teacher",
      company: "Example Private School",
      location: "Kigali, Rwanda",
      type: "Teaching",
      description:
        "An example vacancy for a teacher interested in mathematics."
    },
    {
      id: "teacher-002",
      title: "English Teacher",
      company: "Example Learning Academy",
      location: "Rwanda",
      type: "Teaching",
      description:
        "An example teaching opportunity focused on English language learning."
    },
    {
      id: "teacher-003",
      title: "ICT Teacher",
      company: "Example Modern School",
      location: "Kigali, Rwanda",
      type: "Teaching",
      description:
        "An example opportunity for a teacher with ICT knowledge."
    }
  ];

  // Safely read the logged-in user.
  function getCurrentUser() {
    try {
      return JSON.parse(
        sessionStorage.getItem(SESSION_KEY) || "null"
      );
    } catch {
      return null;
    }
  }

  // Each account gets its own dashboard data.
  function getDataKey(user) {
    return "uwishemaHubData_" + user.id;
  }

  function getUserData(user) {
    try {
      return JSON.parse(
        localStorage.getItem(getDataKey(user)) || "{}"
      );
    } catch {
      return {};
    }
  }

  function saveUserData(user, updates) {
    const oldData = getUserData(user);
    const newData = { ...oldData, ...updates };

    localStorage.setItem(
      getDataKey(user),
      JSON.stringify(newData)
    );
  }

  function getInitial(name) {
    const cleanName = (name || "U").trim();
    return cleanName.charAt(0).toUpperCase() || "U";
  }

  // Keep the avatar image and initial in sync.
  function displayAvatar(name, photo) {
    const initial = getInitial(name);

    navInitial.textContent = initial;
    dashboardAvatar.textContent = initial;

    if (photo) {
      navImage.src = photo;
      navImage.hidden = false;
      navInitial.hidden = true;

      dashboardAvatar.replaceChildren();

      const image = document.createElement("img");
      image.src = photo;
      image.alt = name + "'s profile picture";
      dashboardAvatar.appendChild(image);
    } else {
      navImage.removeAttribute("src");
      navImage.hidden = true;
      navInitial.hidden = false;

      dashboardAvatar.textContent = initial;
    }

    completionText.textContent = photo
      ? "Profile photo added"
      : "Profile photo not added yet";
  }

  // Update the account stored by the existing demo login.
  function saveProfilePicture(user, photo) {
    const users = JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

    const index = users.findIndex(
      (savedUser) => savedUser.id === user.id
    );

    if (index !== -1) {
      users[index].profilePicture = photo;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    user.profilePicture = photo;

    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify(user)
    );
  }

  function showMessageOnPage(message) {
    let status = document.getElementById("profile-status");

    if (!status) {
      status = document.createElement("p");
      status.id = "profile-status";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      status.style.margin = "12px 0";
      status.style.color = "#087f73";

      const dashboardContent =
        document.getElementById("hub-dashboard");

      if (dashboardContent) {
        dashboardContent.prepend(status);
      }
    }

    status.textContent = message;
  }

  // Show the right dashboard for the account type.
  function renderDashboard(user) {
    if (!user) {
      profileNav.hidden = true;
      dropdown.hidden = true;
      avatarButton.setAttribute("aria-expanded", "false");
      return;
    }

    profileNav.hidden = false;

    navName.textContent = user.name || "Professional";
    navEmail.textContent = user.email || "";

    displayAvatar(user.name, user.profilePicture);

    const isDeveloper = user.category === "developer";

    developerDashboard.hidden = !isDeveloper;
    teacherDashboard.hidden = isDeveloper;

    const intro = document.getElementById("dashboard-intro");

    if (intro) {
      intro.textContent = isDeveloper
        ? "Grow your technical skills, manage projects and explore developer opportunities."
        : "Showcase your teaching experience and explore private school vacancies.";
    }

    loadSavedProfile(user);
    renderJobs(user);
    renderApplications(user);

    const navLogin = document.getElementById("nav-login");
    const navSignup = document.getElementById("nav-signup");

    if (navLogin) navLogin.hidden = true;
    if (navSignup) navSignup.hidden = true;
  }

  function loadSavedProfile(user) {
    const data = getUserData(user);

    const fields = {
      "developer-skills": data.skills,
      "developer-portfolio": data.portfolio,
      "developer-projects": data.projects,
      "developer-learning": data.learning,
      "teacher-qualification": data.qualification,
      "teacher-subjects": data.subjects,
      "teacher-experience": data.experience,
      "teacher-cv": data.cv,
      "teacher-achievements": data.achievements
    };

    Object.entries(fields).forEach(([id, value]) => {
      const field = document.getElementById(id);

      if (field) {
        field.value = value || "";
      }
    });
  }

  function bindSave(buttonId, fieldIds, dataNames, successMessage) {
    const button = document.getElementById(buttonId);

    if (!button) return;

    button.addEventListener("click", () => {
      const user = getCurrentUser();

      if (!user) return;

      const updates = {};

      fieldIds.forEach((fieldId, index) => {
        const field = document.getElementById(fieldId);
        if (field) {
          updates[dataNames[index]] = field.value.trim();
        }
      });

      saveUserData(user, updates);
      showMessageOnPage(successMessage);
    });
  }

  bindSave(
    "save-developer-skills",
    ["developer-skills"],
    ["skills"],
    "Your technical skills have been saved."
  );

  bindSave(
    "save-developer-portfolio",
    ["developer-portfolio", "developer-projects"],
    ["portfolio", "projects"],
    "Your portfolio details have been saved."
  );

  bindSave(
    "save-developer-learning",
    ["developer-learning"],
    ["learning"],
    "Your learning goals have been saved."
  );

  bindSave(
    "save-teacher-profile",
    [
      "teacher-qualification",
      "teacher-subjects",
      "teacher-experience"
    ],
    ["qualification", "subjects", "experience"],
    "Your teaching profile has been saved."
  );

  bindSave(
    "save-teacher-cv",
    ["teacher-cv", "teacher-achievements"],
    ["cv", "achievements"],
    "Your CV details have been saved."
  );

  // Upload a photo, resize it, and store it for this account.
  if (photoInput) {
    photoInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      const user = getCurrentUser();

      if (!file || !user) return;

      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        showMessageOnPage("Please choose a JPG, PNG or WebP image.");
        photoInput.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showMessageOnPage("Choose a photo smaller than 5 MB.");
        photoInput.value = "";
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();

        image.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSize = 300;
          const scale = Math.min(
            maxSize / image.width,
            maxSize / image.height,
            1
          );

          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);

          const context = canvas.getContext("2d");

          if (!context) {
            showMessageOnPage("Your browser could not process this photo.");
            return;
          }

          context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const photo = canvas.toDataURL("image/jpeg", 0.78);

          try {
            saveProfilePicture(user, photo);
            displayAvatar(user.name, photo);
            showMessageOnPage("Your profile photo has been updated.");
          } catch {
            showMessageOnPage(
              "The photo could not be saved. Try a smaller image."
            );
          }
        };

        image.onerror = () => {
          showMessageOnPage("That image could not be opened.");
        };

        image.src = reader.result;
      };

      reader.onerror = () => {
        showMessageOnPage("Could not read that photo.");
      };

      reader.readAsDataURL(file);
    });
  }

  // Remove the current profile photo.
  const removePhotoButton = document.getElementById("remove-photo");

  if (removePhotoButton) {
    removePhotoButton.addEventListener("click", () => {
      const user = getCurrentUser();
      if (!user) return;

      try {
        saveProfilePicture(user, "");
        displayAvatar(user.name, "");
        showMessageOnPage("Your profile photo has been removed.");
      } catch {
        showMessageOnPage("Could not update your profile photo.");
      }

      if (photoInput) photoInput.value = "";
    });
  }

  // Open and close the profile dropdown.
  avatarButton.addEventListener("click", () => {
    const opening = dropdown.hidden;
    dropdown.hidden = !opening;
    avatarButton.setAttribute("aria-expanded", String(opening));
  });

  document.addEventListener("click", (event) => {
    if (!profileNav.contains(event.target)) {
      dropdown.hidden = true;
      avatarButton.setAttribute("aria-expanded", "false");
    }
  });

  const dashboardLink = document.getElementById("open-my-dashboard");

  if (dashboardLink) {
    dashboardLink.addEventListener("click", () => {
      dropdown.hidden = true;
      dashboard.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const profileLink = document.getElementById("open-my-profile");

  if (profileLink) {
    profileLink.addEventListener("click", () => {
      dropdown.hidden = true;
      dashboard.scrollIntoView({ behavior: "smooth", block: "start" });

      setTimeout(() => {
        photoInput?.click();
      }, 150);
    });
  }

  const editProfileButton =
    document.getElementById("edit-profile-button");

  if (editProfileButton) {
    editProfileButton.addEventListener("click", () => {
      photoInput?.click();
    });
  }

  const navLogout = document.getElementById("nav-logout");

  if (navLogout) {
    navLogout.addEventListener("click", () => {
      document.getElementById("logout-button")?.click();
    });
  }

  // Store saved jobs and applications separately for each account.
  function getJobData(user) {
    const data = getUserData(user);

    return {
      savedJobs: data.savedJobs || [],
      applications: data.applications || []
    };
  }

  function renderJobs(user) {
    const isDeveloper = user.category === "developer";
    const jobs = isDeveloper ? developerJobs : teacherJobs;
    const list = document.getElementById(
      isDeveloper ? "developer-jobs" : "teacher-jobs"
    );

    const savedList = document.getElementById(
      isDeveloper ? "developer-saved-jobs" : "teacher-saved-jobs"
    );

    if (!list || !savedList) return;

    const jobData = getJobData(user);

    function makeJobCard(job, isSavedList = false) {
      const card = document.createElement("article");
      card.className = "job-card";

      const type = document.createElement("span");
      type.className = "job-type";
      type.textContent = job.type;

      const title = document.createElement("h4");
      title.textContent = job.title;

      const company = document.createElement("p");
      company.textContent = job.company;

      const location = document.createElement("p");
      location.textContent = "📍 " + job.location;

      const description = document.createElement("p");
      description.textContent = job.description;

      const demoNote = document.createElement("p");
      demoNote.textContent = "Example listing — not a live vacancy.";
      demoNote.style.fontSize = "12px";

      const actions = document.createElement("div");
      actions.className = "job-actions";

      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.className = "secondary-button";
      saveButton.textContent = jobData.savedJobs.includes(job.id)
        ? "Remove saved"
        : "Save job";

      saveButton.addEventListener("click", () => {
        const latest = getJobData(user);

        if (latest.savedJobs.includes(job.id)) {
          latest.savedJobs = latest.savedJobs.filter(
            (id) => id !== job.id
          );
        } else {
          latest.savedJobs.push(job.id);
        }

        saveUserData(user, latest);
        renderJobs(user);
      });

      actions.appendChild(saveButton);

      if (!isSavedList) {
        const applyButton = document.createElement("button");
        applyButton.type = "button";
        applyButton.className = "primary-button";
        applyButton.textContent = "Record application";

        const existingApplication = jobData.applications.some(
          (application) => application.id === job.id
        );

        if (existingApplication) {
          applyButton.disabled = true;
          applyButton.textContent = "Application recorded";
        }

        applyButton.addEventListener("click", () => {
          const latest = getJobData(user);

          if (latest.applications.some((application) => application.id === job.id)) {
            return;
          }

          latest.applications.push({
            id: job.id,
            title: job.title,
            company: job.company,
            status: "Recorded locally",
            appliedAt: new Date().toISOString()
          });

          saveUserData(user, latest);
          renderJobs(user);
          renderApplications(user);

          showMessageOnPage(
            "Demo application recorded on this device. It has not been sent to an employer."
          );
        });

        actions.appendChild(applyButton);
      }

      card.append(type, title, company, location, description, demoNote, actions);

      return card;
    }

    list.replaceChildren();

    jobs.forEach((job) => {
      list.appendChild(makeJobCard(job));
    });

    savedList.replaceChildren();

    const savedJobs = jobs.filter((job) =>
      jobData.savedJobs.includes(job.id)
    );

    if (savedJobs.length === 0) {
      savedList.textContent = "You have not saved any opportunities yet.";
    } else {
      savedJobs.forEach((job) => {
        savedList.appendChild(makeJobCard(job, true));
      });
    }
  }

  function renderApplications(user) {
    const isDeveloper = user.category === "developer";

    const list = document.getElementById(
      isDeveloper ? "developer-applications" : "teacher-applications"
    );

    if (!list) return;

    const applications = getJobData(user).applications;
    list.replaceChildren();

    if (applications.length === 0) {
      list.textContent = "No applications yet. Explore the opportunities below.";
      return;
    }

    applications.forEach((application) => {
      const item = document.createElement("div");
      item.className = "application-item";

      const title = document.createElement("strong");
      title.textContent = application.title;

      const company = document.createElement("span");
      company.textContent = application.company;

      const status = document.createElement("span");
      status.textContent = "Status: " + application.status;

      item.append(title, company, status);
      list.appendChild(item);
    });
  }

  // Sync with the login/logout system already in index.js.
  function refreshProfile() {
    const user = getCurrentUser();

    renderDashboard(user);

    if (!user) {
      const navLogin = document.getElementById("nav-login");
      const navSignup = document.getElementById("nav-signup");

      if (navLogin) navLogin.hidden = false;
      if (navSignup) navSignup.hidden = false;
    }
  }

  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", () => {
      setTimeout(refreshProfile, 0);
    });
  }

  const logoutButton = document.getElementById("logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      setTimeout(refreshProfile, 0);
    });
  }

  const showSignup = document.getElementById("show-signup");
  const showLogin = document.getElementById("show-login");

  showSignup?.addEventListener("click", refreshProfile);
  showLogin?.addEventListener("click", refreshProfile);

  // Also works when a logged-in session is already present.
  refreshProfile();
});
