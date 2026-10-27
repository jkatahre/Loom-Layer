import { useEffect } from 'react';
import { store } from '../config/store';

const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
};

/** Sets the document title and description for the current route. */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    const { seo } = store.identity;
    const fullTitle = title ? seo.titleTemplate.replace('%s', title) : seo.defaultTitle;
    const desc = description ?? seo.description;
    document.title = fullTitle;
    setMeta('meta[name="description"]', 'name', 'description', desc);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc);
  }, [title, description]);
}
