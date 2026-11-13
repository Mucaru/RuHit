import { activityMeta } from './activities'
import type { Activity } from '../lib/math'

export type LegacyTopic = {
  id: Activity
  slug: string
  title: string
  description: string
  activity: Activity
}

const slugs: Record<Activity, string> = {
  addition: 'penjumlahan-bersusun',
  subtraction: 'pengurangan-bersusun',
  multiplication: 'perkalian-bersusun',
  division: 'pembagian-bersusun',
  'factor-tree': 'pohon-faktor',
  prime: 'bilangan-prima',
  gcd: 'fpb',
  lcm: 'kpk',
}

export const legacyTopics: LegacyTopic[] = activityMeta.map((item) => ({
  id: item.id,
  slug: slugs[item.id],
  title: item.title,
  description: item.description,
  activity: item.id,
}))

export const legacyTopicBySlug = (slug: string) => legacyTopics.find((topic) => topic.slug === slug)
