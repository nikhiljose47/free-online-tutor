import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export const seoResolver: ResolveFn<boolean> = (route) => {
  const title = inject(Title);
  const meta = inject(Meta);

  const { title: pageTitle, description, keywords } = route.data;

  if (pageTitle) {
    title.setTitle(pageTitle);
  }

  if (description) {
    meta.updateTag({
      name: 'description',
      content: description
    });
  }

  if (keywords) {
    meta.updateTag({
      name: 'keywords',
      content: keywords
    });
  }

  return true;
};
