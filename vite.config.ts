import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isUserOrOrgPagesRepo = repositoryName?.toLowerCase().endsWith('.github.io')

const pagesBasePath = repositoryName
  ? isUserOrOrgPagesRepo
    ? '/'
    : `/${repositoryName}/`
  : '/'

export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH ?? (process.env.GITHUB_ACTIONS ? pagesBasePath : '/'),
})
