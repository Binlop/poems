import re

def change_google_url(url):
    example_url = 'https://drive.google.com/file/d/1U2rZSd6Kl8P3KkdFPw6FDHSIxatspl5h/view?usp=sharing'
    id = url.split('d/')[1].split('/')[0]
    print(f'https://drive.google.com/uc?export=download&id={id}')

if __name__ == "__main__":
    url = input('Введите url: ')
    change_google_url(url)
