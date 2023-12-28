import {
  generateSchemaTypes,
  generateReactQueryComponents,
} from '@openapi-codegen/typescript'
import { defineConfig } from '@openapi-codegen/cli'

export default defineConfig({
  api: {
    from: {
      source: 'url',
      url: 'http://localhost:8080/docs-json',
    },
    outputDir: 'src/api',
    to: async (context) => {
      const filenamePrefix = 'api'
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
        useEnums: true,
      })
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      })
    },
  },
})
