import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Users } from './src/collections/Users'
import { Pages } from './src/collections/Pages'
import { Services } from './src/collections/Services'
import { TeamMembers } from './src/collections/TeamMembers'
import { MediaItems } from './src/collections/MediaItems'
import { Uploads } from './src/collections/Uploads'
import { ContactInquiries } from './src/collections/ContactInquiries'
import { SiteSettings } from './src/globals/SiteSettings'

const dirname = path.dirname(fileURLToPath(import.meta.url))

if (process.env.NODE_ENV === 'production' && !process.env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET must be configured in production.')
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  admin: { user: Users.slug, importMap: { baseDir: process.cwd() } },
  editor: lexicalEditor(), db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || '' }, push: process.env.NODE_ENV !== 'production' }),
  collections: [Users, Pages, Services, TeamMembers, MediaItems, Uploads, ContactInquiries], globals: [SiteSettings], sharp,
  typescript: { outputFile: path.resolve(dirname, 'src/payload-types.ts') },
})
