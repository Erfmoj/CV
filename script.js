document.addEventListener('DOMContentLoaded', function() {
    const resumeDataUrl = 'resume.json'; 

    fetch(resumeDataUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            populateResume(data);
        })
        .catch(error => {
            console.error('خطا در بارگذاری اطلاعات رزومه:', error);
            document.body.innerHTML = '<p style="text-align:center; color:red; font-family:Vazirmatn;">متاسفانه اطلاعات رزومه بارگذاری نشد. لطفاً فایل resume.json را بررسی کرده و صفحه را با یک سرور محلی اجرا کنید.</p>';
        });
});

function populateResume(data) {
    const info = data.personalInfo;
    

    document.title = `رزومه - ${info.name}`;
    document.getElementById('profile-pic').src = info.profilePicture;
    document.getElementById('profile-pic').onerror = function() { 
        this.src = 'https://placehold.co/400x400/EFEFEF/333?text=Image+Not+Found';
    };
    document.getElementById('name').textContent = info.name;
    document.getElementById('title').textContent = info.title;

 
    const contactInfoDiv = document.getElementById('contact-info');
    let contactHTML = '';


    if (info.email) {
        contactHTML += `<p><i class="fas fa-envelope"></i><span>${info.email}</span></p>`;
    }
    if (info.phone) {
        contactHTML += `<p><i class="fas fa-phone"></i><span>${info.phone}</span></p>`;
    }

    let socialIconsHTML = '';
    const socialLinks = [
        { key: 'linkedin', icon: 'fab fa-linkedin', title: 'لینکدین' },
        { key: 'github', icon: 'fab fa-github', title: 'گیت‌هاب' },
        { key: 'telegram', icon: 'fab fa-telegram', title: 'تلگرام' },
        { key: 'website', icon: 'fas fa-globe', title: 'وب‌سایت' }
    ];

    socialLinks.forEach(link => {
        if (info[link.key] && info[link.key] !== null) { 
            socialIconsHTML += `<a href="${info[link.key]}" target="_blank" rel="noopener noreferrer" title="${link.title}"><i class="${link.icon}"></i></a>`;
        }
    });

    if (socialIconsHTML) {
        contactHTML += `<div class="social-icons">${socialIconsHTML}</div>`;
    }

    contactInfoDiv.innerHTML = contactHTML;
    

    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = ''; 

    for (const category in data.skills) {
        if (Object.prototype.hasOwnProperty.call(data.skills, category) && data.skills[category].length > 0) {

            const categoryTitle = document.createElement('h4');
            categoryTitle.textContent = category;
            skillsList.appendChild(categoryTitle); 

            data.skills[category].forEach(skill => {
                const listItem = document.createElement('li');
                listItem.textContent = skill;
                skillsList.appendChild(listItem);
            });
        }
    }


    document.getElementById('summary').textContent = info.summary;

    const experienceSection = document.getElementById('experience-section');
    experienceSection.innerHTML = '<h3>سوابق شغلی</h3>';
    data.experience.forEach(job => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'job';
        itemDiv.innerHTML = `
            <h4>${job.title} <span class="company">در ${job.company}</span></h4>
            <p class="period">${job.period}</p>
            <p>${job.description}</p>
        `;
        experienceSection.appendChild(itemDiv);
    });

    const educationSection = document.getElementById('education-section');
    educationSection.innerHTML = '<h3>تحصیلات</h3>';
    data.education.forEach(edu => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'education-item';
        itemDiv.innerHTML = `
            <h4>${edu.degree}</h4>
            <p class="period">${edu.university} (${edu.period})</p>
        `;
        educationSection.appendChild(itemDiv);
    });
}
