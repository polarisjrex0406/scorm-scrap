import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import utils

def do(driver, slide_no, dest_dir):

    print('###### Scrap Main ######')
    slide_container = driver.find_element(By.CSS_SELECTOR, ".slide-container")
    slide_content = slide_container.get_attribute('innerHTML')
    scorm_slide = {'content': slide_content, 'audio': {}}
    scorm_slide['audio'] = utils.get_audio(driver, slide_no, dest_dir)
    
    return scorm_slide

