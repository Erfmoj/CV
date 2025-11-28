document.addEventListener('DOMContentLoaded', function() {
    // از آدرس نسبی استفاده می‌کنیم
    const resumeDataUrl = 'resume.json'; 

    fetch(resumeDataUrl)
        .then(response => {
            if (!response.ok) {
                // اگر فایل JSON پیدا نشد، خطا نمایش داده می‌شود
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
    
    // --- پر کردن ستون چپ ---
    document.title = `رزومه - ${info.name}`;
    document.getElementById('profile-pic').src = info.profilePicture;
    document.getElementById('profile-pic').onerror = function() { 
        this.src = 'https://placehold.co/400x400/EFEFEF/333?text=Image+Not+Found';
    };
    document.getElementById('name').textContent = info.name;
    document.getElementById('title').textContent = info.title;

    // --- بازنویسی کامل بخش اطلاعات تماس ---
    const contactInfoDiv = document.getElementById('contact-info');
    let contactHTML = '';

    // ۱. اضافه کردن اطلاعات قابل کپی (ایمیل و تلفن)
    if (info.email) {
        contactHTML += `<p><i class="fas fa-envelope"></i><span>${info.email}</span></p>`;
    }
    if (info.phone) {
        contactHTML += `<p><i class="fas fa-phone"></i><span>${info.phone}</span></p>`;
    }

    // ۲. اضافه کردن آیکون‌های شبکه‌های اجتماعی
    let socialIconsHTML = '';
    const socialLinks = [
        { key: 'linkedin', icon: 'fab fa-linkedin', title: 'لینکدین' },
        { key: 'github', icon: 'fab fa-github', title: 'گیت‌هاب' },
        { key: 'telegram', icon: 'fab fa-telegram', title: 'تلگرام' },
        { key: 'website', icon: 'fas fa-globe', title: 'وب‌سایت' }
    ];

    socialLinks.forEach(link => {
        // این بخش چک می‌کند که آیا مقدار 'website' برابر با null است یا نه
        if (info[link.key] && info[link.key] !== null) { 
            socialIconsHTML += `<a href="${info[link.key]}" target="_blank" rel="noopener noreferrer" title="${link.title}"><i class="${link.icon}"></i></a>`;
        }
    });

    if (socialIconsHTML) {
        contactHTML += `<div class="social-icons">${socialIconsHTML}</div>`;
    }

    // ۳. قرار دادن HTML نهایی در صفحه
    contactInfoDiv.innerHTML = contactHTML;
    
    // --- پر کردن مهارت‌ها (با پشتیبانی از دسته‌بندی) ---
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = ''; 

    // تکرار بر روی کلیدهای شیء skills (یعنی دسته‌بندی‌ها)
    for (const category in data.skills) {
        if (Object.prototype.hasOwnProperty.call(data.skills, category) && data.skills[category].length > 0) {
            
            // ایجاد عنوان برای دسته‌بندی (مثلاً: "Programming Languages")
            const categoryTitle = document.createElement('h4');
            categoryTitle.textContent = category;
            skillsList.appendChild(categoryTitle);

            // تکرار بر روی مهارت‌های داخل هر دسته‌بندی
            data.skills[category].forEach(skill => {
                const listItem = document.createElement('li');
                listItem.textContent = skill;
                skillsList.appendChild(listItem);
            });
        }
    }

    // --- پر کردن ستون راست ---
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
