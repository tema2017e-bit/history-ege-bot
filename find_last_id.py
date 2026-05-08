import re
content = open('src/data/historyDates.ts', 'r', encoding='utf-8').read()
ids = re.findall(r"id: 'c(\d+)'", content)
max_id = max(int(i) for i in ids)
print('Last card ID: c' + str(max_id))
# Also find the last card entry
# Look for the last occurrence of a card definition
matches = list(re.finditer(r"\{ id: 'c\d+', year: '(.+?)', event: '(.+?)'", content))
if matches:
    last = matches[-1]
    print(f"Last card: {{ id: 'c{max_id}', year: '{last.group(1)}', event: '{last.group(2)}' }}")

lines = content.split('\n')
print(f"Total lines: {len(lines)}")
# Find line number of last card
for i, line in enumerate(lines):
    if f"id: 'c{max_id}'" in line:
        print(f"Last card at line: {i+1}")
        # Print lines around the end of cards section
        end_idx = min(i + 20, len(lines))
        print("Tail lines:")
        for j in range(i-1, min(i+5, len(lines))):
            if j >= 0:
                print(f"  {j+1}: {lines[j]}")