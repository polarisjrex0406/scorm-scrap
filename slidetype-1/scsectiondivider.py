import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import utils

def check_do(driver, slide_no, dest_dir):

    print('###### Scrap Accordian ######')
    slide_container = driver.find_element(By.CSS_SELECTOR, ".slide-container")

    h1_elements = slide_container.find_elements(By.XPATH, "//h1[preceding-sibling::div[contains(@class, 'flex')]] | //h2[preceding-sibling::div[contains(@class, 'flex')]]")
    # Check Slide Type is Matching
    if len(h1_elements) == 0:
        return False, ''
    
    scorm_slide = {'type': 'sectiondivider', 'data': {'header': '', 'no':''}}

    header_text = ''
    section_text = ''
    if len(h1_elements) != 0:
        h1_element = h1_elements[0]
        header_text = h1_element.get_attribute('innerHTML')

        section_text_elements = h1_element.find_elements(By.XPATH, "preceding-sibling::div")
        if len(section_text_elements) != 0:
            section_text_element = section_text_elements[0]
            section_text = section_text_element.text

    
    scorm_slide['data']['header'] = header_text
    scorm_slide['data']['no'] = section_text
    scorm_slide['audio'] = utils.get_audio(driver, slide_no, dest_dir)
    
    return True, scorm_slide
    # print(str(scorm_obj))

