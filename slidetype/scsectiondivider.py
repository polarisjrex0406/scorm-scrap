import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import utils

def check_do(driver, slide_no, dest_dir, sections):

    print('###### Scrap Section Divider ######')
    for section in sections:
        sec_text = section['text']
        section_elements = driver.find_elements(By.XPATH, f"//h1[text()=\"{sec_text}\"] | //h2[text()=\"{sec_text}\"]")
        if len(section_elements) > 0:
            section['slide_no'] = slide_no
    
    return False, None
    # print(str(scorm_obj))

