export type Prayer = {
  id: any
  title: any
  content: any
  author_id: any
  created_at: any
  updated_at: any
  is_anonymous: any
  is_hidden: any
  prayer_count: any
  status: any
  status_message: any
}

export type User = {
  id: any
  name: any
  email: any
  image: any
  created_at: any
  updated_at: any
}

export type Comment = {
  id: any
  content: any
  created_at: any
  author_id: any
  author: {
    id: any
    name: any
    image: any
  }
}

export type LastPrayer = {
  id: any
  full_name: any
  image: any
}

export type PrayerWithAuthorAndComments = Prayer & {
  author: {
    id: any
    name: any
    email: any
    image: any
  }
  comments: Array<{
    id: any
    content: any
    author_id: any
    created_at: any
    author: {
      name: any
      image: any
    }
  }>
}