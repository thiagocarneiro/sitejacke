import { siteInfo } from './navigation';
import { faqItems } from './faq';

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dietitian',
    '@id': 'https://nutricionistajackeline.com.br/#business',
    name: 'Dra Jackeline Queiroz',
    alternateName: 'Jackeline Queiroz Nutricionista',
    description:
      'Nutricionista funcional e esportiva em São Paulo com mais de 15 anos de experiência. Especializada em emagrecimento, composição corporal, performance esportiva e saúde da mulher.',
    url: 'https://nutricionistajackeline.com.br',
    telephone: '+5511970632874',
    email: siteInfo.email,
    image: 'https://nutricionistajackeline.com.br/images/hero/jackeline-hero.png',
    priceRange: '$$',
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Av. Angélica, 2491, 9º andar',
        addressLocality: 'São Paulo',
        addressRegion: 'SP',
        postalCode: '01227-200',
        addressCountry: 'BR',
        name: 'Consultório Bela Vista',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Av. Brigadeiro Faria Lima, 1461, 6º andar',
        addressLocality: 'São Paulo',
        addressRegion: 'SP',
        postalCode: '01452-002',
        addressCountry: 'BR',
        name: 'Consultório Pinheiros',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Av. Antártica, 675, 19º e 20º andar',
        addressLocality: 'São Paulo',
        addressRegion: 'SP',
        postalCode: '05003-020',
        addressCountry: 'BR',
        name: 'Consultório Perdizes',
      },
    ],
    geo: [
      {
        '@type': 'GeoCoordinates',
        latitude: -23.5505,
        longitude: -46.6592,
        name: 'Consultório Bela Vista',
      },
      {
        '@type': 'GeoCoordinates',
        latitude: -23.5674,
        longitude: -46.6916,
        name: 'Consultório Pinheiros',
      },
      {
        '@type': 'GeoCoordinates',
        latitude: -23.5245,
        longitude: -46.6782,
        name: 'Consultório Perdizes',
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'São Paulo' },
      { '@type': 'State', name: 'SP' },
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      bestRating: '5',
      worstRating: '1',
      reviewCount: '2',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Otávio Coelho' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Jackeline é incrível: super atenciosa e atualizada e monta a dieta alimentar junto com o paciente. Sem terrorismo ou ser impossível. Conheci e fiquei fã! E os resultados vieram muito rápido. Indico para todos.',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Emanuelle Pizzinatto' },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'A Jacke é uma profissional super atenciosa e dedicada. Sempre fui muito bem atendida e sempre tive o apoio necessário mesmo após consulta. Sempre passa muita informação, pergunta sobre hábitos, faz adaptações no cardápio de acordo com rotina e preferências. Recomendo!',
      },
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

export function getArticleSchema(post: {
  title: string;
  description: string;
  publishDate: Date;
  updatedDate?: Date;
  featuredImage?: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishDate.toISOString(),
    dateModified: (post.updatedDate || post.publishDate).toISOString(),
    image: post.featuredImage
      ? `https://nutricionistajackeline.com.br${post.featuredImage}`
      : undefined,
    url: `https://nutricionistajackeline.com.br/${post.slug}/`,
    author: {
      '@type': 'Person',
      '@id': 'https://nutricionistajackeline.com.br/sobre/#person',
      name: 'Dra Jackeline Queiroz',
      url: 'https://nutricionistajackeline.com.br/sobre/',
      jobTitle: 'Nutricionista Funcional e Esportiva',
    },
    publisher: {
      '@id': 'https://nutricionistajackeline.com.br/#organization',
    },
  };
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://nutricionistajackeline.com.br/#website',
    name: 'Dra Jackeline Queiroz - Nutricionista Funcional e Esportiva',
    url: 'https://nutricionistajackeline.com.br',
    description:
      'Site oficial da Dra Jackeline Queiroz, nutricionista funcional e esportiva em São Paulo.',
    publisher: { '@id': 'https://nutricionistajackeline.com.br/#organization' },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://nutricionistajackeline.com.br/blog/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://nutricionistajackeline.com.br/#organization',
    name: 'Dra Jackeline Queiroz - Nutricionista',
    url: 'https://nutricionistajackeline.com.br',
    logo: 'https://nutricionistajackeline.com.br/favicon.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+5511970632874',
      contactType: 'customer service',
      availableLanguage: 'Portuguese',
      areaServed: 'BR',
    },
    sameAs: [siteInfo.instagram, siteInfo.youtube],
    founder: { '@id': 'https://nutricionistajackeline.com.br/sobre/#person' },
  };
}

export function getServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': 'https://nutricionistajackeline.com.br/#services',
    name: 'Consulta Nutricional - Dra Jackeline Queiroz',
    provider: { '@id': 'https://nutricionistajackeline.com.br/#business' },
    serviceType: 'Nutrição Funcional e Esportiva',
    areaServed: { '@type': 'City', name: 'São Paulo' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Formatos de Atendimento',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Consulta Avulsa',
            description: 'Avaliação nutricional completa com estratégia alimentar individualizada, avaliação física ISAK e ultrassom Bodymetrix.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Acompanhamento Trimestral',
            description: 'Acompanhamento nutricional de 3 meses com consultas regulares e alinhamentos online.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Acompanhamento 6 Meses',
            description: 'Formato completo com consultas a cada 30-40 dias, alinhamentos quinzenais e materiais de apoio semanais.',
          },
        },
      ],
    },
  };
}
