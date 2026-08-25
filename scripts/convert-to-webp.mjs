import sharp from 'sharp'
import { readdirSync, unlinkSync, readFileSync } from 'fs'
import { join, extname, basename } from 'path'

const DIR = join(process.cwd(), 'public', 'images')
const files = readdirSync(DIR).filter((f) => /\.(jpe?g|png)$/i.test(f))

for (const file of files) {
  const src = join(DIR, file)
  const dest = join(DIR, `${basename(file, extname(file))}.webp`)
  const buffer = readFileSync(src)
  await sharp(buffer).webp({ quality: 82 }).toFile(dest)
  unlinkSync(src)
  console.log(`${file} -> ${basename(dest)}`)
}

console.log(`Done: ${files.length} images converted.`)
