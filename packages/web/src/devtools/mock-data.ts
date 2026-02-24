export interface MockUser {
  id: string
  name: string
  email: string
  status: "active" | "inactive"
}

export interface MockProduct {
  id: string
  name: string
  price: number
  stock: number
}

const names = ["Mahesh", "Alex", "Sara", "Jordan", "Lee"]

export const generateMockUsers = (count = 10): MockUser[] => {
  return Array.from({ length: count }, (_, index) => {
    const name = names[index % names.length]
    return {
      id: `user-${index + 1}`,
      name,
      email: `${name.toLowerCase()}${index + 1}@example.com`,
      status: index % 2 === 0 ? "active" : "inactive",
    }
  })
}

export const generateMockProducts = (count = 10): MockProduct[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `product-${index + 1}`,
    name: `Product ${index + 1}`,
    price: Number((Math.random() * 200 + 10).toFixed(2)),
    stock: Math.floor(Math.random() * 100),
  }))
}
