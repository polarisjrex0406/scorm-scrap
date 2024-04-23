import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import utils

def check_do(driver, slide_no, dest_dir):

    print('###### Scrap Main ######')
    scorm_slide = {'type': 'matching', 'slide-content':'', 'interactive': [],'audio':{}}
    slide_container = driver.find_element(By.CSS_SELECTOR, ".slide-container")
    
    
    scorm_slide['audio'] = utils.get_audio(driver, slide_no, dest_dir)

    return True, scorm_slide
    # print(str(scorm_obj))

