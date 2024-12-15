export type Prayer = {
  id: string
  title: string
  content: string
  author_id: string
  created_at: string
  updated_at: string
  is_anonymous: boolean
  prayer_count: number
}

export type User = {
  id: string
  name: string
  email: string
  image: string
}

export type Comment = {
  id: string
  content: string
  author_id: string
  prayer_id: string
  created_at: string
}

export type PrayerWithAuthorAndComments = Prayer & {
  author: User
  comments: Comment[]
}
