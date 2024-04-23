import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

import utils

def check_do(driver, slide_no, dest_dir):

    print('###### Scrap Static ######')
    slide_items = []

    slide_container = driver.find_element(By.CSS_SELECTOR, ".slide-container")
    img_elements = slide_container.find_elements(By.TAG_NAME, "img")

    # Check Slide Type is Matching
    if len(img_elements) == 0:
        return False, ''

    for img_element in img_elements:
        print(img_element.get_attribute("src"))
        url = img_element.get_attribute("src")

        filename = url.split("/")[-1]
        filename = filename.replace("%", "_").replace("#", "-")

        src = utils.download_resource(url, dest_dir + '/src', filename)
        driver.execute_script(f"arguments[0].src = 'scorm/{src}';", img_element)
        # img_element.set_attribute('src', src)
      
    return True, slide_items

