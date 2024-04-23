from selenium import webdriver
import requests
import os
from selenium.webdriver.common.by import By
import time
# Specify the path to the WebDriver executable (e.g., chromedriver)
driver = webdriver.Chrome()

driver.get('https://app.mindsmith.ai/learn/cluredzba00e1jy09nzpn6e88')
time.sleep(1)
html_content = driver.page_source
with open('page.html', 'w', encoding='utf-8') as f:
    f.write(html_content)
css_links = driver.find_elements(By.XPATH, '//link[@rel="stylesheet"]')
css_urls = [link.get_attribute('href') for link in css_links]

for url in css_urls:
    if 'fonts.googleapis.com' in url:
        continue
    if len(os.path.basename(url)) == 0:
        continue
    response = requests.get(url)
    filename = '_next/static/css/' + os.path.basename(url)
    print(url)
    print(filename)
    with open(filename, 'wb') as f:
        f.write(response.content)

js_links = driver.find_elements(By.XPATH, '//script[@src]')
js_urls = [link.get_attribute('src') for link in js_links]

for url in js_urls:
    if 'www.googletagmanager.com' in url:
        continue
    if 'js?' in url:
        continue
    if len(os.path.basename(url)) == 0:
        continue
    filename = '_next/static/chunks/' + os.path.basename(url)
    if 'pages/_' in url:
        filename = '_next/static/chunks/pages/' + os.path.basename(url)
    if 'pages/learn/' in url:
        filename = '_next/static/chunks/pages/learn/' + os.path.basename(url)
    response = requests.get(url)
    print(url)
    print(filename)
    with open(filename, 'wb') as f:
        f.write(response.content)

# img_elements = driver.find_elements(By.XPATH,'//img')
# img_urls = [img.get_attribute('src') for img in img_elements]

# for url in img_urls:
#     response = requests.get(url)
#     filename = os.path.basename(url)
#     with open(filename, 'wb') as f:
#         f.write(response.content)
driver.quit()