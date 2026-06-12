"use client";

import { Animal, CartItem, Order, User, AnimalFilters } from '@/types';

const isClient = typeof window !== 'undefined';

const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (!isClient) return defaultValue;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const setLocalStorage = <T>(key: string, value: T): void => {
  if (!isClient) return;
  localStorage.setItem(key, JSON.stringify(value));
};

// Default listings
const DEFAULT_ANIMALS: Animal[] = [
  {
    id: "1",
    name: "Shorthorn Dairy Cow",
    type: "cattle",
    breed: "Shorthorn",
    age: 24,
    weight: 450,
    price: 120000,
    description: "Healthy Dairy Shorthorn cow. Vaccinated and ready for milking or breeding. High milk yield history.",
    images: ["/cow.svg"],
    sellerId: "seller-1",
    seller: {
      id: "seller-1",
      email: "amina@farmmart.com",
      name: "Amina Ibrahim",
      role: "seller",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    location: "Oyo State",
    health_status: "vaccinated",
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Boer Goat Buck",
    type: "goat",
    breed: "Boer",
    age: 8,
    weight: 35,
    price: 45000,
    description: "Purebred Boer goat buck. Very active, healthy, and fast-growing. Ideal for farm breeding.",
    images: ["/cow.svg"],
    sellerId: "seller-2",
    seller: {
      id: "seller-2",
      email: "chidi@farmmart.com",
      name: "Chidi Okafor",
      role: "seller",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    location: "Kaduna State",
    health_status: "healthy",
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "Layer Chickens (20pcs)",
    type: "poultry",
    breed: "Isa Brown",
    age: 5,
    price: 25000,
    description: "Healthy Isa Brown layer chickens. Point-of-lay group of 20 chickens. Fully vaccinated.",
    images: ["/cow.svg"],
    sellerId: "seller-3",
    seller: {
      id: "seller-3",
      email: "lagospoultry@farmmart.com",
      name: "Lagos Poultry Farm",
      role: "seller",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    location: "Lagos State",
    health_status: "vaccinated",
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    name: "Landrace Breeding Pig",
    type: "pig",
    breed: "Landrace",
    age: 12,
    weight: 110,
    price: 85000,
    description: "Premium landrace breeding sow. High fertility rate line. Treated and vaccinated.",
    images: ["/cow.svg"],
    sellerId: "seller-1",
    seller: {
      id: "seller-1",
      email: "amina@farmmart.com",
      name: "Amina Ibrahim",
      role: "seller",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    location: "Ogun State",
    health_status: "treated",
    available: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const localStorageDb = {
  // --- Animals ---
  getAnimals: (filters: AnimalFilters = {}): Animal[] => {
    let animals = getLocalStorage<Animal[]>('farmmart_animals', DEFAULT_ANIMALS);
    
    // Ensure default values are written if empty
    if (isClient && !localStorage.getItem('farmmart_animals')) {
      setLocalStorage('farmmart_animals', DEFAULT_ANIMALS);
    }

    if (filters.type) {
      animals = animals.filter(a => a.type === filters.type);
    }
    if (filters.breed) {
      animals = animals.filter(a => a.breed.toLowerCase().includes(filters.breed!.toLowerCase()));
    }
    if (filters.minPrice) {
      animals = animals.filter(a => a.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      animals = animals.filter(a => a.price <= filters.maxPrice!);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      animals = animals.filter(a => 
        a.name.toLowerCase().includes(searchLower) || 
        a.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_asc':
          animals.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          animals.sort((a, b) => b.price - a.price);
          break;
        case 'oldest':
          animals.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case 'newest':
        default:
          animals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    }

    return animals;
  },

  getAnimalById: (id: string): Animal | null => {
    const animals = getLocalStorage<Animal[]>('farmmart_animals', DEFAULT_ANIMALS);
    return animals.find(a => a.id === id) || null;
  },

  createAnimal: (animalData: Omit<Animal, 'id' | 'createdAt' | 'updatedAt' | 'available'>): Animal => {
    const animals = getLocalStorage<Animal[]>('farmmart_animals', DEFAULT_ANIMALS);
    const newAnimal: Animal = {
      ...animalData,
      id: Math.random().toString(36).substring(2, 9),
      available: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    animals.push(newAnimal);
    setLocalStorage('farmmart_animals', animals);
    return newAnimal;
  },

  // --- Cart ---
  getCartItems: (userEmail: string): CartItem[] => {
    const key = `farmmart_cart_${userEmail}`;
    return getLocalStorage<CartItem[]>(key, []);
  },

  addToCart: (userEmail: string, animalId: string, quantity: number = 1): CartItem[] => {
    const key = `farmmart_cart_${userEmail}`;
    const cart = getLocalStorage<CartItem[]>(key, []);
    const animal = localStorageDb.getAnimalById(animalId);
    
    if (!animal) return cart;

    const existingIndex = cart.findIndex(item => item.animalId === animalId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: Math.random().toString(36).substring(2, 9),
        userId: userEmail, // linking with email since we log in with email
        animalId,
        animal,
        quantity,
        addedAt: new Date()
      });
    }

    setLocalStorage(key, cart);
    return cart;
  },

  removeFromCart: (userEmail: string, cartItemId: string): CartItem[] => {
    const key = `farmmart_cart_${userEmail}`;
    let cart = getLocalStorage<CartItem[]>(key, []);
    cart = cart.filter(item => item.id !== cartItemId);
    setLocalStorage(key, cart);
    return cart;
  },

  clearCart: (userEmail: string): void => {
    const key = `farmmart_cart_${userEmail}`;
    setLocalStorage(key, []);
  },

  // --- Orders ---
  getOrders: (userEmail: string): Order[] => {
    const key = `farmmart_orders_${userEmail}`;
    return getLocalStorage<Order[]>(key, []);
  },

  getAllOrders: (): Order[] => {
    const allOrders: Order[] = [];
    // Get all localStorage keys that match the order pattern
    if (isClient) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('farmmart_orders_')) {
          const orders = getLocalStorage<Order[]>(key, []);
          allOrders.push(...orders);
        }
      }
    }
    return allOrders;
  },

  getSellerOrders: (sellerId: string): Order[] => {
    const allOrders = localStorageDb.getAllOrders();
    return allOrders.filter(order => 
      order.items.some(item => item.animal.sellerId === sellerId)
    );
  },

  updateOrderStatus: (orderId: string, newStatus: Order['status']): void => {
    if (!isClient) return;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('farmmart_orders_')) {
        const orders = getLocalStorage<Order[]>(key, []);
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex > -1) {
          orders[orderIndex].status = newStatus;
          orders[orderIndex].updatedAt = new Date();
          setLocalStorage(key, orders);
          return;
        }
      }
    }
  },

  createOrder: (
    userEmail: string,
    user: Omit<User, 'createdAt' | 'updatedAt'>,
    deliveryAddress: string,
    phoneNumber: string
  ): Order | null => {
    const cartKey = `farmmart_cart_${userEmail}`;
    const cart = getLocalStorage<CartItem[]>(cartKey, []);
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((sum, item) => sum + (item.animal.price * item.quantity), 0);
    const totalAmount = subtotal + 5000 + Math.floor(subtotal * 0.075); // subtotal + shipping + tax

    const ordersKey = `farmmart_orders_${userEmail}`;
    const orders = getLocalStorage<Order[]>(ordersKey, []);

    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      userId: userEmail,
      user: {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      items: cart.map(item => ({
        id: Math.random().toString(36).substring(2, 9),
        orderId: '', // populated below
        animalId: item.animalId,
        animal: item.animal,
        quantity: item.quantity,
        pricePerUnit: item.animal.price,
        totalPrice: item.animal.price * item.quantity
      })),
      totalAmount,
      status: 'pending',
      paymentStatus: 'completed', // auto complete since they processed in localStorage / mock Paystack
      deliveryAddress,
      phoneNumber,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Update orderId on items
    newOrder.items.forEach(item => item.orderId = newOrder.id);

    orders.unshift(newOrder);
    setLocalStorage(ordersKey, orders);

    // Make purchased animals unavailable
    const animals = getLocalStorage<Animal[]>('farmmart_animals', DEFAULT_ANIMALS);
    newOrder.items.forEach(item => {
      const animal = animals.find(a => a.id === item.animalId);
      if (animal) {
        animal.available = false;
      }
    });
    setLocalStorage('farmmart_animals', animals);

    // Clear cart
    localStorageDb.clearCart(userEmail);

    return newOrder;
  },

  // --- Users ---
  getUsers: (): User[] => {
    return getLocalStorage<User[]>('farmmart_users', [
      {
        id: "seller-1",
        email: "amina@farmmart.com",
        name: "Amina Ibrahim",
        role: "seller",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "seller-2",
        email: "chidi@farmmart.com",
        name: "Chidi Okafor",
        role: "seller",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "seller-3",
        email: "lagospoultry@farmmart.com",
        name: "Lagos Poultry Farm",
        role: "seller",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "buyer-1",
        email: "buyer@example.com",
        name: "Test Buyer",
        role: "buyer",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "admin-1",
        email: "admin@farmmart.com",
        name: "Admin User",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  updateUserRole: (userId: string, newRole: User['role']): void => {
    const users = localStorageDb.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      users[userIndex].role = newRole;
      users[userIndex].updatedAt = new Date();
      setLocalStorage('farmmart_users', users);
    }
  },

  deleteUser: (userId: string): void => {
    const users = localStorageDb.getUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    setLocalStorage('farmmart_users', filteredUsers);
  },

  // --- Animal Management ---
  deleteAnimal: (animalId: string): void => {
    const animals = getLocalStorage<Animal[]>('farmmart_animals', DEFAULT_ANIMALS);
    const filteredAnimals = animals.filter(a => a.id !== animalId);
    setLocalStorage('farmmart_animals', filteredAnimals);
  },

  updateAnimalAvailability: (animalId: string, available: boolean): void => {
    const animals = getLocalStorage<Animal[]>('farmmart_animals', DEFAULT_ANIMALS);
    const animalIndex = animals.findIndex(a => a.id === animalId);
    if (animalIndex > -1) {
      animals[animalIndex].available = available;
      animals[animalIndex].updatedAt = new Date();
      setLocalStorage('farmmart_animals', animals);
    }
  },

  updateAnimal: (animalId: string, animalData: Partial<Omit<Animal, 'id' | 'createdAt' | 'updatedAt'>>): Animal | null => {
    const animals = getLocalStorage<Animal[]>('farmmart_animals', DEFAULT_ANIMALS);
    const animalIndex = animals.findIndex(a => a.id === animalId);
    if (animalIndex > -1) {
      animals[animalIndex] = {
        ...animals[animalIndex],
        ...animalData,
        updatedAt: new Date()
      };
      setLocalStorage('farmmart_animals', animals);
      return animals[animalIndex];
    }
    return null;
  },

  updateUser: (userId: string, userData: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): User | null => {
    const users = localStorageDb.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...userData,
        updatedAt: new Date()
      };
      setLocalStorage('farmmart_users', users);
      
      // Also check if this user email is logged in, and update the session in localStorage if needed
      const sessionStr = localStorage.getItem('farmmart_session');
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          if (session.user.id === userId) {
            session.user = {
              ...session.user,
              ...userData
            };
            localStorage.setItem('farmmart_session', JSON.stringify(session));
          }
        } catch (e) {
          console.error("Failed to parse session during user update", e);
        }
      }
      return users[userIndex];
    }
    return null;
  }
};
