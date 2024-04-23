import os
import requests
import random
import time

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import os
def download_resource(url, folder_path, filename):
    # Create a folder to store the downloaded resources
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    # Extract the filename from the URL
    # filename = url.split("/")[-1]

    # Download the resource
    try:
        response = requests.get(url)
        file_path = os.path.join(folder_path, filename)
        with open(file_path, "wb") as file:
            file.write(response.content)
        return 'src/' + filename
    except Exception as e:
        print(str(e))
        return ''
    # Return the path of the downloaded resource
def gen_file_name(slide_no):
    # Generate random text
    random_text = ''.join(random.choice('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') for _ in range(10))

    # Get current timestamp
    timestamp = int(time.time())

    file_name = f'{slide_no}_{random_text}_{timestamp}'
    return file_name

def get_audio(driver, slide_no, dest_dir):
    audio_obj = { 'src': '', 'script': ''}

    slide_container = driver.find_element(By.CSS_SELECTOR, ".slide-container")

    audio_elements = slide_container.find_elements(By.XPATH, "//audio")
    if len(audio_elements) != 0:
        audio_element = audio_elements[0]
        print("auido")
        src_elements = audio_element.find_elements(By.XPATH, "//source")
        if len(src_elements) != 0:
            src_element = src_elements[0]
            audio_src = src_element.get_attribute('src')

            filename = audio_src.split("/")[-1]
            filename = filename.replace("%", "_").replace("#", "-")
            src = download_resource(audio_src, dest_dir + '/src', filename)
            audio_obj['src'] = src
    return audio_obj