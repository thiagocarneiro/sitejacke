import { config, fields, collection } from '@keystatic/core';

export default config({
  storage:
    import.meta.env.DEV
      ? { kind: 'local' }
      : {
          kind: 'github',
          repo: 'thiagocarneiro/sitejacke',
        },
  ui: {
    brand: { name: 'Blog Dra Jackeline' },
  },
  collections: {
    blog: collection({
      label: 'Artigos do Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: { label: 'Título', validation: { isRequired: true } },
        }),
        description: fields.text({
          label: 'Descrição (SEO)',
          multiline: true,
          validation: { isRequired: true },
        }),
        publishDate: fields.date({
          label: 'Data de publicação',
          validation: { isRequired: true },
        }),
        updatedDate: fields.date({
          label: 'Data de atualização',
        }),
        category: fields.text({
          label: 'Categoria',
        }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        featuredImage: fields.image({
          label: 'Imagem de capa',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        }),
        featuredImageAlt: fields.text({
          label: 'Texto alternativo da imagem',
        }),
        draft: fields.checkbox({
          label: 'Rascunho',
          defaultValue: false,
        }),
        content: fields.markdoc({
          label: 'Conteúdo',
        }),
      },
    }),
  },
});
