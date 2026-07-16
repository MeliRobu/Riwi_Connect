    --ADMINISTRATORS/MANAGERS:
INSERT INTO institutional_sources (document_number, full_name, email, id_campus, id_journey, id_clan)
VALUES
    (900000001,'Riwi Connect Administrator Barranquilla','admin.baq@riwi.io',1,4, null),
    (900000002,'Riwi Connect Administrator Medellin','admin.med@riwi.io',2,4,  null);


-- ADMINISTRATOR - BARRANQUILLA
-- Initial password: admin123 (pre-hashed manually with werkzeug, see DO-003 pendiente)
INSERT INTO users (password_hash, id_institutional_source, status, role)
SELECT
    'scrypt:32768:8:1$xpcx80vAcmiolKsC$4bf53ce9b5f8d74d3d991b66641bfee2998c260993661271a78459442e39d5c6f043584e4bbc8eac9016d347f751a3aa93dbc4d414738fb41b4729961f4492ac',
    id_institutional_source,
    'AVAILABLE',
    'ADMINISTRATOR'
FROM institutional_sources
WHERE email = 'admin.baq@riwi.io';

-- ADMINISTRATOR - MEDELLIN , ANOTHER WAY TO DO IT

INSERT INTO users
(password_hash, id_institutional_source, status, role)
VALUES
(
    'scrypt:32768:8:1$xpcx80vAcmiolKsC$4bf53ce9b5f8d74d3d991b66641bfee2998c260993661271a78459442e39d5c6f043584e4bbc8eac9016d347f751a3aa93dbc4d414738fb41b4729961f4492ac',
    (
        SELECT id_institutional_source
        FROM institutional_sources
        WHERE email = 'admin.med@riwi.io'
    ),
    'AVAILABLE',
    'ADMINISTRATOR'
);