-- Council Database Initialization Script
-- Run this script to set up the database schema

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    session_cookie TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS topics (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_by TEXT NOT NULL,
    participant_count INTEGER DEFAULT 0,
    round_count INTEGER DEFAULT 0,
    current_round INTEGER DEFAULT 0,
    max_rounds INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rounds (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL REFERENCES topics(id),
    round_number INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    comment_count INTEGER DEFAULT 0,
    max_comments INTEGER DEFAULT 10,
    start_time TIMESTAMP DEFAULT NOW(),
    end_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    topic_id TEXT NOT NULL REFERENCES topics(id),
    round_id TEXT NOT NULL REFERENCES rounds(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    position_type TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    parent_id TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS summaries (
    id TEXT PRIMARY KEY,
    round_id TEXT NOT NULL REFERENCES rounds(id),
    content TEXT NOT NULL,
    consensus JSONB,
    disagreements JSONB,
    new_questions JSONB,
    referenced_comments JSONB,
    sentiment_score INTEGER,
    clarity_score INTEGER,
    model_version TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_topics_status ON topics(status);
CREATE INDEX IF NOT EXISTS idx_topics_created_at ON topics(created_at);
CREATE INDEX IF NOT EXISTS idx_rounds_topic_id ON rounds(topic_id);
CREATE INDEX IF NOT EXISTS idx_rounds_status ON rounds(status);
CREATE INDEX IF NOT EXISTS idx_comments_topic_id ON comments(topic_id);
CREATE INDEX IF NOT EXISTS idx_comments_round_id ON comments(round_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_summaries_round_id ON summaries(round_id);

-- Insert sample data for testing
INSERT INTO users (id, username, session_cookie) VALUES 
('user_1', 'tech_enthusiast', 'session_1'),
('user_2', 'creative_mind', 'session_2'),
('user_3', 'urban_planner', 'session_3')
ON CONFLICT (id) DO NOTHING;

INSERT INTO topics (id, title, description, created_by, participant_count, round_count, current_round) VALUES 
('topic_1', '猫的光学构造', '探讨猫娘搭载型摄影系统的技术迭代路径', 'tech_enthusiast', 3, 2, 2),
('topic_2', 'AI与创意产业的未来', '探讨人工智能技术对创意产业的影响', 'creative_mind', 2, 1, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO rounds (id, topic_id, round_number, status, comment_count) VALUES 
('round_1_1', 'topic_1', 1, 'completed', 5),
('round_1_2', 'topic_1', 2, 'active', 3),
('round_2_1', 'topic_2', 1, 'active', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO comments (id, topic_id, round_id, user_id, content, position_type) VALUES 
('comment_1', 'topic_1', 'round_1_1', 'user_1', '我认为技术可行性很高', 'support'),
('comment_2', 'topic_1', 'round_1_1', 'user_2', '需要更多伦理考量', 'oppose'),
('comment_3', 'topic_1', 'round_1_2', 'user_1', '我们可以分阶段实施', 'support')
ON CONFLICT (id) DO NOTHING;