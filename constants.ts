import { Sweet, UserRole } from './types';

export const CATEGORIES = ['Chocolates', 'Gummies', 'Hard Candies', 'Baked Goods', 'Sugar Free'];

export const INITIAL_SWEETS: Sweet[] = [
  {
    id: '1',
    name: 'Rainbow Gummy Bears',
    category: 'Gummies',
    price: 399,
    quantity: 50,
    description: 'Classic chewy gummy bears in a variety of fruit flavors.',
    imageUrl: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: 'Dark Chocolate Truffles',
    category: 'Chocolates',
    price: 999,
    quantity: 20,
    description: 'Rich dark chocolate truffles dusted with cocoa powder.',
    imageUrl: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    name: 'Sour Worms',
    category: 'Gummies',
    price: 299,
    quantity: 100,
    description: 'Tangy and sweet sour worms that pack a punch.',
    imageUrl: 'https://images.unsplash.com/photo-1499195333224-3ce974eecb47?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    name: 'Peppermint Swirls',
    category: 'Hard Candies',
    price: 199,
    quantity: 150,
    description: 'Refreshing peppermint hard candies, perfect for after dinner.',
    imageUrl: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    name: 'Salted Caramel Fudge',
    category: 'Baked Goods',
    price: 699,
    quantity: 10,
    description: 'Handmade fudge with a perfect balance of sweet and salty.',
    imageUrl: 'https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '6',
    name: 'Sugar-Free Lollipops',
    category: 'Sugar Free',
    price: 449,
    quantity: 45,
    description: 'Delicious fruit flavored lollipops without the guilt.',
    imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '7',
    name: 'Artisan Sourdough Loaf',
    category: 'Baked Goods',
    price: 249,
    quantity: 15,
    description: 'Freshly baked sourdough bread with a crispy crust and soft interior.',
    imageUrl: 'https://images.unsplash.com/photo-1585478479383-c59ce877c8e0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '8',
    name: 'Decadent Chocolate Cake',
    category: 'Baked Goods',
    price: 899,
    quantity: 8,
    description: 'Rich, moist chocolate cake layered with creamy chocolate ganache.',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '9',
    name: 'Butter Croissants (Pack of 4)',
    category: 'Baked Goods',
    price: 349,
    quantity: 12,
    description: 'Flaky, golden-brown croissants made with real French butter.',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '10',
    name: 'Blueberry Muffins',
    category: 'Baked Goods',
    price: 149,
    quantity: 20,
    description: 'Soft muffins bursting with fresh blueberries and topped with sugar crumble.',
    imageUrl: 'https://images.unsplash.com/photo-1563729768239-509f7a77b8b2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '11',
    name: 'Glazed Cinnamon Rolls',
    category: 'Baked Goods',
    price: 199,
    quantity: 18,
    description: 'Warm, gooey cinnamon rolls topped with sweet vanilla glaze.',
    imageUrl: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80'
  }
];

export const MOCK_ADMIN_USER = {
  id: 'admin-123',
  username: 'admin',
  password: 'password', // In a real app, this wouldn't be here
  role: UserRole.ADMIN
};

export const MOCK_CUSTOMER_USER = {
  id: 'cust-456',
  username: 'customer',
  password: 'password',
  role: UserRole.CUSTOMER
};