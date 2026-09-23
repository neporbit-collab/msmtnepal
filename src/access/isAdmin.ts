import type { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => Boolean(user && (user as { role?: string }).role === 'admin')
export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user)
export const publishedOrStaff: Access = ({ req: { user } }) => user ? true : { _status: { equals: 'published' } }
