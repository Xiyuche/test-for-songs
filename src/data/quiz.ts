import { currentContentPack } from '../content/current-pack'
import type {
  ContentPack,
  PackDimension,
  PackQuestion,
  PackSourceCard,
  PackTrack,
  PackVoiceGuide,
} from '../content/schema'

export type DimensionId = string
export type DimensionDefinition = PackDimension
export type Question = PackQuestion
export type SongProfile = PackTrack
export type VoiceGuide = PackVoiceGuide
export type SourceCard = PackSourceCard
export type QuizContentPack = ContentPack

export const contentPack = currentContentPack
export const likertLabels = contentPack.likertLabels
export const dimensions = contentPack.dimensions
export const questions = contentPack.questions
export const songs = contentPack.tracks
export const sourceCards = contentPack.ui.sources.cards
