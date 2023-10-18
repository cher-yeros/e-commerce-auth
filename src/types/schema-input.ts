export interface CreateUserInput {
  // Define the properties of the createUser input
  // For example:
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  // Define the properties of the updateUser input
  // For example:
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface CreateProductInput {
  name: string;
  price: number;
  userId: string;
  quantity: number;
}

export interface UpdateProductInput {
  // Define the properties of the updateProduct input
  // For example:
  id: string;
  name?: string;
  description?: string;
  price?: number;
}

export interface CreateOrderInput {
  userId: string;
  productId: string;
  quantity: number;
  totalPrice: number;
}

export interface UpdateOrderInput {
  // Define the properties of the updateOrder input
  // For example:
  id: string;
  quantity: number;
}

export interface CreatePaymentInput {
  userId: string;
  amount: number;
  status: string;
}

export interface UpdatePaymentInput {
  // Define the properties of the updatePayment input
  // For example:
  id: string;
  orderId?: string;
  amount?: number;
  paymentMethod?: string;
}

export interface CreateNotificationInput {
  // Define the properties of the createNotification input
  // For example:
  message: string;
}

export interface UpdateNotificationInput {
  // Define the properties of the updateNotification input
  // For example:
  id: string;
  message?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
