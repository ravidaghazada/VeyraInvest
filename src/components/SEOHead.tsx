import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface PageSeoConfig {
  title: string;
  description: string;
  canonicalPath: string;
  isPrivate?: boolean;
  breadcrumbs?: { name: string; path: string }[];
}

const SEO_CONFIGS: Record<string, PageSeoConfig> = {
  landing: {
    title: 'Veyra Invest — Azərbaycanın Rəqəmsal Əmlak İnvestisiya Platforması',
    description: 'Veyra Invest — Azərbaycanın ilk rəqəmsal əmlak investisiya platforması. Veyra Home layihəsi ilə lüks villa tikintisi mərhələləri, şəffaf portfel və zəmanətli gəlir imkanları.',
    canonicalPath: '/',
    breadcrumbs: [{ name: 'Ana Səhifə', path: '/' }],
  },
  products: {
    title: 'Tikinti Mərhələləri & Portfel — Veyra Home İnvestisiya Məhsulları | Veyra Invest',
    description: 'Veyra Home 8 mərhələli tikinti investisiya portfeli. Torpaq sahəsindən Elite Villayadək hər bir mərhələnin gəlirlilik faizləri, təhlükəsizlik təminatı və investisiya şərtləri.',
    canonicalPath: '/products',
    breadcrumbs: [
      { name: 'Ana Səhifə', path: '/' },
      { name: 'İnvestisiya Məhsulları', path: '/products' },
    ],
  },
  calculator: {
    title: 'İnvestisiya Gəlir Kalkulyatoru — Qazancınızı Hesablayın | Veyra Invest',
    description: 'Veyra Invest gəlir kalkulyatoru ilə investisiya məbləğinizi və müddəti seçərək gündəlik, aylıq və dövr üzrə xalis qazancınızı dəqiq hesablayın.',
    canonicalPath: '/calculator',
    breadcrumbs: [
      { name: 'Ana Səhifə', path: '/' },
      { name: 'Qazanc Kalkulyatoru', path: '/calculator' },
    ],
  },
  visualizer: {
    title: '3D Veyra Home İnteraktiv Memarlıq Modeli | Veyra Invest',
    description: 'İnvestisiya etdiyiniz villanın torpaq sahəsindən daxili təmir və hovuzadək bütün tikinti mərhələlərini interaktiv 3D model ilə canlı izləyin.',
    canonicalPath: '/visualizer',
    breadcrumbs: [
      { name: 'Ana Səhifə', path: '/' },
      { name: '3D Vizualizator', path: '/visualizer' },
    ],
  },
  howItWorks: {
    title: 'Necə İşləyir? — 4 Sadə Addımla İnvestisiyaya Başlayın | Veyra Invest',
    description: 'Qeydiyyat, depozit, mərhələ seçimi və gündəlik qazancın çıxarılması. Veyra Invest platformasının addım-addım iş prinsipi və təhlükəsizlik mexanizmi.',
    canonicalPath: '/howitworks',
    breadcrumbs: [
      { name: 'Ana Səhifə', path: '/' },
      { name: 'Necə İşləyir?', path: '/howitworks' },
    ],
  },
  about: {
    title: 'Haqqımızda — Missiya, Göstəricilər və Korporativ Profil | Veyra Invest',
    description: 'Veyra Invest QSC haqqında rəsmi məlumat: VÖEN 1504938211, missiyamız, korporativ idarəetmə və real aktivlərlə təminatlı investisiya modeli.',
    canonicalPath: '/about',
    breadcrumbs: [
      { name: 'Ana Səhifə', path: '/' },
      { name: 'Haqqımızda', path: '/about' },
    ],
  },
  legal: {
    title: 'Hüquqi Şəffaflıq, Lisenziya & Təhlükəsizlik Qaydaları | Veyra Invest',
    description: 'AR-INV/2024-883 nömrəli lisenziya, risk bəyanatı, fərdi məlumatların qorunması və investor müqaviləsi şərtləri.',
    canonicalPath: '/legal',
    breadcrumbs: [
      { name: 'Ana Səhifə', path: '/' },
      { name: 'Hüquqi Məlumat', path: '/legal' },
    ],
  },
  dashboard: {
    title: 'İnvestor Kabineti — Şəxsi Portfel və Balans | Veyra Invest',
    description: 'Veyra Invest investor idarəetmə paneli. Balans, aktiv mərhələlər, depozit və çıxarış əməliyyatlarının idarə olunması.',
    canonicalPath: '/dashboard',
    isPrivate: false,
    breadcrumbs: [
      { name: 'Ana Səhifə', path: '/' },
      { name: 'İnvestor Kabineti', path: '/dashboard' },
    ],
  },
  history: {
    title: 'Əməliyyat Tarixçəsi — Maliyyə Qeydləri | Veyra Invest',
    description: 'İnvestisiya, depozit və qazanc əməliyyatlarınızın rəsmi elektron qeydləri.',
    canonicalPath: '/history',
    breadcrumbs: [
      { name: 'Ana Səhifə', path: '/' },
      { name: 'Əməliyyat Tarixçəsi', path: '/history' },
    ],
  },
  admin: {
    title: 'Mərkəzi İdarəetmə Paneli | Veyra Invest',
    description: 'Veyra Invest daxili inzibati sistem.',
    canonicalPath: '/admin',
    isPrivate: true,
  },
};

const BASE_DOMAIN = 'https://veyrainvest.az';

export const SEOHead: React.FC = () => {
  const { activeView } = useApp();

  useEffect(() => {
    const config = SEO_CONFIGS[activeView] || SEO_CONFIGS.landing;
    const fullCanonicalUrl = `${BASE_DOMAIN}${config.canonicalPath}`;

    // 1. Update Document Title
    document.title = config.title;

    // 2. Update Meta Description
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = config.description;

    // 3. Update Canonical Tag
    let linkCanonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = fullCanonicalUrl;

    // 4. Update Open Graph Tags
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = config.title;

    const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = config.description;

    const ogUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = fullCanonicalUrl;

    // 5. Update Twitter Card Tags
    const twitterTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.content = config.title;

    const twitterDesc = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.content = config.description;

    // 6. Update Robots tag: ONLY set noindex on admin, keep index on all public pages
    let metaRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    if (config.isPrivate) {
      metaRobots.content = 'noindex, nofollow';
    } else {
      metaRobots.content = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    }

    // 7. Inject / Update Breadcrumbs Schema (JSON-LD)
    if (config.breadcrumbs && config.breadcrumbs.length > 0) {
      const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: config.breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: `${BASE_DOMAIN}${b.path}`,
        })),
      };

      let scriptTag = document.getElementById('dynamic-breadcrumb-schema') as HTMLScriptElement | null;
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-breadcrumb-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(breadcrumbData);
    }
  }, [activeView]);

  return null;
};
