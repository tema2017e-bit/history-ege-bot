import re

with open('src/data/historyDates.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Ищем все карточки: { id: 'cN', year: '...', event: '...', ... }
pattern = r"\{ id: '([^']+)', year: '([^']+)', event: '([^']+)'"
matches = re.findall(pattern, content)

print("=== КАРТОЧКИ С НЕСТАНДАРТНЫМИ ГОДАМИ ===\n")

problematic = []
for cid, year, event in matches:
    # Проверяем, что year содержит что-то кроме цифр, пробелов, дефисов и точек
    cleaned = year.replace('–', '-').replace('—', '-').replace(' ', '').replace('.', '').replace('-', '')
    if not cleaned.isdigit():
        print(f"{cid}: year='{year}' | event='{event}'")
        problematic.append((cid, year, event))

print(f"\n=== ВСЕГО НЕСТАНДАРТНЫХ: {len(problematic)} ===\n")

# Проверяем каждую на extractYear из dateMemoryEngine
print("=== АНАЛИЗ extractYear ===\n")
for cid, year_str, event in problematic:
    cleaned = year_str.strip()
    cleaned = re.sub(r'^[IVXLCDM]+\s*–\s*', '', cleaned)
    m = re.search(r'(\d{3,4})', cleaned)
    if m:
        print(f"{cid}: year='{year_str}' -> extractYear={m.group(1)} ✓")
    else:
        print(f"{cid}: year='{year_str}' -> extractYear=null ✗ НЕЛЬЗЯ СОЗДАТЬ INPUT-YEAR ВОПРОС")