USE farmmart;
SELECT (SELECT COUNT(*) FROM users WHERE role = 'BUYER') AS total_buyers, (SELECT COUNT(*) FROM users WHERE role = 'SELLER') AS total_sellers, (SELECT COUNT(*) FROM animals WHERE status = 'AVAILABLE') AS total_listings, (SELECT COUNT(*) FROM animals WHERE status = 'SOLD') AS total_sold, (SELECT COUNT(*) FROM orders WHERE status = 'PAID') AS total_orders, (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE status = 'PAID') AS total_revenue, (SELECT COUNT(*) FROM inquiries WHERE status = 'UNREAD') AS unread_inquiries;
SELECT DATE(created_at) AS day, COUNT(*) AS new_users FROM users WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY day ASC;
SELECT a.category, COUNT(o.id) AS total_orders, SUM(o.amount) AS revenue FROM orders o JOIN animals a ON a.id = o.animal_id WHERE o.status = 'PAID' GROUP BY a.category ORDER BY revenue DESC;
SELECT u.id, u.name, u.email, u.state, COUNT(o.id) AS total_orders, SUM(o.amount) AS revenue FROM orders o JOIN animals a ON a.id = o.animal_id JOIN users u ON u.id = a.seller_id WHERE o.status = 'PAID' GROUP BY u.id ORDER BY revenue DESC LIMIT 10;
SELECT state, COUNT(*) AS listing_count FROM animals WHERE status = 'AVAILABLE' AND state IS NOT NULL GROUP BY state ORDER BY listing_count DESC LIMIT 10;
CREATE OR REPLACE VIEW vw_active_listings AS
SELECT a.id, a.name, a.category, a.breed, a.price, a.images, a.status, a.state, a.view_count, a.created_at, u.id AS seller_id, u.name AS seller_name, u.is_verified AS seller_verified, ROUND(AVG(r.rating), 1) AS avg_rating, COUNT(r.id) AS review_count
FROM animals a JOIN users u ON u.id = a.seller_id LEFT JOIN reviews r ON r.animal_id = a.id WHERE a.status = 'AVAILABLE' GROUP BY a.id;
CREATE OR REPLACE VIEW vw_paid_orders AS
SELECT o.id AS order_id, o.amount, o.paystack_ref, o.paid_at, a.name AS animal_name, a.category, buyer.name AS buyer_name, buyer.email AS buyer_email, seller.name AS seller_name, seller.email AS seller_email, o.delivery_state, o.delivery_city
FROM orders o JOIN animals a ON a.id = o.animal_id JOIN users buyer ON buyer.id = o.buyer_id JOIN users seller ON seller.id = a.seller_id WHERE o.status = 'PAID';
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS sp_confirm_payment(IN p_paystack_ref VARCHAR(200), IN p_paystack_channel VARCHAR(50))
BEGIN
  DECLARE v_animal_id VARCHAR(36);
  DECLARE v_order_id VARCHAR(36);
  SELECT id, animal_id INTO v_order_id, v_animal_id FROM orders WHERE paystack_ref = p_paystack_ref AND status = 'PENDING' LIMIT 1;
  IF v_order_id IS NOT NULL THEN
    UPDATE orders SET status = 'PAID', paystack_channel = p_paystack_channel, paid_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = v_order_id;
    UPDATE animals SET status = 'SOLD', updated_at = CURRENT_TIMESTAMP WHERE id = v_animal_id;
    SELECT 'SUCCESS' AS result, v_order_id AS order_id;
  ELSE
    SELECT 'NOT_FOUND' AS result, NULL AS order_id;
  END IF;
END$$
CREATE PROCEDURE IF NOT EXISTS sp_cancel_order(IN p_order_id VARCHAR(36))
BEGIN
  DECLARE v_animal_id VARCHAR(36);
  SELECT animal_id INTO v_animal_id FROM orders WHERE id = p_order_id AND status = 'PENDING' LIMIT 1;
  IF v_animal_id IS NOT NULL THEN
    UPDATE orders SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP WHERE id = p_order_id;
    UPDATE animals SET status = 'AVAILABLE', updated_at = CURRENT_TIMESTAMP WHERE id = v_animal_id;
    SELECT 'SUCCESS' AS result;
  ELSE
    SELECT 'NOT_FOUND_OR_ALREADY_PAID' AS result;
  END IF;
END$$
DELIMITER ;
DELETE FROM orders WHERE status = 'CANCELLED' AND updated_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
SELECT id, name, seller_id FROM animals WHERE JSON_LENGTH(images) = 0 OR images = '[]';
