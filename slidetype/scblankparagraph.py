import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
import utils

def check_do(driver, slide_no, dest_dir):

    print('###### Scrap Accordian ######')
    slide_container = driver.find_element(By.CSS_SELECTOR, ".slide-container")

    h1_elements = slide_container.find_elements(By.XPATH, ".//h1 | //h2")
    paragraph_wrap_elements = slide_container.find_elements(By.XPATH, ".//div[contains(@class, 'MuiTypography-root')]")
    # Check Slide Type is Matching
    if len(h1_elements) == 0 and len(paragraph_wrap_elements) == 0:
        return False, ''
    
    scorm_slide = {'type': 'blankparagraph', 'data': {'header': '', 'paragraph':''}}

    header_text = ''
    paragraph_text = ''
    if len(h1_elements) != 0:
        h1_element = h1_elements[0]
        header_text = h1_element.get_attribute('innerHTML')
    if len(paragraph_wrap_elements) != 0:
        paragraph_wrap_element = paragraph_wrap_elements[0]
        paragraph_content_elements = paragraph_wrap_element.find_elements(By.XPATH, ".//div[@data-contents]")
        if len(paragraph_content_elements) != 0:
            paragraph_text = paragraph_content_elements[0].get_attribute('innerHTML')
    

    
    scorm_slide['data']['header'] = header_text
    scorm_slide['data']['paragraph'] = paragraph_text

    scorm_slide['audio'] = utils.get_audio(driver, slide_no, dest_dir)
    
    return True, scorm_slide
    # print(str(scorm_obj))

