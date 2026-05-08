#!/usr/bin/env python3
"""
Применяет обновления к урокам в historyDates.ts на основе данных update_lessons_gen.py
Добавляет все недостающие cardIds по эпохам.
"""
import re

with open('src/data/historyDates.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Находим все карточки с id и era
cards_era = {}
for match in re.finditer(r"id:\s*'(c\d+)'[^}]*?era:\s*'([^']+)'", content):
    cards_era[match.group(1)] = match.group(2)

# Группируем по эпохам
era_cards = {}
for cid, era in cards_era.items():
    if era not in era_cards:
        era_cards[era] = []
    era_cards[era].append(cid)

# Сортируем карточки внутри каждой эпохи
for era in era_cards:
    era_cards[era].sort(key=lambda x: int(x[1:]))

# Строим карту: id урока -> [cardIds]
lesson_pattern = re.compile(r"(\{ id: '([^']+)'(.*?)cardIds:\s*\[)([^\]]+)(\].*?\})")
matches = list(lesson_pattern.finditer(content))

total_changes = 0
new_content_parts = []
last_end = 0

fixes_info = []

for m in matches:
    lesson_id = m.group(2)
    prefix = m.group(1)
    card_ids_str = m.group(4)
    suffix = m.group(5)
    
    context = m.group(3) + m.group(5)
    
    # Определяем эпоху урока
    era_match = re.search(r"era:\s*'([^']+)'", context)
    if not era_match:
        continue
    era = era_match.group(1)
    
    if era not in era_cards:
        continue
    
    # Парсим текущие cardIds
    current_ids = [x.strip().strip("'\"") for x in card_ids_str.split(',') if x.strip()]
    
    all_era = era_cards[era]
    
    # Добавляем недостающие карточки
    new_ids = []
    seen = set()
    for cid in current_ids + all_era:
        if cid not in seen:
            seen.add(cid)
            new_ids.append(cid)
    
    if len(new_ids) > len(current_ids):
        new_card_str = ', '.join(f"'{x}'" for x in new_ids)
        replacement = f"{prefix}{new_card_str}{suffix}"
        
        # Добавляем часть до этого урока
        new_content_parts.append(content[last_end:m.start()])
        new_content_parts.append(replacement)
        last_end = m.end()
        total_changes += 1
        fixes_info.append((lesson_id, era, len(current_ids), len(new_ids)))

# Добавляем оставшуюся часть
new_content_parts.append(content[last_end:])

if total_changes > 0:
    new_content = ''.join(new_content_parts)
    
    # Создаём бэкап
    import shutil
    shutil.copy2('src/data/historyDates.ts', 'src/data/historyDates.ts.bak')
    print(f"Создан бэкап: src/data/historyDates.ts.bak")
    
    with open('src/data/historyDates.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Обновлено {total_changes} уроков:")
    for lid, era, old_count, new_count in fixes_info:
        print(f"  {lid} ({era}): {old_count} -> {new_count} карточек")
else:
    print("Изменений не требуется")

# Проверка
print("\n=== ПРОВЕРКА ===")
with open('src/data/historyDates.ts', 'r', encoding='utf-8') as f:
    verif = f.read()

# Считаем все уроки
lessons_found = list(lesson_pattern.finditer(verif))
all_ok = True
for m in lessons_found:
    lesson_id = m.group(2)
    context = m.group(3) + m.group(5)
    era_match = re.search(r"era:\s*'([^']+)'", context)
    if not era_match:
        continue
    era = era_match.group(1)
    card_ids_str = m.group(4)
    current_ids = [x.strip().strip("'\"") for x in card_ids_str.split(',') if x.strip()]
    
    if era in era_cards:
        missing = [c for c in era_cards[era] if c not in current_ids]
        if missing:
            print(f"ОШИБКА: Урок {lesson_id} ({era}) не содержит: {', '.join(missing)}")
            all_ok = False

if all_ok:
    print("Все уроки содержат все карточки своих эпох!")
    
    # Считаем общее количество карточек
    card_count = len([m for m in re.finditer(r"id:\s*'c\d+'", verif)])
    lesson_count = len(lessons_found)
    print(f"Всего карточек: {card_count}, уроков: {lesson_count}")