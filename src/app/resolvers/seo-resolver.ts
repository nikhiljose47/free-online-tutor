import { inject, PLATFORM_ID } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export const seoResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const titleService = inject(Title);
  const meta = inject(Meta);
  const document = inject(DOCUMENT);
  const platformId = inject(PLATFORM_ID);

  const city = route.paramMap.get('city');
  const data = route.data;

  const BRAND = 'Scholo Learning';
  const BASE_URL = 'https://www.scholo.co.in';

  let pageTitle = data['title'] || BRAND;
  let description = data['description'] || '';
  let keywords = data['keywords'] || '';

  /* Dynamic city SEO */
  if (city) {
    const formatted = city.charAt(0).toUpperCase() + city.slice(1);

    pageTitle = `Top Tuition Centers in ${formatted} | ${BRAND}`;

    description = `Find the best tuition centers, coaching institutes and private tutors in ${formatted}. Compare ratings and enroll easily on ${BRAND}.`;

    keywords = `${formatted} tuition centers, coaching institutes in ${formatted}, best tutors in ${formatted}, ${BRAND.toLowerCase()}`;
  }

  /* Title */
  titleService.setTitle(pageTitle);

  /* Core Meta */
  meta.updateTag({ name: 'description', content: description });
  meta.updateTag({ name: 'keywords', content: keywords });

  /* Open Graph (Facebook, LinkedIn) */
  meta.updateTag({ property: 'og:title', content: pageTitle });
  meta.updateTag({ property: 'og:description', content: description });
  meta.updateTag({ property: 'og:type', content: 'website' });

  /* URL (important for sharing) */
  if (isPlatformBrowser(platformId)) {
    const currentUrl = document.location.pathname;
    const fullUrl = BASE_URL + currentUrl;

    meta.updateTag({ property: 'og:url', content: fullUrl });

    /* Canonical */
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', fullUrl);
  }

  /* Twitter SEO */
  meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
  meta.updateTag({ name: 'twitter:title', content: pageTitle });
  meta.updateTag({ name: 'twitter:description', content: description });

  /* No Index (important for dashboards/login) */
  if (data['noIndex']) {
    meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  } else {
    meta.updateTag({ name: 'robots', content: 'index, follow' });
  }

  return true;
};
