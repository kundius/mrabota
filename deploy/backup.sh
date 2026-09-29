#!/usr/bin/env bash
set -euo pipefail

# Резервная копия SQLite через встроенный механизм .backup (безопасно на живой БД).
# Cron: 0 3 * * * /var/www/mrabota/deploy/backup.sh >> /var/log/mrabota-backup.log 2>&1

DB_PATH="${DB_PATH:-/var/lib/mrabota/mrabota.db}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/mrabota}"
KEEP_DAYS="${KEEP_DAYS:-14}"

mkdir -p "$BACKUP_DIR"
STAMP="$(date +%Y-%m-%d_%H-%M-%S)"
OUT="$BACKUP_DIR/mrabota-$STAMP.db"

sqlite3 "$DB_PATH" ".backup '$OUT'"
echo "backup created: $OUT"

find "$BACKUP_DIR" -name 'mrabota-*.db' -type f -mtime "+$KEEP_DAYS" -delete
