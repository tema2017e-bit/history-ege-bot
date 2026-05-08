#!/usr/bin/env python3
"""
Генерирует обновлённые уроки, добавляя все недостающие cardIds по эпохам.
Выводит replace_in_file команды.
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
# Ищем все уроки
lesson_pattern = re.compile(r'\{ id: \'([^\']+)\'(.*?)cardIds:\s*\[([^\]]+)\](.*?)\},')
lesson_matches = list(lesson_pattern.finditer(content))

fixes = []

for m in lesson_matches:
    lesson_id = m.group(1)
    prefix = m.group(2)
    card_ids_str = m.group(3)
    suffix = m.group(4)
    
    # Парсим текущие cardIds
    current_ids = [x.strip().strip("'\"") for x in card_ids_str.split(',') if x.strip()]
    
    # Определяем эпоху урока
    era_match = re.search(r"era:\s*'([^']+)'", prefix + suffix)
    if not era_match:
        continue
    era = era_match.group(1)
    
    if era not in era_cards:
        continue
    
    all_era = era_cards[era]
    
    # Добавляем недостающие карточки
    new_ids = []
    seen = set()
    for cid in current_ids + all_era:
        if cid not in seen:
            seen.add(cid)
            new_ids.append(cid)
    
    if len(new_ids) > len(current_ids):
        fixes.append((lesson_id, era, current_ids, new_ids))
        print(f"// Урок {lesson_id} (era={era}): {len(current_ids)} -> {len(new_ids)}")
        print(f"// Добавить: {', '.join(c for c in new_ids if c not in current_ids)}")

print("\n\n===== REPLACE БЛОКИ =====")
print("Эти блоки нужно применить для обновления уроков.")
print("Каждый блок заменяет cardIds в конкретном уроке.\n")

for lesson_id, era, old_ids, new_ids in fixes:
    old_str = ', '.join(f"'{x}'" for x in old_ids)
    new_str = ', '.join(f"'{x}'" for x in new_ids)
    
    # Находим точную строку в файле
    for m in lesson_pattern.finditer(content):
        if m.group(1) == lesson_id:
            start = m.start()
            end = m.end()
            # Ищем строку с cardIds
            card_line_match = re.search(r"cardIds:\s*\[([^\]]+)\]", content[start:end])
            if card_line_match:
                old_line = card_line_match.group(0)
                new_line = f"cardIds: [{new_str}]"
                print(f"------- SEARCH")
                print(old_line)
                print("=======")
                print(new_line)
                print(f"+++++++ REPLACE")
                print()
            break

# Также выводим полные обновлённые уроки для boss-уроков
print("\n\n===== ОБНОВЛЁННЫЕ BOSS-УРОКИ (полные cardIds) =====")
for lesson_id, era, old_ids, new_ids in fixes:
    if lesson_id.endswith('b'):
        print(f"Урок {lesson_id}: {', '.join(new_ids)}")