import re
from bs4 import BeautifulSoup
import json

def change_google_url(url):
    example_url = 'https://drive.google.com/file/d/1U2rZSd6Kl8P3KkdFPw6FDHSIxatspl5h/view?usp=sharing'
    id = url.split('d/')[1].split('/')[0]
    print(f'https://drive.google.com/uc?export=download&id={id}')

def get_poems_text():
    with open("Старообрядческие духовные стихи_ сборник - Алтайский старообрядец.html") as fp:
        soup = BeautifulSoup(fp, 'html.parser')

    # with open('poems_texts.txt', 'w') as f:
    poems_data = []
    for block in soup.find_all('div', class_='duh-stihi'):  
        poem_divs = block.find_all('div', id=lambda x: x and x.startswith('s'))

        for div in poem_divs:
            title_tag = div.find('h3')
            title = title_tag.get_text(strip=True)
            poem_text = []
            current = div.next_sibling
            while current and current.name != 'div':
                if current.name == 'p':
                    # Получение текста параграфа, замена <br> на \n
                    lines = [line.strip() for line in current.get_text(separator='\n').split('\n') if line.strip()]
                    poem_text.append('\n'.join(lines))
                current = current.next_sibling
            
            # Объединение текста с двойным переносом между строфами
            full_text = '\n\n'.join(poem_text) if poem_text else ''
            
            # Получение первой строки текста для subtitle
            subtitle = full_text.split('\n')[0] if full_text else ''
            
            # Формирование JSON-объекта
            poem_entry = {
                'title': title,
                'subtitle': subtitle,
                'text': full_text,
                'executor': None,
                'audio': None
            }
            poems_data.append(poem_entry)

    # Сохранение результата в JSON-файл
    with open('poems_data.json', 'w', encoding='utf-8') as f:
        json.dump(poems_data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    url = input('Введите url: ')
    change_google_url(url)
    # get_poems_text()
