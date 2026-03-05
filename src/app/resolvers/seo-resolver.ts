
import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export const seoResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot
) => {

  const titleService = inject(Title);
  const meta = inject(Meta);
  const document = inject(DOCUMENT);

  const city = route.paramMap.get('city');
  const data = route.data;

  let pageTitle = data['title'] || '';
  let description = data['description'] || '';
  let keywords = data['keywords'] || '';

  if (city) {
    const formatted =
      city.charAt(0).toUpperCase() + city.slice(1);

    pageTitle =
      `Top Tuition Centers in ${formatted} | Coaching Institutes`;

    description =
      `Find the best tuition centers in ${formatted}. Compare ratings, subjects and enroll confidently.`;

    keywords =
      `${formatted} tuition centers, coaching institutes in ${formatted}, best tuition in ${formatted}`;
  }

  if (pageTitle) {
    titleService.setTitle(pageTitle);
    meta.updateTag({ property: 'og:title', content: pageTitle });
  }

  if (description) {
    meta.updateTag({ name: 'description', content: description });
    meta.updateTag({ property: 'og:description', content: description });
  }

  if (keywords) {
    meta.updateTag({ name: 'keywords', content: keywords });
  }

  /* Canonical */
  const canonicalUrl =
    document.location.origin + document.location.pathname;

  let link: HTMLLinkElement | null =
    document.querySelector("link[rel='canonical']");

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  link.setAttribute('href', canonicalUrl);

  return true;
};