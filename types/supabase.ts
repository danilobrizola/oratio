export type Prayer = {
  id: string
  title: string
  content: string
  author_id: string | null
  created_at: string | null
  updated_at: string | null
  is_anonymous: boolean | null
  is_hidden: boolean
  prayer_count: number | null
  status: string | null
  status_message: string | null
}

export type User = {
  id: string
  name: string | null
  email: string | null
  image: string | null
  created_at: string | null
  updated_at: string | null
}

export type Comment = {
  id: string
  content: string
  author_id: string | null
  prayer_id: string | null
  created_at: string | null
  updated_at: string | null
  author: {
    name: string
    image: string
  }
}

export type PrayerWithAuthorAndComments = Prayer & {
  author: User
  comments: Comment[]
}
