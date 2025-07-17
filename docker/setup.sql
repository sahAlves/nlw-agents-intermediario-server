-- Esse comando SQL verifica se a extensão chamada vector já está instalada no banco de dados PostgreSQL. Se não estiver, ele instala essa extensão.
-- Extensões adicionam funcionalidades extras ao PostgreSQL; no caso da vector, ela permite trabalhar com tipos de dados vetoriais, úteis para aplicações de IA, busca semântica e machine learning.
CREATE EXTENSION IF NOT EXISTS vector;