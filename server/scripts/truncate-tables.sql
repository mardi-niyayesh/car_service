-- Delete all data in tables with TRUNCATE

SET SESSION_REPLICATION_ROLE = replica;

TRUNCATE TABLE
    users,
    refresh_tokens,
    password_tokens,
    roles,
    user_roles,
    permissions,
    role_permission,
    cars,
    car_rents,
    categories
    CASCADE;

SET SESSION_REPLICATION_ROLE = origin;