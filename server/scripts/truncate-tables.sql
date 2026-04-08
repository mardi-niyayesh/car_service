-- Delete all data in tables with TRUNCATE

SET SESSION_REPLICATION_ROLE = replica;

TRUNCATE TABLE
    users,
    refresh_tokens,
    password_tokens,
    roles,
    permissions,
    role_permission,
    user_roles,
    cars,
    categories
    CASCADE;

SET SESSION_REPLICATION_ROLE = origin;