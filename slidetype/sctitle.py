import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import utils

def check_do(driver, slide_no, dest_dir):

    print('###### Scrap Title ######')
    header_elements = driver.find_elements(By.XPATH, "//h1 | //h2")
    if len(header_elements) > 0:
        header_element = header_elements[0]
        return True, header_element.text
    return False, None
    # print(str(scorm_obj))

