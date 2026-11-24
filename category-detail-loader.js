(function () {
  const categories = {
    corporate: {
      name: 'Corporate Gifting',
      bannerBefore: 'Corporate',
      bannerAfter: 'Gifting',
      description: 'Thoughtfully curated gifting solutions designed to strengthen relationships and make every brand moment memorable.',
      heroImage: '../../assets/Corporate%20Gifting/corporate-gifting.png',
      heroTitle: 'Thoughtful gifting that makes every [[brand relationship]] count.',
      heroLead: 'Create memorable connections with curated gifts designed around your employees, clients, partners and brand.',
      featureTitle: 'Why Corporate Gifting Matters?',
      solutionsTitle: 'Curated Gifting for Every [[Relationship]]',
      solutionsLead: 'From meaningful employee moments to premium client gestures, create gifting experiences people remember.',
      cards: [
        ['Executive Gift Sets', 'Premium kits designed to make senior relationships feel valued.', 'icon-gift', 'Corporate%20Gifting/corporate-executive-gift-sets.png'],
        ['Employee Welcome Kits', 'Thoughtful onboarding gifts that help people feel connected from day one.', 'icon-users', 'Corporate%20Gifting/corporate-employee-welcome-kits.png'],
        ['Client Appreciation Gifts', 'Memorable gifting moments that keep your brand close to valued clients.', 'icon-handshake', 'Corporate%20Gifting/corporate-client-appreciation-gifts.png'],
        ['Festive Gift Boxes', 'Seasonal collections curated for celebration, warmth and lasting recall.', 'icon-calendar', 'Corporate%20Gifting/corporate-festive-gift-boxes.png'],
        ['Premium Drinkware', 'Useful branded essentials that stay visible throughout the workday.', 'icon-layers', 'Corporate%20Gifting/corporate-premium-drinkware.png'],
        ['Custom Gift Hampers', 'Flexible product combinations created around your campaign and audience.', 'icon-diamond', 'Corporate%20Gifting/corporate-custom-gift-hampers.png']
      ]
    },
    events: {
      name: 'Events & Exhibitions',
      bannerBefore: 'Events &',
      bannerAfter: 'Exhibitions',
      description: 'Bringing your events and exhibitions to life with thoughtful experiences, branded details and seamless execution.',
      heroImage: '../../assets/Events%20%26%20Exhibitions/events-exhibitions.png',
      heroTitle: 'Memorable experiences that make every [[event moment]] count.',
      heroLead: 'Bring your audience closer with purposeful event kits, exhibition details and branded experiences built around your objectives.',
      featureTitle: 'Why Events Matter?',
      solutionsTitle: 'Experiences Designed for Every [[Exhibition]]',
      solutionsLead: 'Create consistent, memorable touchpoints that help your event stand out before, during and after the show.',
      cards: [
        ['Event Starter Kits', 'Branded essentials that set the tone for a smooth and memorable event.', 'icon-calendar', 'Events%20%26%20Exhibitions/events-event-starter-kits.png'],
        ['Exhibition Displays', 'High-impact visual details that help your space attract the right audience.', 'icon-layers', 'Events%20%26%20Exhibitions/events-exhibition-displays.png'],
        ['Conference Gifting', 'Useful, considered gifts that keep your brand part of the conversation.', 'icon-gift', 'Events%20%26%20Exhibitions/events-conference-gifting.png'],
        ['Launch Experiences', 'Coordinated launch moments designed to create attention and excitement.', 'icon-bulb', 'Events%20%26%20Exhibitions/events-launch-experiences.png'],
        ['Booth Essentials', 'Practical branded accessories that make your team and space work better.', 'icon-gear', 'Events%20%26%20Exhibitions/events-booth-essentials.png'],
        ['Event Merchandise', 'Custom merchandise that turns event energy into lasting brand recall.', 'icon-megaphone', 'Events%20%26%20Exhibitions/events-event-merchandise.png']
      ]
    },
    branding: {
      name: 'Branding & Marketing',
      bannerBefore: 'Branding &',
      bannerAfter: 'Marketing',
      description: 'Turning brand thinking into useful, consistent and memorable marketing experiences across every touchpoint.',
      heroImage: '../../assets/Branding%20%26%20Marketing/branding-marketing.png',
      heroTitle: 'Strategic branding that makes every [[brand interaction]] count.',
      heroLead: 'Build stronger recognition with customised marketing materials designed around your message, audience and visual identity.',
      featureTitle: 'Why Brand Consistency Matters?',
      solutionsTitle: 'Brand Experiences for Every [[Touchpoint]]',
      solutionsLead: 'Bring your brand to life through consistent products, campaigns and physical experiences that people remember.',
      cards: [
        ['Brand Identity Kits', 'Thoughtful brand essentials that keep your visual identity consistent and visible.', 'icon-target', 'Branding%20%26%20Marketing/branding-brand-identity-kits.png'],
        ['Campaign Collateral', 'Custom campaign materials that turn a strong idea into a clear brand story.', 'icon-megaphone', 'Branding%20%26%20Marketing/branding-campaign-collateral.png'],
        ['Digital Brand Assets', 'Useful visual assets that help your message travel further and faster.', 'icon-bulb', 'Branding%20%26%20Marketing/branding-digital-brand-assets.png'],
        ['Packaging & Print', 'Branded packaging and print details designed to make every handover count.', 'icon-layers', 'Branding%20%26%20Marketing/branding-packaging-print.png'],
        ['Promotional Branding', 'High-utility merchandise that keeps your brand present in everyday life.', 'icon-gift', 'Branding%20%26%20Marketing/branding-promotional-branding.png'],
        ['Custom Brand Experiences', 'End-to-end ideas that connect products, people and brand purpose.', 'icon-diamond', 'Branding%20%26%20Marketing/branding-custom-brand-experiences.png']
      ]
    }
  };

  const pageKey = document.body.dataset.category || 'corporate';
  const config = categories[pageKey] || categories.corporate;
  const templateUrl = new URL('./Personalised%20Inputs.html', window.location.href);

  const highlight = (value) => value.replace(/\[\[(.*?)\]\]/g, '<span class="highlight-yellow">$1</span>');

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  const updateVerticalLinks = () => {
    const links = {
      'Personalised Inputs': './Personalised%20Inputs.html',
      'Corporate Gifting': './Corporate%20Gifting.html',
      'Events & Exhibitions': './Events%20%26%20Exhibitions.html',
      'Branding & Marketing': './Branding%20%26%20Marketing.html'
    };

    document.querySelectorAll('.nav-dropdown a, .footer-column a').forEach((link) => {
      const label = link.textContent.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
      const target = Object.keys(links).find((name) => label.includes(name));
      if (target) link.setAttribute('href', links[target]);
      if (link.closest('.nav-dropdown')) link.classList.toggle('active', target === config.name);
    });
  };

  const applyCategory = () => {
    document.body.className = 'detail-page personalised-inputs-page category-detail-page';
    document.body.dataset.enquiryCategory = {
      corporate: 'corporate-gifting',
      events: 'events-exhibitions',
      branding: 'branding-marketing'
    }[pageKey] || 'personalised-inputs';

    const enquiryCategory = document.body.dataset.enquiryCategory;
    document.querySelectorAll('[data-open-enquiry], .nav-cta').forEach((trigger) => {
      trigger.dataset.enquiryCategory = enquiryCategory;
    });
    const popupRequirement = document.querySelector('#popupRequirement');
    if (popupRequirement) {
      popupRequirement.value = enquiryCategory;
      popupRequirement.classList.add('selected-active');
    }

    document.title = `${config.name} | Ryze Marketing`;

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', `${config.name} by Ryze Marketing — ${config.description}`);

    const bannerTitle = document.querySelector('.contact-hero-title');
    if (bannerTitle) bannerTitle.innerHTML = `${config.bannerBefore} <span>${config.bannerAfter}</span>`;
    setText('.contact-hero-subtitle', config.description);
    setText('.crumb-current', config.name);

    const heroImage = document.querySelector('.pi-collage-img');
    if (heroImage) {
      heroImage.src = config.heroImage;
      heroImage.alt = `${config.name} branded product collection`;
    }

    const heroTitle = document.querySelector('.pi-hero-title');
    if (heroTitle) heroTitle.innerHTML = highlight(config.heroTitle);
    setText('.pi-hero-lead', config.heroLead);

    const featureTitle = document.querySelector('.pi-features-title');
    if (featureTitle) featureTitle.innerHTML = highlight(config.featureTitle);

    const solutionTitle = document.querySelector('.pi-solutions-title');
    if (solutionTitle) solutionTitle.innerHTML = highlight(config.solutionsTitle);
    setText('.pi-solutions-lead', config.solutionsLead);

    document.querySelectorAll('.pi-solution-card').forEach((card, index) => {
      const item = config.cards[index];
      if (!item) return;
      const [title, descriptionText, icon, image] = item;
      const cardTitle = card.querySelector('.pi-card-title');
      if (cardTitle) cardTitle.textContent = title;
      const cardDescription = card.querySelector('.pi-card-desc');
      if (cardDescription) cardDescription.textContent = descriptionText;
      const iconUse = card.querySelector('.pi-card-badge-icon use');
      if (iconUse) iconUse.setAttribute('href', `#${icon}`);
      const cardImage = card.querySelector('.pi-card-photo');
      if (cardImage) {
        cardImage.src = `../../assets/${image}`;
        cardImage.alt = `${title} — ${config.name}`;
      }
    });

    const ctaTitle = document.querySelector('.cta-reference-copy h2');
    if (ctaTitle) ctaTitle.innerHTML = `Let’s Bring Your ${config.name}<br /><em>Ideas to Life</em>`;
    const ctaLead = document.querySelector('.cta-reference-lead');
    if (ctaLead) ctaLead.innerHTML = `Partner with Ryze Marketing for customised ${config.name.toLowerCase()} solutions, <br class="cta-desktop-only" />brand experiences and memorable campaigns.`;

    document.querySelectorAll('.cta-reference-action a').forEach((link) => {
      link.href = `../contact.html?category=${enquiryCategory}#contact-form-section`;
    });

    updateVerticalLinks();
  };

  fetch(templateUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`Template request failed: ${response.status}`);
      return response.text();
    })
    .then((markup) => {
      const template = new DOMParser().parseFromString(markup, 'text/html');
      template.body.querySelectorAll('script').forEach((script) => script.remove());
      document.body.replaceChildren(...Array.from(template.body.childNodes).map((node) => document.importNode(node, true)));
      applyCategory();

      const appScript = document.createElement('script');
      appScript.src = '../../script.js';
      document.body.appendChild(appScript);
    })
    .catch((error) => {
      document.body.innerHTML = '<main style="padding:48px 20px;font-family:Arial,sans-serif;text-align:center"><h1>Page could not be loaded</h1><p>Please refresh and try again.</p></main>';
      console.error(error);
    });
})();
