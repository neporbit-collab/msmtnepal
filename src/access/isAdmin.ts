import type { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => Boolean(user && (user as { role?: string }).role === 'admin')
export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user)
export const isAdminOrEditor: Access = ({ req: { user } }) => Boolean(user && ['admin', 'editor'].includes((user as { role?: string }).role || ''))
export const isAdminOrPublisher: Access = ({ req: { user } }) => Boolean(user && ['admin', 'publisher'].includes((user as { role?: string }).role || ''))
export const isContentStaff: Access = ({ req: { user } }) => Boolean(user && ['admin', 'editor', 'publisher'].includes((user as { role?: string }).role || ''))
export const publishedOrStaff: Access = ({ req: { user } }) => user ? true : { _status: { equals: 'published' } }
