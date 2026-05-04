import fitz
import os

pdf_path = r'C:\Users\72519\OneDrive\Рабочий стол\VSE_KARTY_EGE_po_istorii.pdf'
out_dir = r'C:\Users\72519\OneDrive\Рабочий стол\егэ история даты\public\maps'
os.makedirs(out_dir, exist_ok=True)

doc = fitz.open(pdf_path)
total = doc.page_count
print(f'Всего страниц: {total}')

for i in range(total):
    page_num = i + 1
    page = doc[i]
    pix = page.get_pixmap(dpi=200)
    filename = f'map_{page_num:03d}.png'
    filepath = os.path.join(out_dir, filename)
    pix.save(filepath)
    print(f'OK {page_num:2d}/{total} -> {filename} ({pix.width}x{pix.height})')

doc.close()
print('Готово!')