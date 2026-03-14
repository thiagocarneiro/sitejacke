import { siteInfo } from './navigation';
import { faqItems } from './faq';

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: 'Dra Jackeline Queiroz',
    alternateName: 'Jackeline Queiroz Nutricionista',
    description:
      'Nutricionista funcional e esportiva em São Paulo com mais de 10 anos de experiência. Especializada em emagrecimento, composição corporal, performance esportiva e saúde da mulher.',
    url: 'https://nutricionistajackeline.com.br',
    telephone: '+5511970632874',
    email: siteInfo.email,
    image: 'https://nutricionistajackeline.com.br/images/hero/jackeline-hero.png',
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Av. Angélica, 2491, 9º andar',
        addressLocality: 'São Paulo',
        addressRegion: 'SP',
        addressCountry: 'BR',
        name: 'Consultório Bela Vista',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Av. Brigadeiro Faria Lima, 1461, 6º andar',
        addressLocality: 'São Paulo',
        addressRegion: 'SP',
        addressCountry: 'BR',
        name: 'Consultório Pinheiros',
      },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '21:00',
    },
    sameAs: [siteInfo.instagram, siteInfo.youtube],
    medicalSpecialty: ['Sports Medicine', 'Nutrition'],
    knowsAbout: [
      'nutrição funcional',
      'nutrição esportiva',
      'emagrecimento',
      'composição corporal',
      'saúde da mulher',
      'performance esportiva',
    ],
  };
}

export function getFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/<[^>]*>/g, ''),
      },
    })),
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dra Jackeline Queiroz - Nutricionista Funcional e Esportiva',
    url: 'https://nutricionistajackeline.com.br',
    description:
      'Site oficial da Dra Jackeline Queiroz, nutricionista funcional e esportiva em São Paulo.',
  };
}
