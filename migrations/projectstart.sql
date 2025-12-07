CREATE table container (
    id BIGSERIAL PRIMARY KEY,
    length INTEGER, 
    breadth INTEGER,
    height INTEGER,
    volumetric_capacity INTEGER,
    sealegjourney_id BIGINT,
    unique_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'EMPTY',
    vendor_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    current_port_id BIGINT,
    current_zone_id BIGINT,
    current_grid TEXT
)

CREATE TABLE port (
    id bigserial primary key,
    name varchar unique not null,
    zones INTEGER DEFAULT 1,
    capacity INTEGER,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    country TEXT NOT NULL,
    current_ships_docked INTEGER
)
CREATE TABLE zone (
    id BIGSERIAL PRIMARY KEY,
    port_id BIGINT NOT NULL,
    name TEXT,
    grid_length_unit INTEGER NOT NULL,
    grid_height_unit INTEGER NOT NULL,
    grid_breadth_unit INTEGER NOT NULL
)

CREATE TABLE vendor (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    type TEXT DEFAULT 'shipping_lane',
    country TEXT
)

CREATE TABLE sealegjourney (
    id BIGSERIAL PRIMARY KEY,
    status TEXT DEFAULT 'created',
    is_completed BOOLEAN DEFAULT FALSE,
    origin_port_id BIGINT,
    destination_port_id BIGINT,
    current_port_id BIGINT,
    created_at TIMESTAMPTZ,
    last_updated_at TIMESTAMPTZ,
    last_latitude DOUBLE PRECISION,
    last_longitude DOUBLE PRECISION,
    completed_at TIMESTAMPTZ
);

CREATE TABLE sealegjouneyevents (
    id bigserial primary key,
    sealegjouney_id bigint,
    status text,
    current_port_id bigint,
    created_at TIMESTAMPTZ,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    notes TEXT,
    media_url_list TEXT
)

CREATE TABLE containerevents (
    id BIGSERIAL PRIMARY KEY,
    container_id BIGINT,
    status TEXT,
    created_at TIMESTAMPTZ,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    vendor_id BIGINT,
    port_id BIGINT,
    zone_id BIGINT,
    grid BIGINT
)


CREATE TABLE containerinspectionreport (
    id BIGSERIAL PRIMARY key,
    report_id TEXT UNIQUE NOT NULL,
    status TEXT,
    create_at TIMESTAMPTZ,
    last_updated_at TIMESTAMPTZ,
    current_assignee TEXT,
    raised_by TEXT,
    container_id BIGINT,
    media_url_list TEXT,
    cost_incurred INTEGER,
    cost_denomination text
)

CREATE TABLE containerinspectionreportevents (
    id bigserial primary key,
    report_id bigint,
    status text,
    comment text,
    comment_added_by text,
    created_at timestamptz,
    media_url TEXT
)