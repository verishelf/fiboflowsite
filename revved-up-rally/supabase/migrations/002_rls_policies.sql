-- Row Level Security policies

ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rallies ENABLE ROW LEVEL SECURITY;
ALTER TABLE rally_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: get member id for current user
CREATE OR REPLACE FUNCTION get_member_id()
RETURNS UUID AS $$
  SELECT id FROM members WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Public read policies
CREATE POLICY "Public read membership plans" ON membership_plans FOR SELECT USING (true);
CREATE POLICY "Public read published rallies" ON rallies FOR SELECT USING (published = true);
CREATE POLICY "Public read destinations" ON destinations FOR SELECT USING (true);
CREATE POLICY "Public read sponsors" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Public read partners" ON partners FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);

-- Users: own profile
CREATE POLICY "Users read own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Applications: anyone can insert (rate limited at API), users can read own by email
CREATE POLICY "Anyone can submit application" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read own applications" ON applications FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR is_admin());

-- Members: own record
CREATE POLICY "Members read own record" ON members FOR SELECT USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "Members update own record" ON members FOR UPDATE USING (user_id = auth.uid() OR is_admin());

-- Vehicles: member owns
CREATE POLICY "Members manage own vehicles" ON vehicles FOR ALL
  USING (member_id = get_member_id() OR is_admin())
  WITH CHECK (member_id = get_member_id() OR is_admin());

-- Rally registrations
CREATE POLICY "Members manage own registrations" ON rally_registrations FOR ALL
  USING (member_id = get_member_id() OR is_admin())
  WITH CHECK (member_id = get_member_id() OR is_admin());

-- Messages
CREATE POLICY "Members read own messages" ON messages FOR SELECT
  USING (member_id = get_member_id() OR is_admin());
CREATE POLICY "Members insert messages" ON messages FOR INSERT
  WITH CHECK (member_id = get_member_id() AND is_from_admin = false);

-- Subscriptions & payments: member read own
CREATE POLICY "Members read own subscriptions" ON subscriptions FOR SELECT
  USING (member_id = get_member_id() OR is_admin());
CREATE POLICY "Members read own payments" ON payments FOR SELECT
  USING (member_id = get_member_id() OR is_admin());

-- Public form submissions
CREATE POLICY "Anyone can submit contact" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit sponsor application" ON sponsor_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can subscribe newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Admin users: only admins can read
CREATE POLICY "Admins read admin_users" ON admin_users FOR SELECT USING (is_admin());

-- Storage bucket for vehicle photos (run in Supabase dashboard or separate migration)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-photos', 'vehicle-photos', true);
