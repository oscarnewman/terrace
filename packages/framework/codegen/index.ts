import path from 'path'
import fs from 'fs/promises'
import { loadSchema } from '@framework/codegen/introspect'
import { generateTypes } from '@framework/codegen/generate'

export async function loadSchemaAndWrite(outputPath: string = 'database') {
  const outputDir = path.dirname(outputPath)

  try {
    await fs.access(outputDir)
  } catch {
    await fs.mkdir(outputDir, { recursive: true })
  }

  const schema = await loadSchema()
  const types = await generateTypes(schema)

  const outPath = path.join(process.cwd(), outputPath, '_generated.ts')
  await fs.writeFile(outPath, types)
}
