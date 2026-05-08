#!/usr/bin/env python3
"""
Скрипт для обновления уроков в historyDates.ts
Добавляет новые cardIds (c278-c492) в соответствующие уроки по эпохам.
"""
import re

with open('src/data/historyDates.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Находим все карточки с их эпохами
cards = {}
for match in re.finditer(r"id:\s*'([^']+)'[^}]*year:\s*'([^']+)'[^}]*event:\s*'([^']+)'[^}]*era:\s*'([^']+)'", content):
    cards[match.group(1)] = {
        'year': match.group(2),
        'event': match.group(3).strip(),
        'era': match.group(4)
    }

# Группируем карточки по эпохам
era_cards = {}
for cid, info in cards.items():
    era = info['era']
    if era not in era_cards:
        era_cards[era] = []
    era_cards[era].append(cid)

print("Карточки по эпохам:")
for era, cids in sorted(era_cards.items()):
    print(f"  {era}: {len(cids)} карточек: {', '.join(cids)}")

# Находим существующие уроки
lesson_pattern = r"\{ id: '([^']+)'[^}]*title: '([^']+)'[^}]*era: '([^']+)'[^}]*eraIndex: (\d+)[^}]*description: '([^']+)'[^}]*cardIds: \[([^\]]+)\][^}]*type: '([^']+)'"
lessons = []
for match in re.finditer(lesson_pattern, content):
    lesson = {
        'id': match.group(1),
        'title': match.group(2),
        'era': match.group(3),
        'eraIndex': int(match.group(4)),
        'description': match.group(5),
        'cardIds': [x.strip().strip("'") for x in match.group(6).split(',')],
        'type': match.group(7)
    }
    # Check for unlockRequirement and xpReward
    rest = content[match.end():match.end()+200]
    ur_match = re.search(r"unlockRequirement:\s*'([^']+)'", rest)
    if ur_match:
        lesson['unlockRequirement'] = ur_match.group(1)
    xp_match = re.search(r"xpReward:\s*(\d+)", rest)
    if xp_match:
        lesson['xpReward'] = int(xp_match.group(1))
    lessons.append(lesson)

print(f"\nВсего уроков: {len(lessons)}")
print()

# Для каждой эпохи смотрим, какие карточки есть, но не включены в уроки
for era in sorted(era_cards.keys()):
    era_lesson_ids = set()
    for l in lessons:
        if l['era'] == era:
            era_lesson_ids.update(l['cardIds'])
    
    all_era_cards = set(era_cards[era])
    missing = all_era_cards - era_lesson_ids
    
    if missing:
        print(f"Эпоха {era}: не хватает {len(missing)} карточек в уроках: {', '.join(sorted(missing, key=lambda x: int(x[1:])))}")
    else:
        print(f"Эпоха {era}: все карточки ({len(all_era_cards)}) уже в уроках")

print()
print("=" * 60)
print("РЕКОМЕНДАЦИИ ПО ОБНОВЛЕНИЮ УРОКОВ:")
print("=" * 60)

# Для каждой эпохи предлагаем обновлённые cardIds
for era in sorted(era_cards.keys()):
    era_lessons = [l for l in lessons if l['era'] == era]
    if not era_lessons:
        continue
    
    all_era_cards_list = sorted(era_cards[era], key=lambda x: int(x[1:]))
    
    print(f"\n--- {era} ---")
    print(f"Все карточки эпохи: {', '.join(all_era_cards_list)}")
    
    for l in era_lessons:
        current = l['cardIds']
        # Добавляем недостающие карточки этой эпохи
        new_ids = list(dict.fromkeys(current + [c for c in all_era_cards_list if c not in current]))
        print(f"  Урок {l['id']} ({l['title']}): {len(current)} -> {len(new_ids)} карточек")
        if len(new_ids) > len(current):
            print(f"    Добавить: {', '.join(c for c in new_ids if c not in current)}")