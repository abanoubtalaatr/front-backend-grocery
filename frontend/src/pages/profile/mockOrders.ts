export type OrderLinePreview = {
  name: string
  qty: number
  imageUrl: string
}

export type MockOrder = {
  id: string
  dateLabel: string
  itemCount: number
  status: 'Completed' | 'Processing' | 'Cancelled'
  totalGbp: number
  lines: OrderLinePreview[]
  /** Shown as “+N more” after first visible previews */
  moreCount: number
}

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'GP001',
    dateLabel: 'Nov 24, 2025',
    itemCount: 6,
    status: 'Completed',
    totalGbp: 250,
    lines: [
      {
        name: 'Premium Orange',
        qty: 1,
        imageUrl:
          'https://images.unsplash.com/photo-1547514701-42782101795e?w=120&h=120&fit=crop',
      },
      {
        name: 'Bananas',
        qty: 2,
        imageUrl:
          'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=120&h=120&fit=crop',
      },
      {
        name: 'Free range Eggs',
        qty: 1,
        imageUrl:
          'https://images.unsplash.com/photo-1506976785307-8732e854ad88?w=120&h=120&fit=crop',
      },
      {
        name: 'Whole Milk',
        qty: 1,
        imageUrl:
          'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=120&h=120&fit=crop',
      },
    ],
    moreCount: 2,
  },
  {
    id: 'GP002',
    dateLabel: 'Nov 18, 2025',
    itemCount: 8,
    status: 'Completed',
    totalGbp: 198.5,
    lines: [
      {
        name: 'Rambutan',
        qty: 1,
        imageUrl:
          'https://images.unsplash.com/photo-1590004987778-6e96f0c9e7d6?w=120&h=120&fit=crop',
      },
      {
        name: 'Kiwi',
        qty: 3,
        imageUrl:
          'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=120&h=120&fit=crop',
      },
    ],
    moreCount: 6,
  },
]
