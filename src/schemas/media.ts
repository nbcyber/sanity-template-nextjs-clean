import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'media',
  title: 'Media',
  type: 'document',
  fields: [
    defineField({
        name: 'assetId',
        title: 'Asset ID',
        type: 'reference',
        to: [{type: 'image'}, {type: 'file'}]
      }),
      defineField({
        name: 'assetURL',
        title: 'Asset URL',
        type: 'String',
      }),
  ],

})
