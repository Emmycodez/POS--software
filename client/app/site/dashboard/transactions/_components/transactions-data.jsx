// Sample transactions data based on the actual schema
export const transactionsData = [
  {
    id: "TRX-1001",
    products: [
      {
        product: {
          _id: "prod-001",
          name: "Premium T-Shirt",
          sku: "TS-001",
        },
        quantity: 2,
        price: 29.99,
      },
      {
        product: {
          _id: "prod-003",
          name: "Leather Wallet",
          sku: "LW-003",
        },
        quantity: 1,
        price: 49.99,
      },
    ],
    totalAmount: 109.97,
    amountReceived: 120.0,
    changeGiven: 10.03,
    paymentMethod: "cash",
    status: "completed",
    createdAt: "2024-03-20T14:30:00Z",
    updatedAt: "2024-03-20T14:32:00Z",
  },
  {
    id: "TRX-1002",
    products: [
      {
        product: {
          _id: "prod-002",
          name: "Wireless Headphones",
          sku: "WH-002",
        },
        quantity: 1,
        price: 89.99,
      },
      {
        product: {
          _id: "prod-007",
          name: "Phone Case",
          sku: "PC-007",
        },
        quantity: 1,
        price: 19.99,
      },
    ],
    totalAmount: 109.98,
    amountReceived: 109.98,
    changeGiven: 0,
    paymentMethod: "card",
    status: "completed",
    createdAt: "2024-03-20T11:45:00Z",
    updatedAt: "2024-03-20T11:47:00Z",
  },
  {
    id: "TRX-1003",
    products: [
      {
        product: {
          _id: "prod-004",
          name: "Smart Watch",
          sku: "SW-004",
        },
        quantity: 1,
        price: 199.99,
      },
    ],
    totalAmount: 199.99,
    amountReceived: 200.0,
    changeGiven: 0.01,
    paymentMethod: "cash",
    status: "completed",
    createdAt: "2024-03-20T16:20:00Z",
    updatedAt: "2024-03-20T16:22:00Z",
  },
  {
    id: "TRX-1004",
    products: [
      {
        product: {
          _id: "prod-005",
          name: "Running Shoes",
          sku: "RS-005",
        },
        quantity: 1,
        price: 79.99,
      },
      {
        product: {
          _id: "prod-008",
          name: "Sports Socks",
          sku: "SS-008",
        },
        quantity: 3,
        price: 9.99,
      },
    ],
    totalAmount: 109.96,
    amountReceived: 109.96,
    changeGiven: 0,
    paymentMethod: "mobile money",
    status: "failed",
    createdAt: "2024-03-20T10:15:00Z",
    updatedAt: "2024-03-20T10:20:00Z",
  },
  {
    id: "TRX-1005",
    products: [
      {
        product: {
          _id: "prod-009",
          name: "Coffee Mug",
          sku: "CM-009",
        },
        quantity: 2,
        price: 12.99,
      },
      {
        product: {
          _id: "prod-010",
          name: "Notebook",
          sku: "NB-010",
        },
        quantity: 1,
        price: 8.99,
      },
    ],
    totalAmount: 34.97,
    amountReceived: 35.0,
    changeGiven: 0.03,
    paymentMethod: "cash",
    status: "completed",
    createdAt: "2024-03-20T15:30:00Z",
    updatedAt: "2024-03-20T15:32:00Z",
  },
  {
    id: "TRX-1006",
    products: [
      {
        product: {
          _id: "prod-011",
          name: "Bluetooth Speaker",
          sku: "BS-011",
        },
        quantity: 1,
        price: 59.99,
      },
      {
        product: {
          _id: "prod-012",
          name: "USB Cable",
          sku: "UC-012",
        },
        quantity: 2,
        price: 7.99,
      },
    ],
    totalAmount: 75.97,
    amountReceived: 80.0,
    changeGiven: 4.03,
    paymentMethod: "cash",
    status: "completed",
    createdAt: "2024-03-19T12:45:00Z",
    updatedAt: "2024-03-19T12:47:00Z",
  },
  {
    id: "TRX-1007",
    products: [
      {
        product: {
          _id: "prod-013",
          name: "Desk Lamp",
          sku: "DL-013",
        },
        quantity: 1,
        price: 34.99,
      },
      {
        product: {
          _id: "prod-014",
          name: "Picture Frame",
          sku: "PF-014",
        },
        quantity: 2,
        price: 15.99,
      },
    ],
    totalAmount: 66.97,
    amountReceived: 66.97,
    changeGiven: 0,
    paymentMethod: "bank transfer",
    status: "completed",
    createdAt: "2024-03-19T14:20:00Z",
    updatedAt: "2024-03-19T14:25:00Z",
  },
  {
    id: "TRX-1008",
    products: [
      {
        product: {
          _id: "prod-001",
          name: "Premium T-Shirt",
          sku: "TS-001",
        },
        quantity: 3,
        price: 29.99,
      },
      {
        product: {
          _id: "prod-015",
          name: "Jeans",
          sku: "JN-015",
        },
        quantity: 1,
        price: 49.99,
      },
    ],
    totalAmount: 139.96,
    amountReceived: 140.0,
    changeGiven: 0.04,
    paymentMethod: "cash",
    status: "pending",
    createdAt: "2024-03-19T09:30:00Z",
    updatedAt: "2024-03-19T09:32:00Z",
  },
  {
    id: "TRX-1009",
    products: [
      {
        product: {
          _id: "prod-016",
          name: "Yoga Mat",
          sku: "YM-016",
        },
        quantity: 1,
        price: 24.99,
      },
      {
        product: {
          _id: "prod-017",
          name: "Water Bottle",
          sku: "WB-017",
        },
        quantity: 1,
        price: 12.99,
      },
    ],
    totalAmount: 37.98,
    amountReceived: 37.98,
    changeGiven: 0,
    paymentMethod: "card",
    status: "completed",
    createdAt: "2024-03-18T16:45:00Z",
    updatedAt: "2024-03-18T16:47:00Z",
  },
  {
    id: "TRX-1010",
    products: [
      {
        product: {
          _id: "prod-018",
          name: "Coffee Beans",
          sku: "CB-018",
        },
        quantity: 2,
        price: 14.99,
      },
      {
        product: {
          _id: "prod-019",
          name: "Tea Sampler",
          sku: "TS-019",
        },
        quantity: 1,
        price: 18.99,
      },
    ],
    totalAmount: 48.97,
    amountReceived: 50.0,
    changeGiven: 1.03,
    paymentMethod: "cash",
    status: "completed",
    createdAt: "2024-03-18T11:15:00Z",
    updatedAt: "2024-03-18T11:17:00Z",
  },
]

