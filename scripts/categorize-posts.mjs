/**
 * Categoriza todos os posts do blog baseado nos títulos.
 * Uso: node scripts/categorize-posts.mjs
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content', 'blog');

// Mapeamento slug → categoria
const categoryMap = {
  // ── Emagrecimento ──────────────────────────────────────────────
  'nao-consigo-emagrecer': 'Emagrecimento',
  'emagrecer-comer-menos-ou-gastar-mais': 'Emagrecimento',
  '10-dicas-de-nutricao-para-emagrecer-com-saude-no-verao': 'Emagrecimento',
  'cafe-da-manha-para-emagrecer-o-que-comer-para-perder-peso-com-saude-2': 'Emagrecimento',
  'como-emagrecer-na-menopausa-estrategias-alimentares-que-funcionam': 'Emagrecimento',
  'da-para-emagrecer-rapido-a-verdade-que-voce-precisa-saber': 'Emagrecimento',
  'deficit-calorico-o-segredo-por-tras-de-todo-emagrecimento': 'Emagrecimento',
  'emagrecer-causa-flacidez-saiba-como-prevenir-e-tratar': 'Emagrecimento',
  'estrategias-eficazes-e-saudaveis-para-a-perda-de-peso': 'Emagrecimento',
  'genetica-x-obesidade-ela-nao-te-define': 'Emagrecimento',
  'nutricao-funcional-e-emagrecimento-comer-menos-e-parte-da-solucao-mas-nao-e-tudo': 'Emagrecimento',
  'por-que-depois-dos-40-emagrecer-fica-mais-dificil': 'Emagrecimento',
  'por-que-ir-a-um-nutricionista-pode-ser-o-que-falta-para-voce-emagrecer-de-vez': 'Emagrecimento',
  'trate-sua-dieta-como-uma-mudanca-de-habitos-o-caminho-para-um-emagrecimento-sustentavel': 'Emagrecimento',
  'emagrecimento-saudavel-como-escolher-o-nutricionista-certo-para-voce': 'Emagrecimento',
  'emagrecimento-saudavel-como-escolher-o-nutricionista-certo-para-voce-2': 'Emagrecimento',
  'como-evitar-os-erros-mais-comuns-nas-dietas-de-verao': 'Emagrecimento',
  'viciados-em-doces-desvendando-os-obstaculos-no-caminho-de-uma-alimentacao-equilibrada': 'Emagrecimento',

  // ── Dietas e Estratégias Alimentares ───────────────────────────
  '1%ef%b8%8f%e2%83%a3-dieta-low-carb-estrategia-alimentar-beneficios-e-cuidados': 'Dietas e Estratégias Alimentares',
  'dieta-para-quem-usa-canetas-emagrecedoras-glp-1-como-comer-para-ter-resultado-com-menos-efeitos-colaterais': 'Dietas e Estratégias Alimentares',
  'dieta-anti-inflamatoria-beneficios-e-como-implementa-la': 'Dietas e Estratégias Alimentares',
  'medo-do-carboidrato-explorando-suas-funcoes-vitais-no-corpo': 'Dietas e Estratégias Alimentares',
  'alimentos-ruins-que-viciam-seu-cerebro-e-paladar': 'Dietas e Estratégias Alimentares',

  // ── Nutrição Esportiva ─────────────────────────────────────────
  '4-dicas-praticas-para-hipertrofia': 'Nutrição Esportiva',
  'alimentacao-pre-e-pos-treino-o-que-comer-para-maximizar-resultados': 'Nutrição Esportiva',
  'hidratacao-adequada-melhora-o-desempenho-na-corrida': 'Nutrição Esportiva',
  'hidratacao-e-natacao-como-manter-o-corpo-bem-alimentado-durante-o-treino': 'Nutrição Esportiva',
  'nutricao-esportiva-o-segredo-para-melhorar-seu-desempenho-e-evitar-lesoes': 'Nutrição Esportiva',
  'nutricao-para-esportistas-no-verao-dicas-para-maximizar-a-performance-e-a-recuperacao': 'Nutrição Esportiva',
  'pre-treino-suplemento-de-cafeina-ou-1-xicara-de-cafe': 'Nutrição Esportiva',
  'mito-e-necessario-consumir-suplementos-de-proteina-imediatamente-apos-o-exercicio-para-maximizar-o-crescimento-muscular': 'Nutrição Esportiva',

  // ── Saúde da Mulher ────────────────────────────────────────────
  'tpm-intensa-a-alimentacao-pode-influenciar': 'Saúde da Mulher',
  'nutricao-e-perimenopausa-cuidando-da-saude-durante-essa-transicao': 'Saúde da Mulher',
  'lipedema-e-nutricao-estrategias-para-controlar-os-sintomas': 'Saúde da Mulher',

  // ── Saúde Intestinal ───────────────────────────────────────────
  'intestino-preso-pode-atrapalhar-o-emagrecimento': 'Saúde Intestinal',
  '120-80-agora-e-pre-hipertensao-o-que-muda-na-alimentacao-segundo-a-nova-diretriz-brasileira-2025': 'Saúde Intestinal',
  'o-impacto-da-saude-intestinal-no-emagrecimento-e-bem-estar-2': 'Saúde Intestinal',
  'sindrome-do-intestino-irritavel-e-o-tratamento-nutricional': 'Saúde Intestinal',
  'sindrome-do-intestino-irritavel-como-a-dieta-low-fodmap-pode-ajudar': 'Saúde Intestinal',
  'os-incriveis-beneficios-do-acido-caprilico-impulsionando-sua-saude-de-dentro-para-fora': 'Saúde Intestinal',

  // ── Saúde e Bem-Estar ──────────────────────────────────────────
  'a-relacao-entre-alimentacao-e-saude-mental': 'Saúde e Bem-Estar',
  'alimentacao-para-hipertensao-arterial-o-que-comer-para-controlar-a-pressao': 'Saúde e Bem-Estar',
  'alimentos-anti-inflamatorios-reduza-o-inchaco-e-melhore-sua-saude': 'Saúde e Bem-Estar',
  'alimentos-para-hidratar-o-corpo-e-proteger-a-pele-no-verao': 'Saúde e Bem-Estar',
  'alimentos-precisam-sempre-ser-organicos-2': 'Saúde e Bem-Estar',
  'cansaco-constante-mesmo-dormindo-o-que-pode-estar-acontecendo': 'Saúde e Bem-Estar',
  'comida-e-emocoes-como-a-alimentacao-influencia-seu-bem-estar': 'Saúde e Bem-Estar',
  'como-a-nutricao-funcional-pode-melhorar-sua-saude-e-prevenir-doencas-mesmo-com-a-rotina-agitada': 'Saúde e Bem-Estar',
  'nutricao-contra-o-estresse-alimentos-que-ajudam-a-promover-o-bem-estar-na-vida-urbana': 'Saúde e Bem-Estar',
  'o-poder-da-alimentacao-saudavel-e-da-rotina-no-combate-a-depressao': 'Saúde e Bem-Estar',
  'o-impacto-da-saude-intestinal-no-emagrecimento-e-bem-estar': 'Saúde e Bem-Estar', // This one is actually "Segurança Alimentar"
  'saude-ossea-alimentos-e-habitos-que-fazem-a-diferenca': 'Saúde e Bem-Estar',
  'cafe-da-manha-para-emagrecer-o-que-comer-para-perder-peso-com-saude': 'Saúde e Bem-Estar', // Actually "Alimentação e TDAH"

  // ── Suplementação e Fitoterapia ────────────────────────────────
  'o-que-e-coenzima-q-10': 'Suplementação e Fitoterapia',
  'suplementos-naturais-o-que-realmente-funciona-e-como-usa-los': 'Suplementação e Fitoterapia',
  'fitoterapia-como-as-plantas-medicinais-podem-auxiliar-na-sua-saude': 'Suplementação e Fitoterapia',
};

async function main() {
  const files = await fs.readdir(CONTENT_DIR);
  const mdFiles = files.filter((f) => f.endsWith('.md'));

  let updated = 0;
  let alreadyCorrect = 0;
  let notMapped = 0;

  for (const file of mdFiles) {
    const slug = file.replace('.md', '');
    const newCategory = categoryMap[slug];
    const filePath = path.join(CONTENT_DIR, file);
    let content = await fs.readFile(filePath, 'utf-8');

    if (!newCategory) {
      console.log(`⚠ No mapping for: ${slug}`);
      notMapped++;
      continue;
    }

    // Replace existing category line
    const categoryRegex = /^category: .*$/m;
    const newCategoryLine = `category: "${newCategory}"`;

    if (categoryRegex.test(content)) {
      const oldMatch = content.match(categoryRegex)[0];
      if (oldMatch === newCategoryLine) {
        alreadyCorrect++;
        continue;
      }
      content = content.replace(categoryRegex, newCategoryLine);
    } else {
      // Add category after description
      content = content.replace(
        /^(description: .*)$/m,
        `$1\ncategory: "${newCategory}"`
      );
    }

    await fs.writeFile(filePath, content, 'utf-8');
    console.log(`✅ ${slug} → ${newCategory}`);
    updated++;
  }

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`✅ Updated: ${updated}`);
  console.log(`✔ Already correct: ${alreadyCorrect}`);
  if (notMapped > 0) console.log(`⚠ Not mapped: ${notMapped}`);

  // Summary by category
  console.log(`\n📊 Distribuição:`);
  const counts = {};
  for (const cat of Object.values(categoryMap)) {
    counts[cat] = (counts[cat] || 0) + 1;
  }
  for (const [cat, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${cat}: ${count} posts`);
  }
}

main().catch(console.error);
