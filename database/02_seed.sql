USE farmmart;
INSERT INTO users (id, firebase_uid, name, email, phone, role, state, city, is_verified) VALUES
  ('u-001', 'firebase-uid-001', 'Chukwuemeka Obi', 'emeka@farmmart.ng', '08012345678', 'SELLER', 'Ogun', 'Abeokuta', 1),
  ('u-002', 'firebase-uid-002', 'Aisha Bello', 'aisha@farmmart.ng', '08023456789', 'SELLER', 'Kano', 'Kano', 1),
  ('u-003', 'firebase-uid-003', 'Tunde Adeyemi', 'tunde@farmmart.ng', '08034567890', 'BUYER', 'Lagos', 'Ikeja', 1),
  ('u-004', 'firebase-uid-004', 'Ngozi Eze', 'ngozi@farmmart.ng', '08045678901', 'BUYER', 'Enugu', 'Enugu', 0),
  ('u-005', 'firebase-uid-005', 'Musa Ibrahim', 'musa@farmmart.ng', '08056789012', 'SELLER', 'Kaduna', 'Kaduna', 1),
  ('u-006', 'firebase-uid-006', 'Privilege Oyegbile', 'admin@farmmart.ng', '08067890123', 'ADMIN', 'Oyo', 'Ogbomoso', 1);
INSERT INTO animals (id, name, category, breed, age, weight, price, description, images, status, location, state, is_negotiable, seller_id) VALUES
  ('a-001', 'Healthy Fresian Bull', 'CATTLE', 'Fresian', 36, 450.00, 250000.00, 'A strong and healthy Fresian bull, well-fed and vaccinated. Good for dairy farming.', JSON_ARRAY('https://res.cloudinary.com/demo/image/upload/fresian_bull.jpg'), 'AVAILABLE', 'Abeokuta', 'Ogun', 1, 'u-001'),
  ('a-002', 'Boer Goats (Pair)', 'GOAT', 'Boer', 18, 35.00, 85000.00, 'A pair of mature Boer goats. Male and female. Great for breeding.', JSON_ARRAY('https://res.cloudinary.com/demo/image/upload/boer_goat.jpg'), 'AVAILABLE', 'Kano', 'Kano', 1, 'u-002'),
  ('a-003', 'Large White Pigs (x3)', 'PIG', 'Large White', 8, 80.00, 120000.00, 'Three Large White pigs ready for market. Healthy, well-fed on quality feed.', JSON_ARRAY('https://res.cloudinary.com/demo/image/upload/large_white_pig.jpg'), 'AVAILABLE', 'Kaduna', 'Kaduna', 0, 'u-005'),
  ('a-004', 'Broiler Chickens (50 birds)', 'POULTRY', 'Broiler', 2, 2.50, 45000.00, '50 matured broiler chickens, 6 weeks old, average weight 2.5kg each.', JSON_ARRAY('https://res.cloudinary.com/demo/image/upload/broiler.jpg'), 'AVAILABLE', 'Abeokuta', 'Ogun', 1, 'u-001'),
  ('a-005', 'Yankasa Ram', 'SHEEP', 'Yankasa', 24, 45.00, 65000.00, 'A well-built Yankasa ram, perfect for Sallah or breeding purposes.', JSON_ARRAY('https://res.cloudinary.com/demo/image/upload/yankasa_ram.jpg'), 'AVAILABLE', 'Kano', 'Kano', 1, 'u-002'),
  ('a-006', 'Rabbit Pair (Buck & Doe)', 'RABBIT', 'New Zealand White', 6, 3.00, 12000.00, 'Healthy New Zealand White rabbits. Buck and doe pair, ready for breeding.', JSON_ARRAY('https://res.cloudinary.com/demo/image/upload/rabbit.jpg'), 'AVAILABLE', 'Kaduna', 'Kaduna', 0, 'u-005');
INSERT INTO cart (id, user_id, animal_id, quantity) VALUES
  ('c-001', 'u-003', 'a-001', 1),
  ('c-002', 'u-003', 'a-004', 1),
  ('c-003', 'u-004', 'a-002', 1);
INSERT INTO orders (id, buyer_id, animal_id, amount, status, paystack_ref, paystack_channel, delivery_address, delivery_state, delivery_city, paid_at) VALUES
  ('o-001', 'u-003', 'a-006', 12000.00, 'PAID', 'PSK_REF_20240101_001', 'card', '14 Awolowo Street, Ikeja', 'Lagos', 'Ikeja', '2024-01-15 10:30:00'),
  ('o-002', 'u-004', 'a-005', 65000.00, 'PENDING', 'PSK_REF_20240201_002', NULL, '7 Independence Layout, Enugu', 'Enugu', 'Enugu', NULL);
INSERT INTO inquiries (id, sender_id, receiver_id, animal_id, message, status) VALUES
  ('i-001', 'u-003', 'u-001', 'a-001', 'Good day, is this bull still available? Can I come for inspection this weekend?', 'READ'),
  ('i-002', 'u-004', 'u-002', 'a-002', 'Hello, are the goats vaccinated? What is the last price?', 'UNREAD');
INSERT INTO reviews (id, user_id, animal_id, rating, comment) VALUES
  ('r-001', 'u-003', 'a-006', 5, 'Excellent rabbits! Very healthy and as described. Fast delivery too.');
