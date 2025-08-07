-- Create tables for Church Management System

-- Members table
CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT NOT NULL,
  baptism_status TEXT NOT NULL CHECK (baptism_status IN ('baptized', 'not-baptized', 'scheduled')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  join_date DATE NOT NULL,
  birth_date DATE NOT NULL,
  address TEXT NOT NULL,
  photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance table
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('sunday', 'wednesday', 'special', 'sunday-encounter', 'wednesday-miracle', 'friday-prayer')),
  present BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  total_count INTEGER,
  men_count INTEGER,
  women_count INTEGER,
  youth_count INTEGER,
  children_count INTEGER,
  guests_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL CHECK (category IN ('tithe', 'offering', 'project', 'special')),
  date DATE NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('cash', 'check', 'online', 'transfer', 'mobile-money')),
  notes TEXT,
  receipt_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visitors table
CREATE TABLE visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  visit_date DATE NOT NULL,
  invited_by TEXT,
  follow_up_status TEXT NOT NULL DEFAULT 'pending' CHECK (follow_up_status IN ('pending', 'contacted', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Equipment table
CREATE TABLE equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('excellent', 'good', 'fair', 'needs-repair')),
  purchase_date DATE NOT NULL,
  value DECIMAL(10,2) NOT NULL CHECK (value >= 0),
  location TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message templates table
CREATE TABLE message_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sms', 'email')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_members_department ON members(department);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_attendance_member_id ON attendance(member_id);
CREATE INDEX idx_attendance_service_date ON attendance(service_date);
CREATE INDEX idx_donations_member_id ON donations(member_id);
CREATE INDEX idx_donations_date ON donations(date);
CREATE INDEX idx_donations_category ON donations(category);
CREATE INDEX idx_visitors_visit_date ON visitors(visit_date);
CREATE INDEX idx_visitors_follow_up_status ON visitors(follow_up_status);
CREATE INDEX idx_equipment_category ON equipment(category);
CREATE INDEX idx_equipment_condition ON equipment(condition);

-- Enable Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can modify these based on your authentication needs)
CREATE POLICY "Allow public read access" ON members FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON members FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON members FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON attendance FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON attendance FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON attendance FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON donations FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON donations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON donations FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON visitors FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON visitors FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON visitors FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON equipment FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON equipment FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON equipment FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON equipment FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON message_templates FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON message_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON message_templates FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON message_templates FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 